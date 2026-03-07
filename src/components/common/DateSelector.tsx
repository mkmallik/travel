import React, { useRef, useEffect } from "react";
import { View, StyleSheet, ScrollView, Pressable } from "react-native";
import { Text } from "react-native-paper";
import dayjs from "dayjs";
import { getDaysBetween, isToday } from "../../utils/date";
import { COLORS } from "../../utils/constants";

interface DateSelectorProps {
  startDate: string;
  endDate: string;
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({
  startDate,
  endDate,
  selectedDate,
  onSelectDate,
}) => {
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
      {days.map((date) => {
        const selected = date === selectedDate;
        const today = isToday(date);
        const d = dayjs(date);
        return (
          <Pressable
            key={date}
            onPress={() => onSelectDate(date)}
            style={[
              styles.chip,
              selected && styles.selectedChip,
              today && !selected && styles.todayChip,
            ]}
          >
            <Text style={[styles.dayName, selected && styles.selectedText]}>
              {d.format("dd")}
            </Text>
            <Text style={[styles.dayNum, selected && styles.selectedText]}>
              {d.format("D")}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
};

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
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 10,
    width: 46,
    height: 50,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  selectedChip: {
    backgroundColor: COLORS.primary,
  },
  todayChip: {
    borderColor: COLORS.primary,
  },
  dayName: {
    fontSize: 10,
    color: COLORS.textSecondary,
    fontWeight: "500",
    textTransform: "uppercase",
  },
  dayNum: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
    marginTop: 1,
  },
  selectedText: {
    color: "#FFFFFF",
  },
});

export default DateSelector;
export { DateSelector };
