import { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Image } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import * as ImagePicker from "expo-image-picker";
import {
  getExpenseById,
  updateExpense,
  deleteExpense,
} from "../../db/queries/expense";
import { CategoryPicker } from "../../components/expense/CategoryPicker";
import { CurrencyInput } from "../../components/expense/CurrencyInput";
import { VoiceInput } from "../../components/expense/VoiceInput";
import { COLORS } from "../../utils/constants";

export default function EditExpenseScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const db = useSQLiteContext();
  const router = useRouter();

  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("food");
  const [date, setDate] = useState("");
  const [amountEur, setAmountEur] = useState("");
  const [amountLocal, setAmountLocal] = useState("");
  const [localCurrency, setLocalCurrency] = useState("");
  const [receiptUri, setReceiptUri] = useState<string | null>(null);
  const [travelId, setTravelId] = useState(0);
  const [itineraryId, setItineraryId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) {
      getExpenseById(db, Number(id)).then((exp) => {
        if (exp) {
          setDescription(exp.description);
          setCategory(exp.category);
          setDate(exp.date);
          setAmountEur(exp.amount_eur.toString());
          setAmountLocal(exp.amount_local?.toString() ?? "");
          setLocalCurrency(exp.local_currency_code ?? "");
          setReceiptUri(exp.receipt_image_uri);
          setTravelId(exp.travel_id);
          setItineraryId(exp.itinerary_id);
        }
      });
    }
  }, [id]);

  const pickReceipt = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setReceiptUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!description.trim() || !amountEur) return;
    setSaving(true);
    try {
      await updateExpense(db, {
        expense_id: Number(id),
        travel_id: travelId,
        itinerary_id: itineraryId,
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

  const handleDelete = async () => {
    await deleteExpense(db, Number(id));
    router.back();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <VoiceInput onTranscript={setDescription} />

      <TextInput
        label="Description"
        value={description}
        onChangeText={setDescription}
        mode="outlined"
      />

      <TextInput
        label="Date (YYYY-MM-DD)"
        value={date}
        onChangeText={setDate}
        mode="outlined"
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

      <Button mode="outlined" icon="image" onPress={pickReceipt} textColor={COLORS.text}>
        {receiptUri ? "Change Receipt" : "Add Receipt"}
      </Button>

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
        Update Expense
      </Button>

      <Button
        mode="outlined"
        textColor={COLORS.error}
        onPress={handleDelete}
        style={styles.deleteButton}
      >
        Delete Expense
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
  receiptPreview: {
    width: "100%",
    height: 200,
    borderRadius: 8,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
  },
  deleteButton: {
    borderColor: COLORS.error,
    marginBottom: 24,
  },
});
