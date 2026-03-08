import { View, ActivityIndicator, StyleSheet } from "react-native";
import { Stack } from "expo-router";
import { PaperProvider, Text } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { theme } from "../constants/theme";
import { COLORS } from "../utils/constants";
import { ActiveTravelProvider } from "../hooks/useCurrentTravel";
import { AuthProvider, useAuth } from "../hooks/useAuth";

function AppNavigator() {
  const { user } = useAuth();

  if (!user) {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
      </Stack>
    );
  }

  return (
    <ActiveTravelProvider>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: COLORS.surface },
          headerTintColor: COLORS.text,
          headerTitleStyle: { color: COLORS.text },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="itinerary/[id]"
          options={{ title: "Itinerary Detail" }}
        />
        <Stack.Screen
          name="expense/add"
          options={{ title: "Add Expense", presentation: "modal" }}
        />
        <Stack.Screen
          name="expense/[id]"
          options={{ title: "Edit Expense" }}
        />
        <Stack.Screen
          name="travel/add"
          options={{ title: "New Trip", presentation: "modal" }}
        />
        <Stack.Screen
          name="travel/select"
          options={{ title: "Select Trip", presentation: "modal" }}
        />
        <Stack.Screen
          name="link/add"
          options={{ title: "Add Link", presentation: "modal" }}
        />
      </Stack>
    </ActiveTravelProvider>
  );
}

export default function RootLayout() {
  return (
    <PaperProvider theme={theme}>
      <AuthProvider>
        <StatusBar style="light" />
        <AppNavigator />
      </AuthProvider>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.textSecondary,
  },
});
