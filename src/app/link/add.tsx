import { useState } from "react";
import { StyleSheet, ScrollView } from "react-native";
import { TextInput, Button, SegmentedButtons } from "react-native-paper";
import { useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useCurrentTravel } from "../../hooks/useCurrentTravel";
import { insertLink } from "../../db/queries/links";
import { COLORS, LINK_TYPES } from "../../utils/constants";

export default function AddLinkScreen() {
  const db = useSQLiteContext();
  const router = useRouter();
  const { currentTravel } = useCurrentTravel();

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [type, setType] = useState("other");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!title.trim() || !url.trim() || !currentTravel) return;
    setSaving(true);
    try {
      await insertLink(db, {
        travel_id: currentTravel.travel_id,
        type,
        title: title.trim(),
        url: url.trim(),
        icon_url: null,
      });
      router.back();
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TextInput
        label="Title"
        value={title}
        onChangeText={setTitle}
        mode="outlined"
      />

      <TextInput
        label="URL"
        value={url}
        onChangeText={setUrl}
        mode="outlined"
        keyboardType="url"
        autoCapitalize="none"
      />

      <SegmentedButtons
        value={type}
        onValueChange={setType}
        buttons={LINK_TYPES.map((t) => ({ ...t }))}
        style={styles.segmented}
      />

      <Button
        mode="contained"
        onPress={handleSave}
        loading={saving}
        disabled={saving || !title.trim() || !url.trim()}
        style={styles.saveButton}
      >
        Add Link
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
  segmented: {
    marginTop: 8,
  },
  saveButton: {
    marginTop: 8,
    backgroundColor: COLORS.primary,
  },
});
