import { MD3LightTheme } from 'react-native-paper';

export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#1B5E20',
    primaryContainer: '#A5D6A7',
    secondary: '#FF8F00',
    secondaryContainer: '#FFE082',
    tertiary: '#0277BD',
    tertiaryContainer: '#B3E5FC',
    surface: '#FFFFFF',
    surfaceVariant: '#F5F5F5',
    background: '#FAFAFA',
    error: '#D32F2F',
    errorContainer: '#FFCDD2',
  },
};

export const CATEGORY_COLORS: Record<string, string> = {
  food: '#FF8F00',
  transportation: '#0277BD',
  activities: '#1B5E20',
  'gifts/purchase': '#7B1FA2',
  flights: '#D32F2F',
  visa_fee: '#5D4037',
  cancellation: '#616161',
  hotels: '#1565C0',
  ferries: '#00838F',
  trains: '#283593',
  cabs: '#F57F17',
  others: '#9E9E9E',
};
