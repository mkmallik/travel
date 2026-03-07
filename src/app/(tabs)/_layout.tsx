import { Tabs } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { IconButton } from "react-native-paper";
import { useCurrentTravel } from "../../hooks/useCurrentTravel";
import { useAuth } from "../../hooks/useAuth";
import { COLORS } from "../../utils/constants";

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>["name"];

export default function TabLayout() {
  const { currentTravel } = useCurrentTravel();
  const { logout } = useAuth();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarLabelStyle: { fontSize: 11 },
        tabBarStyle: { backgroundColor: COLORS.surface, borderTopColor: COLORS.border },
        headerStyle: { backgroundColor: COLORS.surface },
        headerTintColor: COLORS.text,
        headerTitle: currentTravel?.description ?? "Travel Log",
        headerRight: () => (
          <IconButton icon="logout" size={22} iconColor={COLORS.textSecondary} onPress={logout} />
        ),
      }}
    >
      <Tabs.Screen
        name="itineraries"
        options={{
          title: "Itineraries",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="map-marker-path" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="spends"
        options={{
          title: "Spends",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="currency-eur" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="daily-totals"
        options={{
          title: "Daily",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="calendar-text" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="category-totals"
        options={{
          title: "Categories",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="chart-pie" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="data-links"
        options={{
          title: "Links",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="link-variant" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
