import { useState, useCallback } from "react";
import { View, SectionList, StyleSheet, Linking } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { List, Text, IconButton, Divider } from "react-native-paper";
import { useCurrentTravel } from "../../hooks/useCurrentTravel";
import { getLinksByTravel, deleteLink } from "../../db/queries/links";
import { TravelSelector } from "../../components/common/TravelSelector";
import { EmptyState } from "../../components/common/EmptyState";
import { FAB } from "../../components/common/FAB";
import { COLORS, TYPE_LABELS, TYPE_ICONS } from "../../utils/constants";
import type { LinkData } from "../../types/database";

interface Section {
  title: string;
  data: LinkData[];
}

export default function DataLinksTab() {
  const db = useSQLiteContext();
  const router = useRouter();
  const { currentTravel } = useCurrentTravel();
  const [sections, setSections] = useState<Section[]>([]);

  const loadLinks = useCallback(async () => {
    if (currentTravel) {
      const links = await getLinksByTravel(db, currentTravel.travel_id);
      const grouped: Record<string, LinkData[]> = {};
      for (const link of links) {
        const type = link.type || "other";
        if (!grouped[type]) grouped[type] = [];
        grouped[type].push(link);
      }
      setSections(
        Object.entries(grouped).map(([type, data]) => ({
          title: TYPE_LABELS[type] ?? type,
          data,
        }))
      );
    } else {
      setSections([]);
    }
  }, [currentTravel?.travel_id]);

  useFocusEffect(
    useCallback(() => {
      loadLinks();
    }, [loadLinks])
  );

  const handleDelete = async (linkId: number) => {
    await deleteLink(db, linkId);
    loadLinks();
  };

  const totalLinks = sections.reduce((sum, s) => sum + s.data.length, 0);

  return (
    <View style={styles.container}>
      <TravelSelector />
      {totalLinks === 0 ? (
        <EmptyState
          icon="link-variant"
          title="No Links"
          subtitle={
            currentTravel
              ? "Add useful links for your trip"
              : "Create a trip first"
          }
        />
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => String(item.link_id)}
          renderSectionHeader={({ section }) => (
            <Text variant="titleSmall" style={styles.sectionHeader}>
              {section.title}
            </Text>
          )}
          ItemSeparatorComponent={() => <Divider style={styles.divider} />}
          renderItem={({ item }) => (
            <List.Item
              title={item.title}
              titleStyle={styles.linkTitle}
              description={item.url}
              descriptionStyle={styles.linkUrl}
              descriptionNumberOfLines={1}
              style={styles.listItem}
              left={(props) => (
                <List.Icon
                  {...props}
                  icon={TYPE_ICONS[item.type] ?? "link-variant"}
                  color={COLORS.textSecondary}
                />
              )}
              right={() => (
                <View style={styles.actions}>
                  <IconButton
                    icon="open-in-new"
                    size={20}
                    iconColor={COLORS.primary}
                    onPress={() => Linking.openURL(item.url)}
                  />
                  <IconButton
                    icon="delete-outline"
                    size={20}
                    iconColor={COLORS.error}
                    onPress={() => handleDelete(item.link_id)}
                  />
                </View>
              )}
            />
          )}
        />
      )}
      {currentTravel && (
        <FAB icon="plus" onPress={() => router.push("/link/add")} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: COLORS.surfaceLight,
    color: COLORS.textSecondary,
  },
  listItem: {
    backgroundColor: COLORS.surface,
  },
  linkTitle: {
    color: COLORS.text,
  },
  linkUrl: {
    color: COLORS.textSecondary,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
  divider: {
    backgroundColor: COLORS.border,
  },
});
