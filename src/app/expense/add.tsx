import { useState } from "react";
import { View, StyleSheet, ScrollView, Image } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import * as ImagePicker from "expo-image-picker";
import { useCurrentTravel } from "../../hooks/useCurrentTravel";
import { insertExpense } from "../../db/queries/expense";
import { CategoryPicker } from "../../components/expense/CategoryPicker";
import { CurrencyInput } from "../../components/expense/CurrencyInput";
import { VoiceInput } from "../../components/expense/VoiceInput";
import { toISODate } from "../../utils/date";
import { COLORS } from "../../utils/constants";

export default function AddExpenseScreen() {
  const { date: paramDate } = useLocalSearchParams<{ date?: string }>();
  const db = useSQLiteContext();
  const router = useRouter();
  const { currentTravel } = useCurrentTravel();

  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("food");
  const [date, setDate] = useState(paramDate ?? toISODate(new Date()));
  const [amountEur, setAmountEur] = useState("");
  const [amountLocal, setAmountLocal] = useState("");
  const [localCurrency, setLocalCurrency] = useState("");
  const [receiptUri, setReceiptUri] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const pickReceipt = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setReceiptUri(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) return;
    const result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setReceiptUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!currentTravel || !description.trim() || !amountEur) return;
    setSaving(true);
    try {
      await insertExpense(db, {
        travel_id: currentTravel.travel_id,
        itinerary_id: null,
        date,
        description: description.trim(),
        category,
        amount_eur: parseFloat(amountEur) || 0,
        amount_local: amountLocal ? parseFloat(amountLocal) : null,
        local_currency_code: localCurrency || null,
        receipt_image_uri: receiptUri,
        voice_note_uri: null,
      });
      router.back();
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <VoiceInput onTranscript={setDescription} />

      <TextInput
        label="Description"
        value={description}
        onChangeText={setDescription}
        mode="outlined"
        style={styles.input}
      />

      <TextInput
        label="Date (YYYY-MM-DD)"
        value={date}
        onChangeText={setDate}
        mode="outlined"
        style={styles.input}
      />

      <CategoryPicker selected={category} onSelect={setCategory} />

      <CurrencyInput
        amountEur={amountEur}
        onChangeEur={setAmountEur}
        amountLocal={amountLocal}
        onChangeLocal={setAmountLocal}
        localCurrency={localCurrency}
        onChangeCurrency={setLocalCurrency}
      />

      <View style={styles.receiptRow}>
        <Button mode="outlined" icon="camera" onPress={takePhoto} style={styles.receiptButton} textColor={COLORS.text}>
          Camera
        </Button>
        <Button mode="outlined" icon="image" onPress={pickReceipt} style={styles.receiptButton} textColor={COLORS.text}>
          Gallery
        </Button>
      </View>

      {receiptUri && (
        <Image source={{ uri: receiptUri }} style={styles.receiptPreview} />
      )}

      <Button
        mode="contained"
        onPress={handleSave}
        loading={saving}
        disabled={saving || !description.trim() || !amountEur}
        style={styles.saveButton}
      >
        Add Expense
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
    gap: 16,
  },
  input: {},
  receiptRow: {
    flexDirection: "row",
    gap: 8,
  },
  receiptButton: {
    flex: 1,
    borderColor: COLORS.border,
  },
  receiptPreview: {
    width: "100%",
    height: 200,
    borderRadius: 8,
  },
  saveButton: {
    marginTop: 8,
    marginBottom: 24,
    backgroundColor: COLORS.primary,
  },
});
