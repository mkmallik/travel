import type { SQLiteDatabase } from 'expo-sqlite';
import type { Travel } from '../../types/database';

export async function getAllTravels(db: SQLiteDatabase, userId: number): Promise<Travel[]> {
  return db.getAllAsync<Travel>(
    'SELECT * FROM travel WHERE user_id = ? ORDER BY start_date DESC',
    [userId]
  );
}

export async function getTravelById(
  db: SQLiteDatabase,
  travelId: number
): Promise<Travel | null> {
  return db.getFirstAsync<Travel>(
    'SELECT * FROM travel WHERE travel_id = ?',
    [travelId]
  );
}

export async function insertTravel(
  db: SQLiteDatabase,
  travel: Omit<Travel, 'travel_id'>
): Promise<number> {
  const result = await db.runAsync(
    `INSERT INTO travel (user_id, description, start_date, end_date, countries, cover_image_uri)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      travel.user_id,
      travel.description,
      travel.start_date,
      travel.end_date,
      travel.countries,
      travel.cover_image_uri,
    ]
  );
  return result.lastInsertRowId;
}

export async function updateTravel(
  db: SQLiteDatabase,
  travel: Travel
): Promise<void> {
  await db.runAsync(
    `UPDATE travel SET description = ?, start_date = ?, end_date = ?, countries = ?, cover_image_uri = ?
     WHERE travel_id = ?`,
    [
      travel.description,
      travel.start_date,
      travel.end_date,
      travel.countries,
      travel.cover_image_uri,
      travel.travel_id,
    ]
  );
}

export async function deleteTravel(
  db: SQLiteDatabase,
  travelId: number
): Promise<void> {
  await db.runAsync('DELETE FROM travel WHERE travel_id = ?', [travelId]);
}
