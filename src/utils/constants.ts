export const COLORS = {
  primary: "#1B5E20",
  primaryDark: "#0D3B12",
  primaryLight: "#1B5E2025",
  accent: "#FF8F00",
  background: "#0D1117",
  surface: "#1A1F2E",
  surfaceLight: "#252D3A",
  error: "#D32F2F",
  text: "#FFFFFF",
  textSecondary: "#9CA3AF",
  border: "#2D2D44",

  // Category colors
  food: "#FF8F00",
  transportation: "#0277BD",
  activities: "#1B5E20",
  gifts: "#7B1FA2",
  flights: "#D32F2F",
  visa: "#5D4037",
  cancellation: "#616161",
  hotels: "#1565C0",
  ferries: "#00838F",
  trains: "#283593",
  cabs: "#F57F17",
  others: "#9E9E9E",

  // Link type colors
  booking: "#1565C0",
  transport: "#0277BD",
  activity: "#1B5E20",
  restaurant: "#FF8F00",
  other: "#9E9E9E",
};

export const CATEGORY_COLORS: Record<string, string> = {
  food: COLORS.food,
  transportation: COLORS.transportation,
  activities: COLORS.activities,
  "gifts/purchase": COLORS.gifts,
  flights: COLORS.flights,
  visa_fee: COLORS.visa,
  cancellation: COLORS.cancellation,
  hotels: COLORS.hotels,
  ferries: COLORS.ferries,
  trains: COLORS.trains,
  cabs: COLORS.cabs,
  others: COLORS.others,
};

export const EXPENSE_CATEGORY_LABELS: Record<string, string> = {
  food: "Food",
  transportation: "Transportation",
  activities: "Activities",
  "gifts/purchase": "Gifts / Purchase",
};

export const TOTAL_CATEGORY_LABELS: Record<string, string> = {
  flights: "Flights",
  visa_fee: "Visa Fee",
  cancellation: "Cancellation",
  hotels: "Hotels",
  ferries: "Ferries",
  activities: "Activities",
  trains: "Trains",
  cabs: "Cabs",
  food: "Food",
  others: "Others",
};

export const CATEGORY_ICONS: Record<string, string> = {
  food: "food",
  transportation: "car",
  activities: "hiking",
  "gifts/purchase": "gift",
  flights: "airplane",
  visa_fee: "passport",
  cancellation: "cancel",
  hotels: "bed",
  ferries: "ferry",
  trains: "train",
  cabs: "taxi",
  others: "dots-horizontal",
};

export const TYPE_LABELS: Record<string, string> = {
  booking: "Bookings",
  transport: "Transport",
  activity: "Activities",
  restaurant: "Restaurants",
  other: "Other",
};

export const TYPE_ICONS: Record<string, string> = {
  booking: "bed",
  transport: "train",
  activity: "hiking",
  restaurant: "food",
  other: "link-variant",
};

export const EXPENSE_CATEGORIES = [
  { label: "Food", value: "food" },
  { label: "Transportation", value: "transportation" },
  { label: "Activities", value: "activities" },
  { label: "Gifts / Purchase", value: "gifts/purchase" },
] as const;

export const TOTAL_CATEGORIES = [
  { label: "Flights", value: "flights" },
  { label: "Visa Fee", value: "visa_fee" },
  { label: "Cancellation", value: "cancellation" },
  { label: "Hotels", value: "hotels" },
  { label: "Ferries", value: "ferries" },
  { label: "Activities", value: "activities" },
  { label: "Trains", value: "trains" },
  { label: "Cabs", value: "cabs" },
  { label: "Food", value: "food" },
  { label: "Others", value: "others" },
] as const;

export const TRANSPORT_MODES = [
  "Flight",
  "Train",
  "Bus",
  "Ferry",
  "Car",
  "Taxi",
  "Walk",
  "Other",
] as const;

export const LINK_TYPES = [
  { value: "booking", label: "Booking" },
  { value: "transport", label: "Transport" },
  { value: "activity", label: "Activity" },
  { value: "restaurant", label: "Restaurant" },
  { value: "other", label: "Other" },
] as const;

export function getCategoryLabel(value: string): string {
  return (
    EXPENSE_CATEGORY_LABELS[value] ??
    TOTAL_CATEGORY_LABELS[value] ??
    value
  );
}

export function getCategoryIcon(value: string): string {
  return CATEGORY_ICONS[value] ?? "help-circle";
}

export function getCategoryColor(value: string): string {
  return CATEGORY_COLORS[value] ?? COLORS.others;
}
