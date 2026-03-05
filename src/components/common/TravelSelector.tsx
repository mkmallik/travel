import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useCurrentTravel } from '../../hooks/useCurrentTravel';

export function TravelSelector() {
  const router = useRouter();
  const { currentTravel, travels } = useCurrentTravel();

  return (
    <View style={styles.container}>
      <Button
        mode="outlined"
        icon="airplane"
        onPress={() => router.push('/travel/select')}
        style={styles.button}
        compact
      >
        {currentTravel?.description ?? 'Select Trip'}
      </Button>
      <Button
        mode="contained"
        icon="plus"
        onPress={() => router.push('/travel/add')}
        style={styles.addButton}
        compact
      >
        New
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  button: {
    flex: 1,
  },
  addButton: {},
});
