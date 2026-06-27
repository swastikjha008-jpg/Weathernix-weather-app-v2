# Weathernix V2 🌤️

A fully polished, responsive weather dashboard built with React and the OpenWeather API. V2 is a complete refinement of the original Weathernix — every UI issue has been fixed, all buttons work as expected, and the overall experience is clean and consistent across devices.

> **V1 → V2:** Rebuilt and refined three weeks after the original. V2 resolves all known layout bugs, button alignment issues, and spacing inconsistencies from V1.

---

## Features

- 🔍 **Live city search** — search any city and get real-time weather instantly
- 🌡️ **Current conditions** — temperature, humidity, wind speed, pressure, and visibility
- 📅 **5-day forecast** — daily outlook with weather icons
- 🏙️ **Nearby cities panel** — weather cards for surrounding locations
- ⭐ **Favorites system** — save and revisit cities, persisted via local storage
- 🌓 **Day / Night mode toggle** — manually switch between light and dark themes
- 🎨 **Dynamic backgrounds** — weather-reactive visuals powered by Canvas
- 🌧️ **Animated rain effect** — live canvas-based rain animation for rainy conditions
- 📱 **Fully responsive** — works seamlessly on desktop and mobile

---

## Tech Stack

| Technology | Purpose |
|---|---|
| React | UI framework |
| Vite | Build tool & dev server |
| OpenWeather API | Live weather data |
| Lucide React | Icon library |
| HTML / CSS / JS | Structure, styling, logic |

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/swastikjha008-jpg/Weathernix-weather-app-v2.git
cd Weathernix-weather-app-v2
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up your API key

Create a `.env` file in the root of the project:

```env
VITE_OPENWEATHER_API_KEY=your_api_key_here
```

You can get a free API key at [openweathermap.org](https://openweathermap.org/api).

### 4. Run the development server

```bash
npm run dev
```

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start local dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |

---

## Folder Structure

```
Weathernix-weather-app-v2/
├── public/
├── src/
│   ├── assets/
│   ├── App.jsx
│   └── main.jsx
├── .env.example
├── .gitignore
├── index.html
├── package.json
└── vite.config.js
```

---

## What Changed in V2

V1 was built as a first attempt — functional, but rough around the edges. V2 is the clean version:

- All button interactions work correctly
- Layout spacing and alignment fixed across all screen sizes
- UI consistency improved throughout the dashboard
- Mobile responsiveness refined

---

## What I Learned

- Integrating and managing external REST APIs in React
- State management with React hooks (`useState`, `useEffect`)
- Conditional rendering based on data and user interaction
- Canvas-based animations for weather effects
- Persisting user data with `localStorage`
- Building and iterating on a full responsive UI

---

## License

Built for learning, practice, and portfolio purposes.

You're welcome to explore, fork, and learn from this project. If you use or build on it, a credit is appreciated.

© 2026 Swastik Jha. All rights reserved.
