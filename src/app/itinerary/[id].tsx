import { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Image, Pressable } from "react-native";
import { TextInput, Button, Text, Divider, IconButton } from "react-native-paper";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import * as ImagePicker from "expo-image-picker";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useCurrentTravel } from "../../hooks/useCurrentTravel";
import {
  getItineraryById,
  insertItinerary,
  updateItinerary,
  deleteItinerary,
} from "../../db/queries/itinerary";
import { toISODate } from "../../utils/date";
import { formatEUR } from "../../utils/currency";
import { COLORS } from "../../utils/constants";
import type { ItineraryData } from "../../types/database";
import dayjs from "dayjs";

interface LabeledFieldProps {
  label: string;
  children: React.ReactNode;
}

const LabeledField: React.FC<LabeledFieldProps> = ({ label, children }) => {
  return (
    <View style={styles.field}>
      <Text variant="labelMedium" style={styles.fieldLabel}>{label}</Text>
      {children}
    </View>
  );
};

interface ReadOnlySectionProps {
  itinerary: ItineraryData;
}

const ReadOnlySection: React.FC<ReadOnlySectionProps> = ({ itinerary }) => {
  const router = useRouter();
  const totalCost =
    (itinerary.transport_cost ?? 0) +
    (itinerary.hotel_cost ?? 0) +
    (itinerary.food_cost ?? 0) +
    (itinerary.transportation_cost ?? 0) +
    (itinerary.activities_cost ?? 0) +
    (itinerary.misc_cost ?? 0);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.readContent}>
      {itinerary.city_image_uri ? (
        <Pressable onPress={() => router.push({ pathname: "/itinerary/[id]/photo", params: { id: String(itinerary.itinerary_id), uri: itinerary.city_image_uri! } })}>
          <Image source={{ uri: itinerary.city_image_uri }} style={styles.heroImage} />
        </Pressable>
      ) : (
        <View style={styles.heroPlaceholder}>
          <MaterialCommunityIcons name="image-area" size={64} color={COLORS.border} />
        </View>
      )}

      <LabeledField label="Destination">
        <Text variant="titleLarge" style={styles.fieldValue}>
          DAY{itinerary.day_no} - {dayjs(itinerary.date).format("DD-MM-YYYY")} - {itinerary.city}
        </Text>
      </LabeledField>

      {itinerary.activity_description && (
        <>
          <Divider style={styles.divider} />
          <LabeledField label="Activities">
            <Text variant="bodyLarge" style={styles.fieldValue}>{itinerary.activity_description}</Text>
          </LabeledField>
        </>
      )}
      {itinerary.notes && (
        <>
          <Divider style={styles.divider} />
          <LabeledField label="Notes">
            <Text variant="bodyLarge" style={styles.fieldValue}>{itinerary.notes}</Text>
          </LabeledField>
        </>
      )}

      {itinerary.hotel_name && (
        <>
          <Divider style={styles.divider} />
          <LabeledField label="Name of Accommodation">
            <Text variant="titleMedium" style={styles.fieldValue}>{itinerary.hotel_name}</Text>
          </LabeledField>

          {itinerary.hotel_address && (
            <LabeledField label="Address">
              <View style={styles.addressRow}>
                <Text variant="bodyLarge" style={[styles.fieldValue, { flex: 1 }]}>{itinerary.hotel_address}</Text>
                <MaterialCommunityIcons name="map-marker" size={24} color={COLORS.textSecondary} />
              </View>
            </LabeledField>
          )}

          {itinerary.booking_id && (
            <LabeledField label="Booking Reference">
              <Text variant="bodyLarge" style={styles.fieldValue}>{itinerary.booking_id}</Text>
            </LabeledField>
          )}
        </>
      )}

      {(itinerary.flight_detail || itinerary.transport_mode) && (
        <>
          <Divider style={styles.divider} />
          <LabeledField label="Travel Details">
            {itinerary.flight_detail && (
              <Text variant="bodyLarge" style={styles.fieldValue}>{itinerary.flight_detail}</Text>
            )}
            {itinerary.transport_mode && (
              <Text variant="bodyLarge" style={styles.fieldValue}>
                Mode: {itinerary.transport_mode}
              </Text>
            )}
          </LabeledField>
        </>
      )}

      <Divider style={styles.divider} />
      <LabeledField label="Cost Breakdown">
        <View style={styles.costGrid}>
          {itinerary.transport_cost != null && itinerary.transport_cost > 0 && (
            <View style={styles.costRow}>
              <Text variant="labelMedium" style={styles.costLabel}>Transport</Text>
              <Text variant="bodyLarge" style={styles.costValue}>{formatEUR(itinerary.transport_cost)}</Text>
            </View>
          )}
          {itinerary.hotel_cost != null && itinerary.hotel_cost > 0 && (
            <View style={styles.costRow}>
              <Text variant="labelMedium" style={styles.costLabel}>Hotels</Text>
              <Text variant="bodyLarge" style={styles.costValue}>{formatEUR(itinerary.hotel_cost)}</Text>
            </View>
          )}
          {itinerary.food_cost != null && itinerary.food_cost > 0 && (
            <View style={styles.costRow}>
              <Text variant="labelMedium" style={styles.costLabel}>Food</Text>
              <Text variant="bodyLarge" style={styles.costValue}>{formatEUR(itinerary.food_cost)}</Text>
            </View>
          )}
          {itinerary.transportation_cost != null && itinerary.transportation_cost > 0 && (
            <View style={styles.costRow}>
              <Text variant="labelMedium" style={styles.costLabel}>Local Transport</Text>
              <Text variant="bodyLarge" style={styles.costValue}>{formatEUR(itinerary.transportation_cost)}</Text>
            </View>
          )}
          {itinerary.activities_cost != null && itinerary.activities_cost > 0 && (
            <View style={styles.costRow}>
              <Text variant="labelMedium" style={styles.costLabel}>Activities</Text>
              <Text variant="bodyLarge" style={styles.costValue}>{formatEUR(itinerary.activities_cost)}</Text>
            </View>
          )}
          {itinerary.misc_cost != null && itinerary.misc_cost > 0 && (
            <View style={styles.costRow}>
              <Text variant="labelMedium" style={styles.costLabel}>Miscellaneous</Text>
              <Text variant="bodyLarge" style={styles.costValue}>{formatEUR(itinerary.misc_cost)}</Text>
            </View>
          )}
        </View>
      </LabeledField>

      {totalCost > 0 && (
        <View style={styles.totalBar}>
          <Text variant="titleMedium" style={styles.totalLabel}>Day Total</Text>
          <Text variant="headlineSmall" style={styles.totalAmount}>{formatEUR(totalCost)}</Text>
        </View>
      )}
    </ScrollView>
  );
};

