import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { IconButton, Text } from "react-native-paper";
import { COLORS } from "../../utils/constants";

interface VoiceInputProps {
  onTranscript: (text: string) => void;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ onTranscript }) => {
  const [isListening, setIsListening] = useState(false);
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    checkAvailability();
  }, []);

  const checkAvailability = async () => {
    try {
      const ExpoSpeechRecognition = require("expo-speech-recognition");
      if (ExpoSpeechRecognition) {
        setAvailable(true);
      }
    } catch {
      setAvailable(false);
    }
  };

  const startListening = async () => {
    try {
      const ExpoSpeechRecognition = require("expo-speech-recognition");
      const { ExpoSpeechRecognitionModule } = ExpoSpeechRecognition;

      const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
      if (!result.granted) return;

      setIsListening(true);
      ExpoSpeechRecognitionModule.start({ lang: "en-US" });
    } catch {
      setIsListening(false);
    }
  };

  const stopListening = async () => {
    try {
      const ExpoSpeechRecognition = require("expo-speech-recognition");
      ExpoSpeechRecognition.ExpoSpeechRecognitionModule.stop();
    } catch {}
    setIsListening(false);
  };

  if (!available) return null;

  return (
    <View style={styles.container}>
      <IconButton
        icon={isListening ? "microphone-off" : "microphone"}
        mode="contained"
        iconColor={isListening ? COLORS.error : COLORS.primary}
        size={28}
        onPress={isListening ? stopListening : startListening}
        style={styles.button}
      />
      <Text variant="bodySmall" style={styles.hint}>
        {isListening ? "Listening... tap to stop" : "Tap to speak"}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  button: {
    backgroundColor: COLORS.surfaceLight,
  },
  hint: {
    color: COLORS.textSecondary,
  },
});

export default VoiceInput;
export { VoiceInput };
