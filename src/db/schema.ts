export const CREATE_USERS_TABLE = `
  CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE COLLATE NOCASE,
    password_hash TEXT NOT NULL,
    name TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`;

export const CREATE_TRAVEL_TABLE = `
  CREATE TABLE IF NOT EXISTS travel (
    travel_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER REFERENCES users(user_id),
    description TEXT NOT NULL,
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    countries TEXT NOT NULL DEFAULT '',
    cover_image_uri TEXT
  );
`;

export const CREATE_ITINERARY_TABLE = `
  CREATE TABLE IF NOT EXISTS itinerary (
    itinerary_id INTEGER PRIMARY KEY AUTOINCREMENT,
    travel_id INTEGER NOT NULL,
    date TEXT NOT NULL,
    day_no INTEGER NOT NULL,
    city TEXT NOT NULL,
    city_image_uri TEXT,
    flight_detail TEXT,
    transport_mode TEXT,
    transport_cost REAL,
    hotel_name TEXT,
    hotel_address TEXT,
    booking_id TEXT,
    hotel_cost REAL,
    food_cost REAL,
    transportation_cost REAL,
    activities_cost REAL,
    misc_cost REAL,
    activity_description TEXT,
    notes TEXT,
    FOREIGN KEY (travel_id) REFERENCES travel(travel_id) ON DELETE CASCADE
  );
`;

export const CREATE_EXPENSE_TABLE = `
  CREATE TABLE IF NOT EXISTS expense (
    expense_id INTEGER PRIMARY KEY AUTOINCREMENT,
    travel_id INTEGER NOT NULL,
    itinerary_id INTEGER,
    date TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    amount_eur REAL NOT NULL DEFAULT 0,
    amount_local REAL,
    local_currency_code TEXT,
    receipt_image_uri TEXT,
    voice_note_uri TEXT,
    FOREIGN KEY (travel_id) REFERENCES travel(travel_id) ON DELETE CASCADE,
    FOREIGN KEY (itinerary_id) REFERENCES itinerary(itinerary_id) ON DELETE SET NULL
  );
`;

export const CREATE_IMPORTANT_LINKS_TABLE = `
  CREATE TABLE IF NOT EXISTS important_links (
    link_id INTEGER PRIMARY KEY AUTOINCREMENT,
    travel_id INTEGER,
    type TEXT NOT NULL DEFAULT 'other',
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    icon_url TEXT,
    FOREIGN KEY (travel_id) REFERENCES travel(travel_id) ON DELETE CASCADE
  );
`;

export const ALL_TABLES = [
  CREATE_USERS_TABLE,
  CREATE_TRAVEL_TABLE,
  CREATE_ITINERARY_TABLE,
  CREATE_EXPENSE_TABLE,
  CREATE_IMPORTANT_LINKS_TABLE,
];
