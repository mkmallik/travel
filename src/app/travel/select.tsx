import { View, StyleSheet, FlatList } from "react-native";
import { List, Divider, Text } from "react-native-paper";
import { useRouter } from "expo-router";
import { useCurrentTravel } from "../../hooks/useCurrentTravel";
import { formatDate } from "../../utils/date";
import { COLORS } from "../../utils/constants";

export default function SelectTravelScreen() {
  const router = useRouter();
  const { travels, currentTravel, setCurrentTravelId } = useCurrentTravel();

  const handleSelect = (id: number) => {
    setCurrentTravelId(id);
    router.back();
  };

  return (
    <View style={styles.container}>
      {travels.length === 0 ? (
        <View style={styles.empty}>
          <Text variant="bodyLarge" style={styles.emptyText}>
            No trips yet. Create one first!
          </Text>
        </View>
      ) : (
        <FlatList
          data={travels}
          keyExtractor={(item) => String(item.travel_id)}
          ItemSeparatorComponent={() => <Divider style={styles.divider} />}
          renderItem={({ item }) => (
            <List.Item
              title={item.description}
              titleStyle={styles.itemTitle}
              description={`${formatDate(item.start_date)} - ${formatDate(item.end_date)}${
                item.countries ? `\n${item.countries}` : ""
              }`}
              descriptionStyle={styles.itemDesc}
              descriptionNumberOfLines={2}
              style={styles.listItem}
              left={(props) => (
                <List.Icon
                  {...props}
                  icon={
                    currentTravel?.travel_id === item.travel_id
                      ? "check-circle"
                      : "airplane"
                  }
                  color={
                    currentTravel?.travel_id === item.travel_id
                      ? COLORS.primary
                      : COLORS.textSecondary
                  }
                />
              )}
              onPress={() => handleSelect(item.travel_id)}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyText: {
    color: COLORS.textSecondary,
  },
  listItem: {
    backgroundColor: COLORS.surface,
  },
  itemTitle: {
    color: COLORS.text,
  },
  itemDesc: {
    color: COLORS.textSecondary,
  },
  divider: {
    backgroundColor: COLORS.border,
  },
});
