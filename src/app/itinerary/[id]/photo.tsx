import { View, Image, StyleSheet, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { IconButton } from 'react-native-paper';

export default function PhotoScreen() {
  const { uri } = useLocalSearchParams<{ uri: string }>();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Pressable style={styles.backdrop} onPress={() => router.back()}>
        {uri && (
          <Image
            source={{ uri }}
            style={styles.image}
            resizeMode="contain"
          />
        )}
      </Pressable>
      <IconButton
        icon="close"
        iconColor="#FFFFFF"
        size={28}
        style={styles.closeButton}
        onPress={() => router.back()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 16,
  },
});
