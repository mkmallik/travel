import React from "react";
import { StyleSheet, Image, View } from "react-native";
import { Card, Text, Button } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { ItineraryData } from "../../types/database";
import { COLORS } from "../../utils/constants";
import dayjs from "dayjs";

interface CityCardProps {
  itinerary: ItineraryData;
  onPress: () => void;
}

const CityCard: React.FC<CityCardProps> = ({ itinerary, onPress }) => {
  return (
    <Card style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.dayBadge}>
          <MaterialCommunityIcons name="star" size={14} color={COLORS.accent} />
          <Text variant="titleMedium" style={styles.dayText}>
            DAY{itinerary.day_no}
          </Text>
        </View>
        <Text variant="bodyMedium" style={styles.dateText}>
          {dayjs(itinerary.date).format("D/M/YYYY")}
        </Text>
      </View>

      {itinerary.city_image_uri ? (
        <Card.Cover
          source={{ uri: itinerary.city_image_uri }}
          style={styles.cover}
        />
      ) : (
        <View style={styles.placeholderCover}>
          <MaterialCommunityIcons name="image-area" size={48} color={COLORS.border} />
        </View>
      )}

      <Card.Content style={styles.content}>
        <Text variant="headlineSmall" style={styles.cityName}>
          {itinerary.city}
        </Text>
        {itinerary.hotel_name && (
          <Text variant="bodyMedium" style={styles.hotelName}>
            {itinerary.hotel_name}
          </Text>
        )}
      </Card.Content>

      <Card.Actions style={styles.actions}>
        <Button
          mode="text"
          textColor={COLORS.primary}
          onPress={onPress}
          compact
        >
          GO TO DETAILS
        </Button>
      </Card.Actions>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
  },
  dayBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dayText: {
    fontWeight: "700",
    color: COLORS.text,
  },
  dateText: {
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  cover: {
    height: 200,
    marginHorizontal: 12,
    borderRadius: 4,
  },
  placeholderCover: {
    height: 200,
    marginHorizontal: 12,
    borderRadius: 4,
    backgroundColor: COLORS.surfaceLight,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    paddingTop: 12,
    paddingBottom: 4,
  },
  cityName: {
    fontWeight: "600",
    color: COLORS.text,
  },
  hotelName: {
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  actions: {
    justifyContent: "flex-start",
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
});

export default CityCard;
export { CityCard };
