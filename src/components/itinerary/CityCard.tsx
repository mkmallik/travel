import { StyleSheet, Image, View } from 'react-native';
import { Card, Text, Button, IconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { Itinerary } from '../../types/database';
import dayjs from 'dayjs';

interface CityCardProps {
  itinerary: Itinerary;
  onPress: () => void;
}

export function CityCard({ itinerary, onPress }: CityCardProps) {
  return (
    <Card style={styles.card} onPress={onPress}>
      {/* Header: DAY badge + date */}
      <View style={styles.header}>
        <View style={styles.dayBadge}>
          <MaterialCommunityIcons name="star" size={14} color="#555" />
          <Text variant="titleMedium" style={styles.dayText}>
            DAY{itinerary.day_no}
          </Text>
        </View>
        <Text variant="bodyMedium" style={styles.dateText}>
          {dayjs(itinerary.date).format('D/M/YYYY')}
        </Text>
      </View>

      {/* City image */}
      {itinerary.city_image_uri ? (
        <Card.Cover
          source={{ uri: itinerary.city_image_uri }}
          style={styles.cover}
        />
      ) : (
        <View style={styles.placeholderCover}>
          <MaterialCommunityIcons name="image-area" size={48} color="#ccc" />
        </View>
      )}

      {/* City name + hotel */}
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

      {/* Actions row */}
      <Card.Actions style={styles.actions}>
        <Button
          mode="text"
          textColor="#1976D2"
          onPress={onPress}
          compact
        >
          GO TO DETAILS
        </Button>
      </Card.Actions>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    elevation: 2,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
  },
  dayBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dayText: {
    fontWeight: '700',
    color: '#333',
  },
  dateText: {
    color: '#888',
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
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingTop: 12,
    paddingBottom: 4,
  },
  cityName: {
    fontWeight: '600',
    color: '#222',
  },
  hotelName: {
    color: '#888',
    marginTop: 2,
  },
  actions: {
    justifyContent: 'flex-start',
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
});
