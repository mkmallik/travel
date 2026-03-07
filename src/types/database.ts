export interface UserData {
  user_id: number;
  email: string;
  password_hash: string;
  name: string | null;
  created_at: string;
}

export interface TravelData {
  travel_id: number;
  user_id: number;
  description: string;
  start_date: string;
  end_date: string;
  countries: string;
  cover_image_uri: string | null;
}

export interface ItineraryData {
  itinerary_id: number;
  travel_id: number;
  date: string;
  day_no: number;
  city: string;
  city_image_uri: string | null;
  flight_detail: string | null;
  transport_mode: string | null;
  transport_cost: number | null;
  hotel_name: string | null;
  hotel_address: string | null;
  booking_id: string | null;
  hotel_cost: number | null;
  food_cost: number | null;
  transportation_cost: number | null;
  activities_cost: number | null;
  misc_cost: number | null;
  activity_description: string | null;
  notes: string | null;
}

export interface ExpenseData {
  expense_id: number;
  travel_id: number;
  itinerary_id: number | null;
  date: string;
  description: string;
  category: string;
  amount_eur: number;
  amount_local: number | null;
  local_currency_code: string | null;
  receipt_image_uri: string | null;
  voice_note_uri: string | null;
}

export interface LinkData {
  link_id: number;
  travel_id: number | null;
  type: string;
  title: string;
  url: string;
  icon_url: string | null;
}

export interface DailyTotalData {
  date: string;
  total_eur: number;
  count: number;
}

export interface CategoryTotalData {
  category: string;
  total_eur: number;
  count: number;
}

export type ExpenseCategory =
  | "food"
  | "transportation"
  | "activities"
  | "gifts/purchase";

export type TotalCategory =
  | "flights"
  | "visa_fee"
  | "cancellation"
  | "hotels"
  | "ferries"
  | "activities"
  | "trains"
  | "cabs"
  | "food"
  | "others";

export type LinkType =
  | "booking"
  | "transport"
  | "activity"
  | "restaurant"
  | "other";
