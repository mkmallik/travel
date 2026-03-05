import { StyleSheet } from 'react-native';
import { FAB as PaperFAB } from 'react-native-paper';

interface FABProps {
  icon: string;
  onPress: () => void;
  label?: string;
}

export function FAB({ icon, onPress, label }: FABProps) {
  return (
    <PaperFAB
      icon={icon}
      onPress={onPress}
      label={label}
      style={styles.fab}
    />
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
});
