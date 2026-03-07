import { MD3DarkTheme } from "react-native-paper";
import { COLORS } from "../utils/constants";

export const theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: COLORS.primary,
    primaryContainer: COLORS.primaryLight,
    secondary: COLORS.accent,
    secondaryContainer: COLORS.accent + "25",
    tertiary: COLORS.transportation,
    tertiaryContainer: COLORS.transportation + "25",
    surface: COLORS.surface,
    surfaceVariant: COLORS.surfaceLight,
    background: COLORS.background,
    error: COLORS.error,
    errorContainer: COLORS.error + "25",
    onPrimary: "#FFFFFF",
    onSurface: COLORS.text,
    onSurfaceVariant: COLORS.textSecondary,
    onBackground: COLORS.text,
    outline: COLORS.border,
    outlineVariant: COLORS.border,
  },
};
