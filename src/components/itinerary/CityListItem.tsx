import React from "react";
import { StyleSheet, Image, View, Pressable } from "react-native";
import { Text, Divider } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { ItineraryData } from "../../types/database";
import { COLORS } from "../../utils/constants";
import dayjs from "dayjs";

interface CityListItemProps {
  itinerary: ItineraryData;
  onPress: () => void;
}

const CityListItem: React.FC<CityListItemProps> = ({ itinerary, onPress }) => {
  return (
    <>
      <Pressable onPress={onPress} style={styles.row}>
        {itinerary.city_image_uri ? (
          <Image source={{ uri: itinerary.city_image_uri }} style={styles.thumbnail} />
        ) : (
          <View style={[styles.thumbnail, styles.placeholderThumb]}>
            <Text style={styles.placeholderLetter}>
              {itinerary.city.charAt(0)}
            </Text>
          </View>
        )}

        <View style={styles.info}>
          <Text variant="titleMedium" style={styles.city} numberOfLines={1}>
            {itinerary.city}
          </Text>
          <Text variant="bodySmall" style={styles.date}>
            {dayjs(itinerary.date).format("D/M/YYYY")}
          </Text>
        </View>

        <View style={styles.dayBadge}>
          <MaterialCommunityIcons name="star" size={16} color={COLORS.accent} />
          <Text variant="titleSmall" style={styles.dayText}>
            DAY{itinerary.day_no}
          </Text>
        </View>
      </Pressable>
      <Divider style={styles.divider} />
    </>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.surface,
    gap: 14,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 6,
  },
  placeholderThumb: {
    backgroundColor: COLORS.primaryLight,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderLetter: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.primary,
  },
  info: {
    flex: 1,
  },
  city: {
    fontWeight: "600",
    color: COLORS.text,
  },
  date: {
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  dayBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  dayText: {
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
  divider: {
    backgroundColor: COLORS.border,
  },
});

export default CityListItem;
export { CityListItem };
