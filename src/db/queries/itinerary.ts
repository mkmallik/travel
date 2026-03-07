import type { SQLiteDatabase } from "expo-sqlite";
import type { ItineraryData } from "../../types/database";

export async function getItinerariesByTravel(
  db: SQLiteDatabase,
  travelId: number
): Promise<ItineraryData[]> {
  return db.getAllAsync<ItineraryData>(
    "SELECT * FROM itinerary WHERE travel_id = ? ORDER BY day_no ASC",
    [travelId]
  );
}

export async function getItineraryById(
  db: SQLiteDatabase,
  itineraryId: number
): Promise<ItineraryData | null> {
  return db.getFirstAsync<ItineraryData>(
    "SELECT * FROM itinerary WHERE itinerary_id = ?",
    [itineraryId]
  );
}

export async function getItineraryByDate(
  db: SQLiteDatabase,
  travelId: number,
  date: string
): Promise<ItineraryData | null> {
  return db.getFirstAsync<ItineraryData>(
    "SELECT * FROM itinerary WHERE travel_id = ? AND date = ?",
    [travelId, date]
  );
}

export async function insertItinerary(
  db: SQLiteDatabase,
  itinerary: Omit<ItineraryData, "itinerary_id">
): Promise<number> {
  const result = await db.runAsync(
    `INSERT INTO itinerary (
      travel_id, date, day_no, city, city_image_uri,
      flight_detail, transport_mode, transport_cost,
      hotel_name, hotel_address, booking_id, hotel_cost,
      food_cost, transportation_cost, activities_cost, misc_cost,
      activity_description, notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      itinerary.travel_id,
      itinerary.date,
      itinerary.day_no,
      itinerary.city,
      itinerary.city_image_uri,
      itinerary.flight_detail,
      itinerary.transport_mode,
      itinerary.transport_cost,
      itinerary.hotel_name,
      itinerary.hotel_address,
      itinerary.booking_id,
      itinerary.hotel_cost,
      itinerary.food_cost,
      itinerary.transportation_cost,
      itinerary.activities_cost,
      itinerary.misc_cost,
      itinerary.activity_description,
      itinerary.notes,
    ]
  );
  return result.lastInsertRowId;
}

export async function updateItinerary(
  db: SQLiteDatabase,
  itinerary: ItineraryData
): Promise<void> {
  await db.runAsync(
    `UPDATE itinerary SET
      travel_id = ?, date = ?, day_no = ?, city = ?, city_image_uri = ?,
      flight_detail = ?, transport_mode = ?, transport_cost = ?,
      hotel_name = ?, hotel_address = ?, booking_id = ?, hotel_cost = ?,
      food_cost = ?, transportation_cost = ?, activities_cost = ?, misc_cost = ?,
      activity_description = ?, notes = ?
     WHERE itinerary_id = ?`,
    [
      itinerary.travel_id,
      itinerary.date,
      itinerary.day_no,
      itinerary.city,
      itinerary.city_image_uri,
      itinerary.flight_detail,
      itinerary.transport_mode,
      itinerary.transport_cost,
      itinerary.hotel_name,
      itinerary.hotel_address,
      itinerary.booking_id,
      itinerary.hotel_cost,
      itinerary.food_cost,
      itinerary.transportation_cost,
      itinerary.activities_cost,
      itinerary.misc_cost,
      itinerary.activity_description,
      itinerary.notes,
      itinerary.itinerary_id,
    ]
  );
}

export async function deleteItinerary(
  db: SQLiteDatabase,
  itineraryId: number
): Promise<void> {
  await db.runAsync("DELETE FROM itinerary WHERE itinerary_id = ?", [
    itineraryId,
  ]);
}
