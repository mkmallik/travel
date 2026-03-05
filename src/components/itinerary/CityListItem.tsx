import { StyleSheet, Image, View, Pressable } from 'react-native';
import { Text, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { Itinerary } from '../../types/database';
import dayjs from 'dayjs';

interface CityListItemProps {
  itinerary: Itinerary;
  onPress: () => void;
}

export function CityListItem({ itinerary, onPress }: CityListItemProps) {
  return (
    <>
      <Pressable onPress={onPress} style={styles.row}>
        {/* Thumbnail */}
        {itinerary.city_image_uri ? (
          <Image source={{ uri: itinerary.city_image_uri }} style={styles.thumbnail} />
        ) : (
          <View style={[styles.thumbnail, styles.placeholderThumb]}>
            <Text style={styles.placeholderLetter}>
              {itinerary.city.charAt(0)}
            </Text>
          </View>
        )}

        {/* City + date */}
        <View style={styles.info}>
          <Text variant="titleMedium" style={styles.city} numberOfLines={1}>
            {itinerary.city}
          </Text>
          <Text variant="bodySmall" style={styles.date}>
            {dayjs(itinerary.date).format('D/M/YYYY')}
          </Text>
        </View>

        {/* Day badge */}
        <View style={styles.dayBadge}>
          <MaterialCommunityIcons name="star" size={16} color="#777" />
          <Text variant="titleSmall" style={styles.dayText}>
            DAY{itinerary.day_no}
          </Text>
        </View>
      </Pressable>
      <Divider />
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    gap: 14,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 6,
  },
  placeholderThumb: {
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderLetter: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1B5E20',
  },
  info: {
    flex: 1,
  },
  city: {
    fontWeight: '600',
    color: '#222',
  },
  date: {
    color: '#888',
    marginTop: 2,
  },
  dayBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dayText: {
    color: '#555',
    fontWeight: '600',
  },
});
