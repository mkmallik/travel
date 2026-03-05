import { useRef, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import dayjs from 'dayjs';
import { getDaysBetween, isToday } from '../../utils/date';

interface DateSelectorProps {
  startDate: string;
  endDate: string;
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

export function DateSelector({
  startDate,
  endDate,
  selectedDate,
  onSelectDate,
}: DateSelectorProps) {
  const theme = useTheme();
  const days = getDaysBetween(startDate, endDate);
  const scrollRef = useRef<ScrollView>(null);
  const selectedIdx = days.indexOf(selectedDate);

  useEffect(() => {
    if (scrollRef.current && selectedIdx >= 0) {
      setTimeout(() => {
        scrollRef.current?.scrollTo({ x: Math.max(0, selectedIdx * 50 - 100), animated: false });
      }, 50);
    }
  }, [selectedIdx]);

  return (
    <ScrollView
      ref={scrollRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scroll}
      contentContainerStyle={styles.container}
    >
      {days.map((date, idx) => {
        const selected = date === selectedDate;
        const today = isToday(date);
        const d = dayjs(date);
        return (
          <Pressable
            key={date}
            onPress={() => onSelectDate(date)}
            style={[
              styles.chip,
              selected && { backgroundColor: theme.colors.primary },
              today && !selected && { borderColor: theme.colors.primary, borderWidth: 1.5 },
            ]}
          >
            <Text style={[styles.dayName, selected && styles.selectedText]}>
              {d.format('dd')}
            </Text>
            <Text style={[styles.dayNum, selected && styles.selectedText]}>
              {d.format('D')}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    height: 54,
  },
  container: {
    paddingHorizontal: 8,
    paddingTop: 4,
    paddingBottom: 0,
    gap: 4,
  },
  chip: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    width: 46,
    height: 50,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  dayName: {
    fontSize: 10,
    color: '#999',
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  dayNum: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginTop: 1,
  },
  selectedText: {
    color: '#FFFFFF',
  },
});
