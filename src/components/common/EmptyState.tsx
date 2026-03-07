import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Icon } from "react-native-paper";
import { COLORS } from "../../utils/constants";

interface EmptyStateProps {
  icon: string;
  title: string;
  subtitle?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, subtitle }) => {
  return (
    <View style={styles.container}>
      <Icon source={icon} size={64} color={COLORS.border} />
      <Text variant="titleMedium" style={styles.title}>
        {title}
      </Text>
      {subtitle && (
        <Text variant="bodyMedium" style={styles.subtitle}>
          {subtitle}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  title: {
    marginTop: 16,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  subtitle: {
    marginTop: 8,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
});

export default EmptyState;
export { EmptyState };
