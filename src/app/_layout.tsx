import { Suspense } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { PaperProvider, Text } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { theme } from '../constants/theme';
import { DB_NAME, initDatabase } from '../db/database';
import { ActiveTravelProvider } from '../hooks/useCurrentTravel';
import { AuthProvider, useAuth } from '../hooks/useAuth';

function Loading() {
  return (
    <View style={styles.loading}>
      <ActivityIndicator size="large" color="#1B5E20" />
      <Text style={styles.loadingText}>Loading Travel Log...</Text>
    </View>
  );
}

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
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="itinerary/[id]"
          options={{ title: 'Itinerary Detail' }}
        />
        <Stack.Screen
          name="expense/add"
          options={{ title: 'Add Expense', presentation: 'modal' }}
        />
        <Stack.Screen
          name="expense/[id]"
          options={{ title: 'Edit Expense' }}
        />
        <Stack.Screen
          name="travel/add"
          options={{ title: 'New Trip', presentation: 'modal' }}
        />
        <Stack.Screen
          name="travel/select"
          options={{ title: 'Select Trip', presentation: 'modal' }}
        />
        <Stack.Screen
          name="link/add"
          options={{ title: 'Add Link', presentation: 'modal' }}
        />
      </Stack>
    </ActiveTravelProvider>
  );
}

export default function RootLayout() {
  return (
    <Suspense fallback={<Loading />}>
      <SQLiteProvider databaseName={DB_NAME} onInit={initDatabase}>
        <PaperProvider theme={theme}>
          <AuthProvider>
            <StatusBar style="dark" />
            <AppNavigator />
          </AuthProvider>
        </PaperProvider>
      </SQLiteProvider>
    </Suspense>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#757575',
  },
});
