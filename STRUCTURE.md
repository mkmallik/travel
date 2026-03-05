# Travel Log — Project Structure

A mobile-first travel expense tracker and itinerary planner built with **React Native (Expo)** and **SQLite** — fully offline, no backend required.

---

## Table of Contents

- [High-Level Overview](#high-level-overview)
- [Tech Stack](#tech-stack)
- [How the App Was Created](#how-the-app-was-created)
- [Project Tree](#project-tree)
- [Architecture](#architecture)
- [Database](#database)
- [Navigation](#navigation)
- [Screens](#screens)
- [Components](#components)
- [Development Setup](#development-setup)

---

## High-Level Overview

```
travel/
├── src/
│   ├── app/           → Expo Router screens (file-based routing)
│   ├── components/    → Reusable UI components
│   ├── db/            → SQLite schema, queries, database init
│   ├── hooks/         → Auth & travel context providers
│   ├── types/         → TypeScript interfaces
│   ├── utils/         → Categories, currency, date helpers
│   └── constants/     → Theme & color definitions
├── assets/            → App icons & splash screen
├── app.json           → Expo configuration
├── package.json       → Dependencies
└── tsconfig.json      → TypeScript config
```

This is a **single-project Expo app** — no separate backend or web app. All data is stored locally in an on-device SQLite database (`travel.db`).

---

## Tech Stack

| Technology              | Version    | Purpose                          |
|------------------------|------------|----------------------------------|
| React Native            | 0.83.2     | Cross-platform mobile UI         |
| React                   | 19.2.4     | UI library                       |
| Expo                    | ~55.0.4    | Development & build tooling      |
| Expo Router             | ~55.0.3    | File-based navigation            |
| Expo SQLite             | ~55.0.10   | On-device SQLite database        |
| TypeScript              | ~5.9.2     | Type safety (strict mode)        |
| React Native Paper      | 5.15.0     | Material Design 3 UI components  |
| Expo Image Picker       | ~55.0.10   | Photo capture & gallery access   |
| Expo Crypto             | ~55.0.8    | Password hashing (SHA-256)       |
| dayjs                   | 1.11.19    | Date formatting & manipulation   |
| MaterialCommunityIcons  | (via @expo/vector-icons) | Icon library       |

---

## How the App Was Created

### Bootstrapping with Expo

The app was created using **Expo CLI** and runs via **Expo Go** during development.

```bash
# 1. Create the project with Expo Router template
npx create-expo-app@latest travel --template tabs

# 2. Install core dependencies
cd travel
npx expo install expo-sqlite expo-crypto expo-image-picker expo-font
npx expo install expo-status-bar expo-system-ui expo-constants expo-linking
npm install react-native-paper react-native-vector-icons dayjs

# 3. Configure file-based routing
#    - Set "main": "expo-router/entry" in package.json
#    - Add "expo-router" to plugins in app.json
#    - Set "scheme": "travel" in app.json for deep linking

# 4. Run with Expo Go
npx expo start
# Scan the QR code with Expo Go app on your phone
# Or press 'a' for Android emulator, 'i' for iOS simulator
```

### Key Expo Configuration (`app.json`)

- **SDK**: Expo 55
- **Router**: Expo Router (file-based routing via `expo-router` plugin)
- **Database**: expo-sqlite plugin for on-device SQLite
- **UI style**: Light mode (`userInterfaceStyle: "light"`)
- **New Architecture**: Enabled (`newArchEnabled: true`)
- **Deep link scheme**: `travel://`
- **Plugins**: `expo-router`, `expo-sqlite`, `expo-font`

### Running on a Physical Device

1. Install [Expo Go](https://expo.dev/go) on your iOS/Android device
2. Run `npx expo start` in the project directory
3. Scan the QR code shown in the terminal
4. The app initializes the SQLite database on first launch and seeds demo data

### Metro Configuration

Custom `metro.config.js` adds `.wasm` to asset extensions (required by expo-sqlite):
```js
config.resolver.assetExts.push('wasm');
```

---

## Project Tree

```
travel/
│
├── app.json                                  # Expo configuration
├── package.json                              # Dependencies & scripts
├── tsconfig.json                             # TypeScript config (strict, @/* path alias)
├── metro.config.js                           # Metro bundler config (.wasm support)
│
├── assets/
│   ├── icon.png                              # App icon
│   ├── android-icon-foreground.png           # Android adaptive icon foreground
│   ├── android-icon-background.png           # Android adaptive icon background
│   ├── android-icon-monochrome.png           # Android monochrome icon
│   ├── favicon.png                           # Web favicon
│   └── splash-icon.png                       # Splash screen icon
│
└── src/
    ├── constants/
    │   └── theme.ts                          # MD3 theme colors + category color map
    │
    ├── types/
    │   └── database.ts                       # TS interfaces: User, Travel, Itinerary, Expense, ImportantLink
    │
    ├── db/
    │   ├── database.ts                       # DB init, migrations, seed data, password hashing
    │   ├── schema.ts                         # CREATE TABLE SQL statements (5 tables)
    │   └── queries/
    │       ├── users.ts                      # getUserByEmail, getUserById, createUser
    │       ├── travel.ts                     # getAllTravels, getTravelById, insertTravel, updateTravel, deleteTravel
    │       ├── itinerary.ts                  # getItinerariesByTravel, getItineraryById, insertItinerary, updateItinerary, deleteItinerary
    │       ├── expense.ts                    # CRUD + getDailyTotals, getCategoryTotals, getTotalExpenses
    │       └── links.ts                      # getLinksByTravel, insertLink, updateLink, deleteLink
    │
    ├── hooks/
    │   ├── useAuth.tsx                       # AuthProvider + useAuth (login/signup/logout)
    │   └── useCurrentTravel.tsx              # ActiveTravelProvider + useCurrentTravel (trip selection)
    │
    ├── utils/
    │   ├── categories.ts                     # Expense & total category lists, icons, labels, transport modes
    │   ├── currency.ts                       # 40+ currency codes, EUR/local formatting
    │   └── date.ts                           # formatDate, formatShortDate, toISODate, getDaysBetween, isToday
    │
    ├── components/
    │   ├── common/
    │   │   ├── DateSelector.tsx              # Horizontal scrollable date chips
    │   │   ├── EmptyState.tsx                # Icon + title + subtitle placeholder
    │   │   ├── FAB.tsx                       # Floating action button (bottom-right)
    │   │   └── TravelSelector.tsx            # Trip picker header (select + add new)
    │   │
    │   ├── expense/
    │   │   ├── CategoryPicker.tsx            # Expense category chip row
    │   │   ├── CurrencyInput.tsx             # EUR + local amount + currency dropdown
    │   │   └── VoiceInput.tsx                # Speech-to-text microphone button
    │   │
    │   └── itinerary/
    │       ├── CityCard.tsx                  # Card view — city image, day badge, hotel info
    │       └── CityListItem.tsx              # List view — thumbnail, city, date, day badge
    │
    └── app/                                  # Expo Router (file-based routing)
        ├── _layout.tsx                       # Root: SQLiteProvider → PaperProvider → AuthProvider
        ├── index.tsx                         # Entry redirect: auth → login, logged in → itineraries
        │
        ├── (auth)/
        │   ├── _layout.tsx                   # Auth stack (headerless)
        │   ├── login.tsx                     # Email + password login form
        │   └── signup.tsx                    # Registration form with validation
        │
        ├── (tabs)/
        │   ├── _layout.tsx                   # Bottom tab navigator (5 tabs)
        │   ├── itineraries.tsx               # Itinerary list (card/list toggle)
        │   ├── spends.tsx                    # Expenses by date with day totals
        │   ├── daily-totals.tsx              # Daily expense summaries with running total
        │   ├── category-totals.tsx           # Category breakdown with progress bars
        │   └── data-links.tsx                # Important links grouped by type
        │
        ├── itinerary/
        │   ├── [id].tsx                      # Itinerary detail — read/edit mode, cost breakdown
        │   └── [id]/
        │       └── photo.tsx                 # Full-screen photo viewer
        │
        ├── expense/
        │   ├── add.tsx                       # Add expense — voice, category, currency, receipt photo
        │   └── [id].tsx                      # Edit expense — update/delete
        │
        ├── travel/
        │   ├── add.tsx                       # Create new trip — name, dates, countries, cover photo
        │   └── select.tsx                    # Trip selection list
        │
        └── link/
            └── add.tsx                       # Add important link — title, URL, type
```

---

## Architecture

### Provider Stack

The app wraps all content in a nested provider hierarchy (defined in `_layout.tsx`):

```
<Suspense>
  <SQLiteProvider>          ← On-device database connection
    <PaperProvider>         ← Material Design 3 theme
      <AuthProvider>        ← Login state (useAuth hook)
        <StatusBar />
        <AppNavigator />   ← Conditional auth/tabs routing
          <ActiveTravelProvider>  ← Current trip context (useCurrentTravel hook)
            <Stack />             ← Screen navigation
          </ActiveTravelProvider>
      </AuthProvider>
    </PaperProvider>
  </SQLiteProvider>
</Suspense>
```

### Data Flow

- **No backend** — all data lives in an on-device SQLite database (`travel.db`)
- **Expo SQLite** provides the database connection via `useSQLiteContext()` hook
- **Query functions** in `src/db/queries/` encapsulate all SQL operations
- **Context hooks** (`useAuth`, `useCurrentTravel`) manage global state
- **Auto-seed**: On first launch, the database creates tables and seeds 2 demo trips (Italy + Japan) with itineraries, expenses, and links

### Authentication

- Local-only auth using SQLite `users` table
- Passwords hashed with SHA-256 via `expo-crypto` (salted with email)
- No JWT/tokens — user state held in React context
- Demo credentials: `demo@travel.app` / `demo1234`

---

## Database

### Schema (5 tables)

| Table             | Key Columns                                                              |
|-------------------|--------------------------------------------------------------------------|
| **users**         | user_id, email (unique), password_hash, name, created_at                |
| **travel**        | travel_id, user_id, description, start_date, end_date, countries, cover_image_uri |
| **itinerary**     | itinerary_id, travel_id, date, day_no, city, city_image_uri, flight_detail, transport_mode/cost, hotel_name/address/cost, food/transportation/activities/misc_cost, activity_description, notes |
| **expense**       | expense_id, travel_id, itinerary_id (nullable), date, description, category, amount_eur, amount_local, local_currency_code, receipt_image_uri, voice_note_uri |
| **important_links** | link_id, travel_id, type (booking/transport/activity/restaurant/other), title, url, icon_url |

### Relationships

```
users 1──N travel 1──N itinerary
                   1──N expense (also optionally linked to itinerary)
                   1──N important_links
```

### Expense Categories

- **Expense-level**: food, transportation, activities, gifts/purchase
- **Trip-level totals**: flights, visa_fee, cancellation, hotels, ferries, activities, trains, cabs, food, others

### Currency Support

- All amounts stored in EUR (`amount_eur`) as base currency
- Optional local currency tracking (`amount_local` + `local_currency_code`)
- 40+ currency codes supported (USD, GBP, JPY, INR, THB, etc.)

---

## Navigation

### Routing (Expo Router — file-based)

```
/                           → Redirect: login or itineraries
/(auth)/login               → Login screen
/(auth)/signup              → Signup screen

/(tabs)/itineraries         → Trip day-by-day view (card/list)
/(tabs)/spends              → Expenses by date
/(tabs)/daily-totals        → Daily expense summaries
/(tabs)/category-totals     → Category breakdown
/(tabs)/data-links          → Important links

/itinerary/[id]             → Itinerary detail (read/edit)
/itinerary/[id]/photo       → Full-screen photo viewer
/expense/add                → Add new expense (modal)
/expense/[id]               → Edit expense
/travel/add                 → Create new trip (modal)
/travel/select              → Switch between trips (modal)
/link/add                   → Add important link (modal)
```

### Bottom Tab Bar (5 tabs)

| Tab          | Icon               | Screen              | Purpose                          |
|-------------|--------------------|----------------------|----------------------------------|
| Itineraries  | map-marker-path    | itineraries.tsx      | Day-by-day trip itinerary        |
| Spends       | currency-eur       | spends.tsx           | Expenses list by date            |
| Daily        | calendar-text      | daily-totals.tsx     | Daily expense summaries          |
| Categories   | chart-pie          | category-totals.tsx  | Category breakdown + percentages |
| Links        | link-variant       | data-links.tsx       | Important travel links           |

### Header

- **Title**: Current trip name (or "Travel Log" if none selected)
- **Right action**: Logout button (icon)

---

## Screens

### Auth

| Screen    | File                    | Description                                          |
|-----------|------------------------|------------------------------------------------------|
| Login     | `(auth)/login.tsx`      | Email + password, eye toggle, link to signup         |
| Signup    | `(auth)/signup.tsx`     | Name, email, password + confirm, 6-char minimum     |

### Tab Screens

| Screen           | File                        | Description                                            |
|-----------------|-----------------------------|---------------------------------------------------------|
| Itineraries      | `(tabs)/itineraries.tsx`    | Card/list toggle, TravelSelector, FAB to add day       |
| Spends           | `(tabs)/spends.tsx`         | DateSelector, expense rows with category icons, day total |
| Daily Totals     | `(tabs)/daily-totals.tsx`   | Cards per day with total + count, running total         |
| Category Totals  | `(tabs)/category-totals.tsx`| Category rows with color, amount, %, progress bar       |
| Data Links       | `(tabs)/data-links.tsx`     | SectionList by link type, open URL + delete             |

### Detail / Form Screens

| Screen             | File                        | Description                                          |
|-------------------|-----------------------------|------------------------------------------------------|
| Itinerary Detail   | `itinerary/[id].tsx`        | Read/edit toggle, hero image, cost breakdown by section |
| Photo Viewer       | `itinerary/[id]/photo.tsx`  | Full-screen black background image viewer            |
| Add Expense        | `expense/add.tsx`           | Voice input, description, date, category, currency, receipt photo |
| Edit Expense       | `expense/[id].tsx`          | Same form as add, with update/delete actions         |
| Add Trip           | `travel/add.tsx`            | Name, start/end dates, countries, cover photo        |
| Select Trip        | `travel/select.tsx`         | FlatList of trips, checkmark on current              |
| Add Link           | `link/add.tsx`              | Title, URL, type segmented buttons                   |

---

## Components

### Common

| Component        | File                         | Purpose                                    |
|-----------------|------------------------------|--------------------------------------------|
| DateSelector     | `common/DateSelector.tsx`    | Horizontal scrollable date chip row        |
| EmptyState       | `common/EmptyState.tsx`      | Placeholder with icon + title + subtitle   |
| FAB              | `common/FAB.tsx`             | Floating action button (bottom-right)      |
| TravelSelector   | `common/TravelSelector.tsx`  | Trip picker header (select + add buttons)  |

### Expense

| Component        | File                          | Purpose                                    |
|-----------------|-------------------------------|--------------------------------------------|
| CategoryPicker   | `expense/CategoryPicker.tsx`  | Colored chip row for expense categories    |
| CurrencyInput    | `expense/CurrencyInput.tsx`   | EUR amount + local amount + currency menu  |
| VoiceInput       | `expense/VoiceInput.tsx`      | Speech-to-text microphone button           |

### Itinerary

| Component        | File                            | Purpose                                  |
|-----------------|---------------------------------|------------------------------------------|
| CityCard         | `itinerary/CityCard.tsx`        | Card view — cover image, day badge, hotel |
| CityListItem     | `itinerary/CityListItem.tsx`    | List view — thumbnail, city name, date   |

---

## Design System

- **Theme**: Material Design 3 Light (via React Native Paper)
- **Primary**: `#1B5E20` (dark green)
- **Secondary**: `#FF8F00` (amber)
- **Tertiary**: `#0277BD` (blue)
- **Background**: `#FAFAFA`
- **Surface**: `#FFFFFF`
- **Category colors**: Each expense/total category has a unique color (defined in `theme.ts`)
- **Icons**: MaterialCommunityIcons throughout

---

## Development Setup

### Prerequisites

- Node.js 22+
- npm
- [Expo Go](https://expo.dev/go) app on your phone

### Getting Started

```bash
# Install dependencies
npm install

# Start the development server
npx expo start

# Scan QR code with Expo Go, or:
# Press 'a' for Android emulator
# Press 'i' for iOS simulator
# Press 'w' for web browser
```

### Seed Data

On first launch, the database automatically creates all tables and seeds:
- **Demo user**: `demo@travel.app` / `demo1234`
- **Trip 1**: Italy Spring 2026 (8 days — Rome, Florence, Venice, Milan) with 30 expenses + 6 links
- **Trip 2**: Japan Golden Week 2026 (9 days — Tokyo, Kyoto, Osaka, Hiroshima) with 29 expenses + 6 links

### Scripts

```bash
npm start          # npx expo start
npm run android    # npx expo start --android
npm run ios        # npx expo start --ios
npm run web        # npx expo start --web
```
