import { useState, useCallback } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { IconButton } from "react-native-paper";
import { useCurrentTravel } from "../../hooks/useCurrentTravel";
import { getItinerariesByTravel } from "../../db/queries/itinerary";
import { CityCard } from "../../components/itinerary/CityCard";
import { CityListItem } from "../../components/itinerary/CityListItem";
import { TravelSelector } from "../../components/common/TravelSelector";
import { EmptyState } from "../../components/common/EmptyState";
import { FAB } from "../../components/common/FAB";
import { COLORS } from "../../utils/constants";
import type { ItineraryData } from "../../types/database";

export default function ItinerariesTab() {
  const router = useRouter();
  const { currentTravel } = useCurrentTravel();
  const [itineraries, setItineraries] = useState<ItineraryData[]>([]);
  const [viewMode, setViewMode] = useState<"list" | "card">("list");

  useFocusEffect(
    useCallback(() => {
      if (currentTravel) {
        getItinerariesByTravel(currentTravel.travel_id).then(
          setItineraries
        );
      } else {
        setItineraries([]);
      }
    }, [currentTravel?.travel_id])
  );

  const navigateToDetail = (id: number) => {
    router.push(`/itinerary/${id}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.selectorWrap}>
          <TravelSelector />
        </View>
        {itineraries.length > 0 && (
          <IconButton
            icon={viewMode === "list" ? "view-grid" : "view-list"}
            size={22}
            iconColor={COLORS.textSecondary}
            onPress={() => setViewMode(viewMode === "list" ? "card" : "list")}
            style={styles.toggleButton}
          />
        )}
      </View>

      {itineraries.length === 0 ? (
        <EmptyState
          icon="map-marker-path"
          title="No Itineraries Yet"
          subtitle={
            currentTravel
              ? "Add your first day to start planning"
              : "Create a trip first"
          }
        />
      ) : (
        <FlatList
          data={itineraries}
          keyExtractor={(item) => String(item.itinerary_id)}
          renderItem={({ item }) =>
            viewMode === "list" ? (
              <CityListItem
                itinerary={item}
                onPress={() => navigateToDetail(item.itinerary_id)}
              />
            ) : (
              <CityCard
                itinerary={item}
                onPress={() => navigateToDetail(item.itinerary_id)}
              />
            )
          }
          contentContainerStyle={styles.listContent}
        />
      )}
      {currentTravel && (
        <FAB
          icon="plus"
          onPress={() =>
            router.push({
              pathname: "/itinerary/[id]",
              params: { id: "new" },
            })
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  selectorWrap: {
    flex: 1,
  },
  toggleButton: {
    marginRight: 4,
  },
  listContent: {
    paddingBottom: 80,
  },
});
