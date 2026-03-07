import React from "react";
import { View, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { useRouter } from "expo-router";
import { useCurrentTravel } from "../../hooks/useCurrentTravel";
import { COLORS } from "../../utils/constants";

const TravelSelector: React.FC = () => {
  const router = useRouter();
  const { currentTravel } = useCurrentTravel();

  return (
    <View style={styles.container}>
      <Button
        mode="outlined"
        icon="airplane"
        onPress={() => router.push("/travel/select")}
        style={styles.button}
        textColor={COLORS.text}
        compact
      >
        {currentTravel?.description ?? "Select Trip"}
      </Button>
      <Button
        mode="contained"
        icon="plus"
        onPress={() => router.push("/travel/add")}
        style={styles.addButton}
        compact
      >
        New
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  button: {
    flex: 1,
    borderColor: COLORS.border,
  },
  addButton: {
    backgroundColor: COLORS.primary,
  },
});

export default TravelSelector;
export { TravelSelector };
