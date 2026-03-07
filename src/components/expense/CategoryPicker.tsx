import React from "react";
import { View, StyleSheet } from "react-native";
import { Chip, Text } from "react-native-paper";
import { EXPENSE_CATEGORIES, CATEGORY_COLORS, COLORS } from "../../utils/constants";

interface CategoryPickerProps {
  selected: string;
  onSelect: (category: string) => void;
}

const CategoryPicker: React.FC<CategoryPickerProps> = ({ selected, onSelect }) => {
  return (
    <View>
      <Text variant="labelLarge" style={styles.label}>
        Category
      </Text>
      <View style={styles.container}>
        {EXPENSE_CATEGORIES.map((cat) => (
          <Chip
            key={cat.value}
            selected={selected === cat.value}
            onPress={() => onSelect(cat.value)}
            style={[
              styles.chip,
              selected === cat.value && {
                backgroundColor: CATEGORY_COLORS[cat.value] + "20",
              },
            ]}
            textStyle={
              selected === cat.value
                ? { color: CATEGORY_COLORS[cat.value] }
                : { color: COLORS.textSecondary }
            }
          >
            {cat.label}
          </Chip>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    marginBottom: 8,
    color: COLORS.textSecondary,
  },
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    marginBottom: 4,
    backgroundColor: COLORS.surfaceLight,
  },
});

export default CategoryPicker;
export { CategoryPicker };
