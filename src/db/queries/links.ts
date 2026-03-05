import type { SQLiteDatabase } from 'expo-sqlite';
import type { ImportantLink } from '../../types/database';

export async function getLinksByTravel(
  db: SQLiteDatabase,
  travelId: number
): Promise<ImportantLink[]> {
  return db.getAllAsync<ImportantLink>(
    'SELECT * FROM important_links WHERE travel_id = ? ORDER BY type ASC, title ASC',
    [travelId]
  );
}

export async function getAllLinks(
  db: SQLiteDatabase
): Promise<ImportantLink[]> {
  return db.getAllAsync<ImportantLink>(
    'SELECT * FROM important_links ORDER BY type ASC, title ASC'
  );
}

export async function getLinkById(
  db: SQLiteDatabase,
  linkId: number
): Promise<ImportantLink | null> {
  return db.getFirstAsync<ImportantLink>(
    'SELECT * FROM important_links WHERE link_id = ?',
    [linkId]
  );
}

export async function insertLink(
  db: SQLiteDatabase,
  link: Omit<ImportantLink, 'link_id'>
): Promise<number> {
  const result = await db.runAsync(
    `INSERT INTO important_links (travel_id, type, title, url, icon_url)
     VALUES (?, ?, ?, ?, ?)`,
    [link.travel_id, link.type, link.title, link.url, link.icon_url]
  );
  return result.lastInsertRowId;
}

export async function updateLink(
  db: SQLiteDatabase,
  link: ImportantLink
): Promise<void> {
  await db.runAsync(
    `UPDATE important_links SET travel_id = ?, type = ?, title = ?, url = ?, icon_url = ?
     WHERE link_id = ?`,
    [link.travel_id, link.type, link.title, link.url, link.icon_url, link.link_id]
  );
}

export async function deleteLink(
  db: SQLiteDatabase,
  linkId: number
): Promise<void> {
  await db.runAsync('DELETE FROM important_links WHERE link_id = ?', [linkId]);
}
