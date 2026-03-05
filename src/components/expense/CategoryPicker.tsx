import { View, StyleSheet } from 'react-native';
import { Chip, Text } from 'react-native-paper';
import { EXPENSE_CATEGORIES } from '../../utils/categories';
import { CATEGORY_COLORS } from '../../constants/theme';

interface CategoryPickerProps {
  selected: string;
  onSelect: (category: string) => void;
}

export function CategoryPicker({ selected, onSelect }: CategoryPickerProps) {
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
                backgroundColor: CATEGORY_COLORS[cat.value] + '20',
              },
            ]}
            textStyle={
              selected === cat.value
                ? { color: CATEGORY_COLORS[cat.value] }
                : undefined
            }
          >
            {cat.label}
          </Chip>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    marginBottom: 8,
    color: '#424242',
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    marginBottom: 4,
  },
});
