import { useState, useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { IconButton, Text, useTheme } from 'react-native-paper';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
}

export function VoiceInput({ onTranscript }: VoiceInputProps) {
  const theme = useTheme();
  const [isListening, setIsListening] = useState(false);
  const [available, setAvailable] = useState(false);
  const [transcript, setTranscript] = useState('');

  useEffect(() => {
    checkAvailability();
  }, []);

  const checkAvailability = async () => {
    try {
      const ExpoSpeechRecognition = require('expo-speech-recognition');
      if (ExpoSpeechRecognition) {
        setAvailable(true);
      }
    } catch {
      setAvailable(false);
    }
  };

  const startListening = async () => {
    try {
      const ExpoSpeechRecognition = require('expo-speech-recognition');
      const { ExpoSpeechRecognitionModule, useSpeechRecognitionEvent } =
        ExpoSpeechRecognition;

      const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
      if (!result.granted) return;

      setIsListening(true);
      ExpoSpeechRecognitionModule.start({ lang: 'en-US' });
    } catch {
      setIsListening(false);
    }
  };

  const stopListening = async () => {
    try {
      const ExpoSpeechRecognition = require('expo-speech-recognition');
      ExpoSpeechRecognition.ExpoSpeechRecognitionModule.stop();
    } catch {}
    setIsListening(false);
  };

  if (!available) return null;

  return (
    <View style={styles.container}>
      <IconButton
        icon={isListening ? 'microphone-off' : 'microphone'}
        mode="contained"
        iconColor={isListening ? '#D32F2F' : theme.colors.primary}
        size={28}
        onPress={isListening ? stopListening : startListening}
      />
      <Text variant="bodySmall" style={styles.hint}>
        {isListening ? 'Listening... tap to stop' : 'Tap to speak'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  hint: {
    color: '#757575',
  },
});
