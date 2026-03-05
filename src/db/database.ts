import * as SQLite from 'expo-sqlite';
import * as Crypto from 'expo-crypto';
import { ALL_TABLES } from './schema';

const DB_NAME = 'travel.db';

export async function hashPassword(password: string, email: string): Promise<string> {
  return Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    password + email.toLowerCase()
  );
}

export async function initDatabase(db: SQLite.SQLiteDatabase): Promise<void> {
  await db.execAsync('PRAGMA journal_mode = WAL;');
  await db.execAsync('PRAGMA foreign_keys = ON;');
  for (const sql of ALL_TABLES) {
    await db.execAsync(sql);
  }
  await migrateAddUserIdToTravel(db);
  await seedIfEmpty(db);
}

async function migrateAddUserIdToTravel(db: SQLite.SQLiteDatabase): Promise<void> {
  const columns = await db.getAllAsync<{ name: string }>(
    "PRAGMA table_info('travel')"
  );
  const hasUserId = columns.some((c) => c.name === 'user_id');
  if (!hasUserId) {
    await db.execAsync('ALTER TABLE travel ADD COLUMN user_id INTEGER REFERENCES users(user_id)');
  }
}

async function seedIfEmpty(db: SQLite.SQLiteDatabase): Promise<void> {
  const row = await db.getFirstAsync<{ cnt: number }>(
    'SELECT COUNT(*) as cnt FROM travel'
  );
  if (row && row.cnt > 0) return;

  // Create demo user (demo@travel.app / demo1234)
  const demoHash = await hashPassword('demo1234', 'demo@travel.app');
  await db.runAsync(
    'INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)',
    ['demo@travel.app', demoHash, 'Demo User']
  );

  // --- Trip 1: Italy 2026 ---
  await db.runAsync(
    `INSERT INTO travel (user_id, description, start_date, end_date, countries, cover_image_uri) VALUES (?, ?, ?, ?, ?, ?)`,
    [1, 'Italy Spring 2026', '2026-03-15', '2026-03-22', 'Italy', 'https://picsum.photos/seed/italy-trip/800/400']
  );

  const italyItineraries = [
    [1, '2026-03-15', 1, 'Rome', 'https://picsum.photos/seed/rome-colosseum/800/400', 'FR1234 CDG→FCO 08:30', 'Flight', 89, 'Hotel Roma Centro', 'Via del Corso 42, Rome', 'BK-001', 120, 35, 12, 25, 5, 'Colosseum, Roman Forum, Trevi Fountain', 'Arrived early afternoon, great weather'],
    [1, '2026-03-16', 2, 'Rome', 'https://picsum.photos/seed/rome-vatican/800/400', null, 'Walk', 0, 'Hotel Roma Centro', 'Via del Corso 42, Rome', 'BK-001', 120, 42, 8, 18, 10, 'Vatican Museums, St. Peters Basilica, Sistine Chapel', 'Book Vatican tickets in advance!'],
    [1, '2026-03-17', 3, 'Florence', 'https://picsum.photos/seed/florence-duomo/800/400', null, 'Train', 45, 'B&B Firenze Belle', 'Piazza Santa Croce 8, Florence', 'BK-002', 95, 38, 6, 20, 8, 'Uffizi Gallery, Ponte Vecchio, Duomo', 'Trenitalia Frecciarossa from Roma Termini'],
    [1, '2026-03-18', 4, 'Florence', 'https://picsum.photos/seed/florence-ponte/800/400', null, 'Walk', 0, 'B&B Firenze Belle', 'Piazza Santa Croce 8, Florence', 'BK-002', 95, 40, 5, 15, 12, 'Accademia Gallery (David), San Lorenzo Market', 'Bought leather goods at the market'],
    [1, '2026-03-19', 5, 'Venice', 'https://picsum.photos/seed/venice-grand/800/400', null, 'Train', 38, 'Casa Venezia', 'Cannaregio 2356, Venice', 'BK-003', 140, 55, 20, 30, 15, 'Grand Canal, Rialto Bridge, St. Marks Square', 'Water taxi from station to hotel was pricey'],
    [1, '2026-03-20', 6, 'Venice', 'https://picsum.photos/seed/venice-burano/800/400', null, 'Walk', 0, 'Casa Venezia', 'Cannaregio 2356, Venice', 'BK-003', 140, 48, 15, 22, 8, 'Murano Island, Burano Island', 'Day pass for vaporetto - good value'],
    [1, '2026-03-21', 7, 'Milan', 'https://picsum.photos/seed/milan-duomo/800/400', null, 'Train', 32, 'Milano Centrale B&B', 'Via Napo Torriani 15, Milan', 'BK-004', 110, 45, 10, 16, 20, 'Duomo di Milano, Galleria Vittorio Emanuele', 'Shopping in Galleria'],
    [1, '2026-03-22', 8, 'Milan', 'https://picsum.photos/seed/milan-galleria/800/400', 'AZ567 MXP→CDG 16:00', 'Flight', 95, null, null, null, 0, 22, 15, 0, 0, 'Last Supper (booked months ago!)', 'Early flight home'],
  ];

  for (const it of italyItineraries) {
    await db.runAsync(
      `INSERT INTO itinerary (travel_id, date, day_no, city, city_image_uri, flight_detail, transport_mode, transport_cost, hotel_name, hotel_address, booking_id, hotel_cost, food_cost, transportation_cost, activities_cost, misc_cost, activity_description, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      it
    );
  }

  // Expenses for Italy trip
  const italyExpenses = [
    ['2026-03-15', 'Lunch at Trattoria da Luigi', 'food', 18.50, 18.50, 'EUR'],
    ['2026-03-15', 'Colosseum tickets x2', 'activities', 25.00, 25.00, 'EUR'],
    ['2026-03-15', 'Metro day pass', 'transportation', 7.00, 7.00, 'EUR'],
    ['2026-03-15', 'Gelato near Trevi Fountain', 'food', 4.50, 4.50, 'EUR'],
    ['2026-03-15', 'Dinner at Ristorante Aroma', 'food', 42.00, 42.00, 'EUR'],
    ['2026-03-16', 'Vatican Museum tickets', 'activities', 18.00, 18.00, 'EUR'],
    ['2026-03-16', 'Breakfast pastry + coffee', 'food', 5.50, 5.50, 'EUR'],
    ['2026-03-16', 'Lunch near Vatican', 'food', 15.00, 15.00, 'EUR'],
    ['2026-03-16', 'Souvenir rosary', 'gifts/purchase', 8.00, 8.00, 'EUR'],
    ['2026-03-16', 'Bus tickets', 'transportation', 3.00, 3.00, 'EUR'],
    ['2026-03-17', 'Trenitalia Roma→Firenze', 'transportation', 45.00, 45.00, 'EUR'],
    ['2026-03-17', 'Uffizi Gallery ticket', 'activities', 20.00, 20.00, 'EUR'],
    ['2026-03-17', 'Bistecca alla Fiorentina dinner', 'food', 38.00, 38.00, 'EUR'],
    ['2026-03-17', 'Chianti wine bottle', 'gifts/purchase', 14.00, 14.00, 'EUR'],
    ['2026-03-18', 'Accademia Gallery ticket', 'activities', 15.00, 15.00, 'EUR'],
    ['2026-03-18', 'Leather wallet from market', 'gifts/purchase', 35.00, 35.00, 'EUR'],
    ['2026-03-18', 'Panini lunch', 'food', 8.00, 8.00, 'EUR'],
    ['2026-03-19', 'Trenitalia Firenze→Venezia', 'transportation', 38.00, 38.00, 'EUR'],
    ['2026-03-19', 'Water taxi', 'transportation', 15.00, 15.00, 'EUR'],
    ['2026-03-19', 'Seafood dinner', 'food', 55.00, 55.00, 'EUR'],
    ['2026-03-19', 'Gondola ride', 'activities', 30.00, 30.00, 'EUR'],
    ['2026-03-20', 'Vaporetto day pass', 'transportation', 25.00, 25.00, 'EUR'],
    ['2026-03-20', 'Murano glass ornament', 'gifts/purchase', 22.00, 22.00, 'EUR'],
    ['2026-03-20', 'Lunch on Burano', 'food', 28.00, 28.00, 'EUR'],
    ['2026-03-21', 'Trenitalia Venezia→Milano', 'transportation', 32.00, 32.00, 'EUR'],
    ['2026-03-21', 'Duomo rooftop ticket', 'activities', 16.00, 16.00, 'EUR'],
    ['2026-03-21', 'Risotto dinner', 'food', 30.00, 30.00, 'EUR'],
    ['2026-03-21', 'Designer scarf from Galleria', 'gifts/purchase', 65.00, 65.00, 'EUR'],
    ['2026-03-22', 'Airport taxi', 'transportation', 15.00, 15.00, 'EUR'],
    ['2026-03-22', 'Airport lunch', 'food', 18.00, 18.00, 'EUR'],
  ];

  for (const e of italyExpenses) {
    await db.runAsync(
      `INSERT INTO expense (travel_id, date, description, category, amount_eur, amount_local, local_currency_code)
       VALUES (1, ?, ?, ?, ?, ?, ?)`,
      e
    );
  }

  // --- Trip 2: Japan 2026 ---
  await db.runAsync(
    `INSERT INTO travel (user_id, description, start_date, end_date, countries, cover_image_uri) VALUES (?, ?, ?, ?, ?, ?)`,
    [1, 'Japan Golden Week 2026', '2026-04-28', '2026-05-06', 'Japan', 'https://picsum.photos/seed/japan-trip/800/400']
  );

  const japanItineraries = [
    [2, '2026-04-28', 1, 'Tokyo', 'https://picsum.photos/seed/tokyo-shinjuku/800/400', 'AF275 CDG→NRT 11:00', 'Flight', 580, 'Shinjuku Granbell Hotel', 'Kabukicho, Shinjuku, Tokyo', 'GR-101', 95, 30, 15, 0, 5, 'Shinjuku, Kabukicho', 'Arrived late, jet lag'],
    [2, '2026-04-29', 2, 'Tokyo', 'https://picsum.photos/seed/tokyo-sensoji/800/400', null, 'Train', 0, 'Shinjuku Granbell Hotel', 'Kabukicho, Shinjuku, Tokyo', 'GR-101', 95, 45, 8, 12, 10, 'Senso-ji, Akihabara, Shibuya Crossing', 'Bought JR pass - great value'],
    [2, '2026-04-30', 3, 'Tokyo', 'https://picsum.photos/seed/tokyo-teamlab/800/400', null, 'Train', 0, 'Shinjuku Granbell Hotel', 'Kabukicho, Shinjuku, Tokyo', 'GR-101', 95, 50, 5, 18, 15, 'Tsukiji Outer Market, TeamLab, Harajuku', 'TeamLab was incredible'],
    [2, '2026-05-01', 4, 'Kyoto', 'https://picsum.photos/seed/kyoto-fushimi/800/400', null, 'Train', 0, 'Kyoto Machiya Inn', 'Higashiyama, Kyoto', 'MI-201', 110, 35, 5, 15, 8, 'Fushimi Inari, Kinkaku-ji, Arashiyama', 'Shinkansen from Tokyo - 2h15m'],
    [2, '2026-05-02', 5, 'Kyoto', 'https://picsum.photos/seed/kyoto-gion/800/400', null, 'Bus', 5, 'Kyoto Machiya Inn', 'Higashiyama, Kyoto', 'MI-201', 110, 40, 8, 10, 5, 'Nijo Castle, Gion district, Tea ceremony', 'Tea ceremony was a highlight'],
    [2, '2026-05-03', 6, 'Osaka', 'https://picsum.photos/seed/osaka-dotonbori/800/400', null, 'Train', 0, 'Hotel Osaka Bay', 'Namba, Osaka', 'OB-301', 85, 60, 10, 12, 8, 'Dotonbori, Osaka Castle, Street food tour', 'Osaka is a food paradise'],
    [2, '2026-05-04', 7, 'Hiroshima', 'https://picsum.photos/seed/hiroshima-peace/800/400', null, 'Train', 0, 'Hotel Osaka Bay', null, null, 0, 35, 5, 8, 5, 'Peace Memorial, Miyajima Island', 'Day trip from Osaka, very moving'],
    [2, '2026-05-05', 8, 'Tokyo', 'https://picsum.photos/seed/tokyo-meiji/800/400', null, 'Train', 0, 'Shinjuku Granbell Hotel', 'Kabukicho, Shinjuku, Tokyo', 'GR-101', 95, 40, 12, 0, 20, 'Nakamise shopping, Meiji Shrine, Roppongi', 'Last day shopping'],
    [2, '2026-05-06', 9, 'Tokyo', 'https://picsum.photos/seed/tokyo-narita/800/400', 'AF276 NRT→CDG 10:30', 'Flight', 580, null, null, null, 0, 15, 20, 0, 0, null, 'Early morning departure'],
  ];

  for (const it of japanItineraries) {
    await db.runAsync(
      `INSERT INTO itinerary (travel_id, date, day_no, city, city_image_uri, flight_detail, transport_mode, transport_cost, hotel_name, hotel_address, booking_id, hotel_cost, food_cost, transportation_cost, activities_cost, misc_cost, activity_description, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      it
    );
  }

  const japanExpenses = [
    ['2026-04-28', 'Ramen in Shinjuku', 'food', 8.50, 1400, 'JPY'],
    ['2026-04-28', 'Narita Express', 'transportation', 18.00, 3020, 'JPY'],
    ['2026-04-29', 'Sushi breakfast at Tsukiji', 'food', 15.00, 2500, 'JPY'],
    ['2026-04-29', 'Senso-ji area snacks', 'food', 5.00, 850, 'JPY'],
    ['2026-04-29', 'Anime figures in Akihabara', 'gifts/purchase', 25.00, 4200, 'JPY'],
    ['2026-04-29', 'Izakaya dinner', 'food', 22.00, 3700, 'JPY'],
    ['2026-04-30', 'TeamLab Borderless ticket', 'activities', 18.00, 3000, 'JPY'],
    ['2026-04-30', 'Harajuku crepes', 'food', 4.00, 680, 'JPY'],
    ['2026-04-30', 'Wagyu beef dinner', 'food', 45.00, 7500, 'JPY'],
    ['2026-05-01', 'Fushimi Inari area lunch', 'food', 10.00, 1680, 'JPY'],
    ['2026-05-01', 'Kinkaku-ji entrance', 'activities', 3.00, 500, 'JPY'],
    ['2026-05-01', 'Bamboo forest rickshaw', 'activities', 12.00, 2000, 'JPY'],
    ['2026-05-01', 'Kaiseki dinner', 'food', 55.00, 9200, 'JPY'],
    ['2026-05-02', 'Tea ceremony experience', 'activities', 20.00, 3350, 'JPY'],
    ['2026-05-02', 'Matcha set gift', 'gifts/purchase', 30.00, 5000, 'JPY'],
    ['2026-05-02', 'Gion dinner', 'food', 35.00, 5850, 'JPY'],
    ['2026-05-03', 'Takoyaki in Dotonbori', 'food', 4.00, 680, 'JPY'],
    ['2026-05-03', 'Osaka Castle entrance', 'activities', 4.00, 600, 'JPY'],
    ['2026-05-03', 'Street food tour', 'food', 30.00, 5000, 'JPY'],
    ['2026-05-03', 'Kobe beef dinner', 'food', 60.00, 10000, 'JPY'],
    ['2026-05-04', 'Peace Memorial Museum', 'activities', 1.50, 250, 'JPY'],
    ['2026-05-04', 'Miyajima ferry', 'transportation', 2.50, 420, 'JPY'],
    ['2026-05-04', 'Hiroshima okonomiyaki', 'food', 7.00, 1180, 'JPY'],
    ['2026-05-04', 'Momiji manju gifts', 'gifts/purchase', 8.00, 1350, 'JPY'],
    ['2026-05-05', 'Japanese whisky bottle', 'gifts/purchase', 40.00, 6700, 'JPY'],
    ['2026-05-05', 'Meiji Shrine area lunch', 'food', 12.00, 2000, 'JPY'],
    ['2026-05-05', 'Roppongi farewell dinner', 'food', 48.00, 8000, 'JPY'],
    ['2026-05-06', 'Airport bento + snacks', 'food', 12.00, 2000, 'JPY'],
    ['2026-05-06', 'Limousine bus to Narita', 'transportation', 18.00, 3000, 'JPY'],
  ];

  for (const e of japanExpenses) {
    await db.runAsync(
      `INSERT INTO expense (travel_id, date, description, category, amount_eur, amount_local, local_currency_code)
       VALUES (2, ?, ?, ?, ?, ?, ?)`,
      e
    );
  }

  // Links
  const links = [
    [1, 'booking', 'Hotel Roma Centro', 'https://booking.com/hotel-roma-centro'],
    [1, 'booking', 'B&B Firenze Belle', 'https://booking.com/bb-firenze'],
    [1, 'booking', 'Casa Venezia', 'https://booking.com/casa-venezia'],
    [1, 'transport', 'Trenitalia Booking', 'https://trenitalia.com'],
    [1, 'activity', 'Vatican Museum Tickets', 'https://biglietteriamusei.vatican.va'],
    [1, 'restaurant', 'Ristorante Aroma - Rome', 'https://tripadvisor.com/aroma-rome'],
    [2, 'booking', 'Shinjuku Granbell Hotel', 'https://granbellhotel.jp'],
    [2, 'booking', 'Kyoto Machiya Inn', 'https://booking.com/machiya-kyoto'],
    [2, 'transport', 'JR Pass Purchase', 'https://japanrailpass.net'],
    [2, 'activity', 'TeamLab Borderless', 'https://borderless.teamlab.art'],
    [2, 'activity', 'Tea Ceremony Booking', 'https://tea-kyoto.com'],
    [2, 'restaurant', 'Dotonbori Food Guide', 'https://osaka-info.jp/dotonbori'],
  ];

  for (const l of links) {
    await db.runAsync(
      `INSERT INTO important_links (travel_id, type, title, url) VALUES (?, ?, ?, ?)`,
      l
    );
  }
}

export { DB_NAME };
