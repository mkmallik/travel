import React from "react";
import { StyleSheet } from "react-native";
import { FAB as PaperFAB } from "react-native-paper";
import { COLORS } from "../../utils/constants";

interface FABProps {
  icon: string;
  onPress: () => void;
  label?: string;
}

const FAB: React.FC<FABProps> = ({ icon, onPress, label }) => {
  return (
    <PaperFAB
      icon={icon}
      onPress={onPress}
      label={label}
      style={styles.fab}
      color={COLORS.text}
    />
  );
};

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    right: 16,
    bottom: 16,
    backgroundColor: COLORS.primary,
  },
});

export default FAB;
export { FAB };