export default function ItineraryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const db = useSQLiteContext();
  const router = useRouter();
  const { currentTravel } = useCurrentTravel();
  const isNew = id === "new";

  const [editing, setEditing] = useState(isNew);
  const [itinerary, setItinerary] = useState<ItineraryData | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    date: toISODate(new Date()),
    day_no: 1,
    city: "",
    city_image_uri: null as string | null,
    flight_detail: "",
    transport_mode: "",
    transport_cost: "",
    hotel_name: "",
    hotel_address: "",
    booking_id: "",
    hotel_cost: "",
    food_cost: "",
    transportation_cost: "",
    activities_cost: "",
    misc_cost: "",
    activity_description: "",
    notes: "",
  });

  useEffect(() => {
    if (!isNew && id) {
      getItineraryById(db, Number(id)).then((it) => {
        if (it) {
          setItinerary(it);
          setForm({
            date: it.date,
            day_no: it.day_no,
            city: it.city,
            city_image_uri: it.city_image_uri,
            flight_detail: it.flight_detail ?? "",
            transport_mode: it.transport_mode ?? "",
            transport_cost: it.transport_cost?.toString() ?? "",
            hotel_name: it.hotel_name ?? "",
            hotel_address: it.hotel_address ?? "",
            booking_id: it.booking_id ?? "",
            hotel_cost: it.hotel_cost?.toString() ?? "",
            food_cost: it.food_cost?.toString() ?? "",
            transportation_cost: it.transportation_cost?.toString() ?? "",
            activities_cost: it.activities_cost?.toString() ?? "",
            misc_cost: it.misc_cost?.toString() ?? "",
            activity_description: it.activity_description ?? "",
            notes: it.notes ?? "",
          });
        }
      });
    }
  }, [id]);

  const pickCityImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setForm((f) => ({ ...f, city_image_uri: result.assets[0].uri }));
    }
  };

  const handleSave = async () => {
    if (!form.city.trim() || !currentTravel) return;
    setSaving(true);
    try {
      const data: Omit<ItineraryData, "itinerary_id"> = {
        travel_id: currentTravel.travel_id,
        date: form.date,
        day_no: form.day_no,
        city: form.city.trim(),
        city_image_uri: form.city_image_uri,
        flight_detail: form.flight_detail || null,
        transport_mode: form.transport_mode || null,
        transport_cost: form.transport_cost ? parseFloat(form.transport_cost) : null,
        hotel_name: form.hotel_name || null,
        hotel_address: form.hotel_address || null,
        booking_id: form.booking_id || null,
        hotel_cost: form.hotel_cost ? parseFloat(form.hotel_cost) : null,
        food_cost: form.food_cost ? parseFloat(form.food_cost) : null,
        transportation_cost: form.transportation_cost ? parseFloat(form.transportation_cost) : null,
        activities_cost: form.activities_cost ? parseFloat(form.activities_cost) : null,
        misc_cost: form.misc_cost ? parseFloat(form.misc_cost) : null,
        activity_description: form.activity_description || null,
        notes: form.notes || null,
      };

      if (isNew) {
        await insertItinerary(db, data);
      } else {
        await updateItinerary(db, { ...data, itinerary_id: Number(id) });
      }
      if (isNew) {
        router.back();
      } else {
        const updated = await getItineraryById(db, Number(id));
        setItinerary(updated);
        setEditing(false);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!isNew && id) {
      await deleteItinerary(db, Number(id));
      router.back();
    }
  };

  if (!editing && itinerary) {
    return (
      <>
        <Stack.Screen
          options={{
            title: `Day ${itinerary.day_no} - ${itinerary.city}`,
            headerRight: () => (
              <View style={{ flexDirection: "row" }}>
                <IconButton icon="pencil" iconColor={COLORS.text} onPress={() => setEditing(true)} />
                <IconButton icon="delete" iconColor={COLORS.error} onPress={handleDelete} />
              </View>
            ),
          }}
        />
        <ReadOnlySection itinerary={itinerary} />
      </>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.editContent}>
      {form.city_image_uri ? (
        <Pressable onPress={pickCityImage}>
          <Image source={{ uri: form.city_image_uri }} style={styles.heroImage} />
        </Pressable>
      ) : (
        <Button mode="outlined" icon="camera" onPress={pickCityImage} style={styles.imageButton} textColor={COLORS.text}>
          Add City Photo
        </Button>
      )}

      <Text variant="titleMedium" style={styles.sectionTitle}>Basic Info</Text>
      <TextInput label="City" value={form.city} onChangeText={(v) => setForm((f) => ({ ...f, city: v }))} mode="outlined" style={styles.input} />
      <TextInput label="Date (YYYY-MM-DD)" value={form.date} onChangeText={(v) => setForm((f) => ({ ...f, date: v }))} mode="outlined" style={styles.input} />
      <TextInput label="Day Number" value={String(form.day_no)} onChangeText={(v) => setForm((f) => ({ ...f, day_no: parseInt(v) || 1 }))} keyboardType="number-pad" mode="outlined" style={styles.input} />

      <Text variant="titleMedium" style={styles.sectionTitle}>Transport</Text>
      <TextInput label="Flight / Transport Detail" value={form.flight_detail} onChangeText={(v) => setForm((f) => ({ ...f, flight_detail: v }))} mode="outlined" style={styles.input} />
      <TextInput label="Transport Mode" value={form.transport_mode} onChangeText={(v) => setForm((f) => ({ ...f, transport_mode: v }))} mode="outlined" style={styles.input} placeholder="Flight, Train, Bus, Ferry..." />
      <TextInput label="Transport Cost (EUR)" value={form.transport_cost} onChangeText={(v) => setForm((f) => ({ ...f, transport_cost: v }))} keyboardType="decimal-pad" mode="outlined" style={styles.input} />

      <Text variant="titleMedium" style={styles.sectionTitle}>Accommodation</Text>
      <TextInput label="Hotel Name" value={form.hotel_name} onChangeText={(v) => setForm((f) => ({ ...f, hotel_name: v }))} mode="outlined" style={styles.input} />
      <TextInput label="Hotel Address" value={form.hotel_address} onChangeText={(v) => setForm((f) => ({ ...f, hotel_address: v }))} mode="outlined" style={styles.input} />
      <TextInput label="Booking ID" value={form.booking_id} onChangeText={(v) => setForm((f) => ({ ...f, booking_id: v }))} mode="outlined" style={styles.input} />
      <TextInput label="Hotel Cost (EUR)" value={form.hotel_cost} onChangeText={(v) => setForm((f) => ({ ...f, hotel_cost: v }))} keyboardType="decimal-pad" mode="outlined" style={styles.input} />

      <Text variant="titleMedium" style={styles.sectionTitle}>Daily Costs</Text>
      <TextInput label="Food (EUR)" value={form.food_cost} onChangeText={(v) => setForm((f) => ({ ...f, food_cost: v }))} keyboardType="decimal-pad" mode="outlined" style={styles.input} />
      <TextInput label="Local Transport (EUR)" value={form.transportation_cost} onChangeText={(v) => setForm((f) => ({ ...f, transportation_cost: v }))} keyboardType="decimal-pad" mode="outlined" style={styles.input} />
      <TextInput label="Activities (EUR)" value={form.activities_cost} onChangeText={(v) => setForm((f) => ({ ...f, activities_cost: v }))} keyboardType="decimal-pad" mode="outlined" style={styles.input} />
      <TextInput label="Misc (EUR)" value={form.misc_cost} onChangeText={(v) => setForm((f) => ({ ...f, misc_cost: v }))} keyboardType="decimal-pad" mode="outlined" style={styles.input} />

      <Text variant="titleMedium" style={styles.sectionTitle}>Notes</Text>
      <TextInput label="Activities" value={form.activity_description} onChangeText={(v) => setForm((f) => ({ ...f, activity_description: v }))} mode="outlined" multiline numberOfLines={3} style={styles.input} />
      <TextInput label="Notes" value={form.notes} onChangeText={(v) => setForm((f) => ({ ...f, notes: v }))} mode="outlined" multiline numberOfLines={3} style={styles.input} />

      <Button mode="contained" onPress={handleSave} loading={saving} disabled={saving || !form.city.trim()} style={styles.saveButton}>
        {isNew ? "Add Day" : "Save Changes"}
      </Button>
      {!isNew && (
        <Button mode="text" onPress={() => setEditing(false)} style={styles.cancelButton} textColor={COLORS.textSecondary}>
          Cancel
        </Button>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  readContent: {
    paddingBottom: 40,
  },
  editContent: {
    padding: 16,
    paddingBottom: 40,
  },
  heroImage: {
    width: "100%",
    height: 240,
  },
  heroPlaceholder: {
    width: "100%",
    height: 240,
    backgroundColor: COLORS.surfaceLight,
    justifyContent: "center",
    alignItems: "center",
  },
  field: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  fieldLabel: {
    color: COLORS.primary,
    fontSize: 13,
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  fieldValue: {
    color: COLORS.text,
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  divider: {
    marginHorizontal: 20,
    marginVertical: 4,
    backgroundColor: COLORS.border,
  },
  costGrid: {
    gap: 6,
  },
  costRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  costLabel: {
    color: COLORS.primary,
    fontSize: 13,
  },
  costValue: {
    color: COLORS.text,
    fontWeight: "500",
  },
  totalBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    marginTop: 8,
    backgroundColor: COLORS.primary + "20",
  },
  totalLabel: {
    fontWeight: "600",
    color: COLORS.text,
  },
  totalAmount: {
    color: COLORS.primary,
    fontWeight: "700",
  },
  imageButton: {
    marginBottom: 16,
    borderColor: COLORS.border,
  },
  sectionTitle: {
    fontWeight: "700",
    color: COLORS.primary,
    marginTop: 20,
    marginBottom: 8,
  },
  input: {
    marginBottom: 8,
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: COLORS.primary,
  },
  cancelButton: {
    marginTop: 8,
    marginBottom: 24,
  },
});
