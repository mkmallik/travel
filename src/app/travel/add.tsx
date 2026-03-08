import { useState } from "react";
import { StyleSheet, ScrollView } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { insertTravel } from "../../db/queries/travel";
import { useCurrentTravel } from "../../hooks/useCurrentTravel";
import { useAuth } from "../../hooks/useAuth";
import { toISODate } from "../../utils/date";
import { COLORS } from "../../utils/constants";

export default function AddTravelScreen() {
  const router = useRouter();
  const { refreshTravels, setCurrentTravelId } = useCurrentTravel();
  const { user } = useAuth();

  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState(toISODate(new Date()));
  const [endDate, setEndDate] = useState(toISODate(new Date()));
  const [countries, setCountries] = useState("");
  const [coverUri, setCoverUri] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setCoverUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!description.trim()) return;
    setSaving(true);
    try {
      const id = await insertTravel({
        user_id: user!.user_id,
        description: description.trim(),
        start_date: startDate,
        end_date: endDate,
        countries: countries.trim(),
        cover_image_uri: coverUri,
      });
      await refreshTravels();
      setCurrentTravelId(id);
      router.back();
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TextInput
        label="Trip Name"
        value={description}
        onChangeText={setDescription}
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="Start Date (YYYY-MM-DD)"
        value={startDate}
        onChangeText={setStartDate}
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="End Date (YYYY-MM-DD)"
        value={endDate}
        onChangeText={setEndDate}
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="Countries (comma-separated)"
        value={countries}
        onChangeText={setCountries}
        mode="outlined"
        style={styles.input}
      />
      <Button mode="outlined" icon="image" onPress={pickImage} style={styles.input} textColor={COLORS.text}>
        {coverUri ? "Change Cover Photo" : "Add Cover Photo"}
      </Button>
      <Button
        mode="contained"
        onPress={handleSave}
        loading={saving}
        disabled={saving || !description.trim()}
        style={styles.saveButton}
      >
        Create Trip
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 16,
    gap: 12,
  },
  input: {},
  saveButton: {
    marginTop: 8,
    backgroundColor: COLORS.primary,
  },
});
