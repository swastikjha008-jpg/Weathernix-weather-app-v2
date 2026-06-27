import React, { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronRight,
  Cloud,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  Droplets,
  Eye,
  Gauge,
  Heart,
  Home,
  Loader2,
  LocateFixed,
  MapPin,
  Menu,
  Moon,
  Search,
  Snowflake,
  Star,
  Sun,
  Wind,
  Zap,
} from "lucide-react";

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY?.trim();
const BASE_URL = "https://api.openweathermap.org/data/2.5";
const FAVORITES_KEY = "weathernix:v2:favorites";
const THEME_KEY = "weathernix:v2:theme";

const NEARBY_CITIES = {
  Delhi: ["Noida", "Gurugram", "Ghaziabad", "Faridabad", "Meerut"],
  Mumbai: ["Thane", "Navi Mumbai", "Kalyan", "Panvel", "Bhiwandi"],
  Prayagraj: ["Varanasi", "Lucknow", "Kanpur", "Fatehpur", "Raebareli"],
  London: ["Croydon", "Wembley", "Bromley", "Ilford", "Watford"],
};

const FALLBACK_NEARBY = ["Noida", "Lucknow", "Kanpur", "Varanasi", "Ghaziabad"];

const styles = `
* { box-sizing: border-box; }
html, body, #root { min-height: 100%; height: 100%; }
body { margin: 0; overflow: hidden; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
button, input { font: inherit; }
button { border: 0; cursor: pointer; -webkit-tap-highlight-color: transparent; }

.app {
  min-height: 100vh;
  height: 100vh;
  overflow: hidden;
  color: var(--text);
  --text: #f8fbff;
  --muted: #93abc0;
  --soft: rgba(185, 222, 245, 0.72);
  --panel: rgba(8, 24, 42, 0.72);
  --panel-2: rgba(13, 36, 60, 0.76);
  --panel-3: rgba(255, 255, 255, 0.08);
  --line: rgba(94, 164, 218, 0.24);
  --accent: #39b7e9;
  --accent-2: #7de3ff;
  --danger: #ff5f8f;
  --shadow: 0 22px 70px rgba(0, 0, 0, 0.34);
  background:
    radial-gradient(circle at 72% 4%, rgba(53, 142, 224, 0.34), transparent 34%),
    radial-gradient(circle at 15% 12%, rgba(25, 81, 132, 0.36), transparent 30%),
    linear-gradient(145deg, #07101e 0%, #0b1a2b 45%, #040b13 100%);
}
.app.day {
  --text: #082033;
  --muted: rgba(9, 57, 89, 0.66);
  --soft: rgba(7, 80, 116, 0.72);
  --panel: rgba(255, 255, 255, 0.52);
  --panel-2: rgba(255, 255, 255, 0.68);
  --panel-3: rgba(255, 255, 255, 0.42);
  --line: rgba(9, 96, 147, 0.20);
  --accent: #0479b8;
  --accent-2: #0396c7;
  --shadow: 0 22px 60px rgba(25, 99, 132, 0.18);
  background:
    radial-gradient(circle at 78% 10%, rgba(255, 214, 93, 0.42), transparent 28%),
    radial-gradient(circle at 18% 14%, rgba(255, 255, 255, 0.48), transparent 27%),
    linear-gradient(145deg, #8bd8ff 0%, #c5efff 58%, #eefbff 100%);
}
.rain {
  position: fixed;
  inset: 0;
  z-index: 0;
  opacity: 0.45;
  pointer-events: none;
  background-image:
    linear-gradient(105deg, transparent 0 78%, rgba(126, 202, 246, 0.32) 79% 82%, transparent 83%),
    linear-gradient(105deg, transparent 0 70%, rgba(126, 202, 246, 0.22) 71% 74%, transparent 75%);
  background-size: 220px 260px, 340px 380px;
  animation: rain 1.8s linear infinite;
}
.day .rain { opacity: 0; }
.skyline {
  position: fixed;
  inset: auto 0 0;
  z-index: 0;
  height: 23vh;
  opacity: 0.75;
  pointer-events: none;
  background: linear-gradient(to top, rgba(1, 8, 15, 0.96), rgba(1, 8, 15, 0));
}
.day .skyline { opacity: 0.12; }
.shell {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 300px minmax(0, 1fr);
  height: 100%;
}
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 34px;
  min-width: 0;
  padding: 34px 20px 24px;
  background: rgba(3, 13, 25, 0.58);
  border-right: 1px solid var(--line);
  backdrop-filter: blur(24px);
}
.day .sidebar { background: rgba(255, 255, 255, 0.24); }
.brand { display: flex; align-items: center; gap: 16px; min-width: 0; }
.brandMark {
  width: 58px;
  height: 58px;
  flex: 0 0 58px;
  display: grid;
  place-items: center;
  border-radius: 18px;
  color: var(--accent-2);
  background: rgba(42, 167, 213, 0.16);
  box-shadow: inset 0 0 0 1px rgba(120, 211, 246, 0.11);
}
.brandTitle { font-size: 30px; line-height: 1; font-weight: 900; letter-spacing: 0; color: var(--text); }
.brandSub { margin-top: 9px; color: var(--muted); font-size: 16px; line-height: 1.45; }
.nav { display: grid; gap: 12px; }
.navBtn {
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  min-height: 64px;
  padding: 0 20px;
  border-radius: 18px;
  color: var(--muted);
  background: transparent;
  text-align: left;
  font-weight: 800;
  font-size: 20px;
  transition: 0.2s ease;
}
.navBtn:hover { color: var(--text); background: var(--panel-3); }
.navBtn.active {
  color: #fff;
  background: linear-gradient(135deg, rgba(46, 187, 229, 0.58), rgba(61, 144, 203, 0.28));
  box-shadow: 0 0 28px rgba(67, 208, 240, 0.35);
}
.day .navBtn.active { color: var(--text); }
.sidebarTip {
  margin-top: auto;
  padding: 28px 22px;
  border: 1px solid var(--line);
  border-radius: 22px;
  background: var(--panel);
  text-align: center;
  box-shadow: var(--shadow);
}
.tipIcon { font-size: 42px; line-height: 1; }
.tipTitle { margin-top: 16px; font-size: 21px; font-weight: 900; color: var(--text); }
.tipText { margin-top: 14px; color: var(--muted); line-height: 1.55; }
.content { min-width: 0; display: flex; flex-direction: column; height: 100%; overflow: hidden; }
.topbar {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 22px;
  padding: 28px 26px 0 34px;
}
.greeting { font-size: clamp(32px, 3vw, 44px); line-height: 1.05; font-weight: 950; color: var(--text); letter-spacing: 0; }
.subtitle { margin-top: 12px; color: var(--muted); font-size: 20px; }
.topActions { display: flex; align-items: center; justify-content: flex-end; gap: 12px; flex-wrap: wrap; }
.roundBtn, .theme {
  min-width: 56px;
  height: 56px;
  display: inline-grid;
  place-items: center;
  border: 1px solid var(--line);
  border-radius: 999px;
  color: var(--text);
  background: var(--panel);
  backdrop-filter: blur(18px);
  box-shadow: 0 10px 26px rgba(0, 0, 0, 0.14);
  transition: transform 0.2s ease, background 0.2s ease;
}
.roundBtn:hover, .theme:hover { transform: translateY(-2px); background: var(--panel-2); }
.theme { grid-template-columns: 18px 50px 18px; gap: 10px; padding: 0 14px; }
.switch { position: relative; width: 50px; height: 28px; border-radius: 999px; background: rgba(55, 178, 225, 0.25); border: 1px solid var(--line); }
.knob { position: absolute; top: 4px; left: 4px; width: 18px; height: 18px; border-radius: 50%; background: #fff; box-shadow: 0 3px 9px rgba(0, 0, 0, 0.3); transition: left 0.25s ease; }
.day .knob { left: 26px; }
.searchRow {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 66px;
  gap: 12px;
  padding: 24px 26px 0 34px;
}
.searchField { position: relative; min-width: 0; }
.searchIcon { position: absolute; left: 22px; top: 50%; transform: translateY(-50%); color: var(--muted); }
.searchInput {
  width: 100%;
  height: 66px;
  padding: 0 20px 0 58px;
  border-radius: 22px;
  border: 1px solid var(--line);
  outline: none;
  color: var(--text);
  background: var(--panel);
  backdrop-filter: blur(18px);
  font-size: 18px;
}
.searchInput::placeholder { color: var(--muted); }
.submitBtn {
  width: 66px;
  height: 66px;
  display: grid;
  place-items: center;
  border-radius: 22px;
  color: white;
  background: linear-gradient(145deg, #37bdf0, #1d91cf);
  box-shadow: 0 14px 30px rgba(40, 178, 229, 0.34);
}
.notice {
  margin: 14px 26px 0 34px;
  padding: 12px 16px;
  border: 1px solid rgba(255, 117, 117, 0.34);
  border-radius: 16px;
  color: var(--text);
  background: rgba(255, 94, 120, 0.12);
}
.notice.info { border-color: var(--line); background: rgba(88, 189, 230, 0.12); }
.page {
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: 24px 26px 22px 34px;
}
.overview { display: grid; grid-template-columns: minmax(0, 1fr) minmax(340px, 31vw); gap: 18px; }
.panel {
  border: 1px solid var(--line);
  border-radius: 26px;
  background: var(--panel);
  backdrop-filter: blur(24px);
  box-shadow: var(--shadow);
}
.pad { padding: 28px; }
.weatherCard { position: relative; overflow: hidden; min-height: 420px; }
.cardHeader { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; padding-right: 58px; }
.location { display: flex; gap: 10px; align-items: center; }
.cityTitle { font-size: 28px; line-height: 1.15; font-weight: 950; color: var(--text); }
.desc { margin-top: 10px; color: var(--muted); font-size: 18px; }
.pill {
  min-height: 52px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0 22px;
  border: 1px solid var(--line);
  border-radius: 999px;
  color: var(--text);
  background: var(--panel-3);
  font-weight: 900;
  white-space: nowrap;
}
.heartBtn {
  width: 48px;
  height: 48px;
  display: grid;
  place-items: center;
  border: 1px solid var(--line);
  border-radius: 999px;
  color: var(--text);
  background: var(--panel-3);
  transition: 0.2s ease;
}
.heartBtn:hover { transform: translateY(-2px); }
.heartBtn.active { color: var(--danger); background: rgba(255, 255, 255, 0.14); }
.heartFloat { position: absolute; top: 24px; right: 24px; z-index: 2; }
.heroWeather { display: grid; grid-template-columns: 200px minmax(0, 1fr); align-items: center; gap: 36px; padding: 36px 0 28px; }
.weatherIconBox {
  width: 176px;
  height: 176px;
  display: grid;
  place-items: center;
  border-radius: 36px;
  color: var(--accent-2);
  background: rgba(52, 185, 233, 0.12);
}
.temp { font-size: clamp(82px, 8vw, 116px); line-height: 0.9; font-weight: 950; color: var(--text); letter-spacing: 0; }
.unit { color: var(--muted); font-size: 0.48em; vertical-align: top; }
.condition { margin-top: 14px; color: var(--accent-2); font-size: 34px; font-weight: 950; }
.feels { margin-top: 7px; color: var(--muted); font-size: 19px; }
.stats { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 14px; }
.stat {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
  min-height: 98px;
  padding: 16px;
  border: 1px solid var(--line);
  border-radius: 18px;
  background: rgba(0, 0, 0, 0.14);
}
.day .stat { background: rgba(255, 255, 255, 0.28); }
.statIcon { width: 48px; height: 48px; flex: 0 0 48px; display: grid; place-items: center; border-radius: 16px; color: var(--accent-2); background: rgba(43, 171, 220, 0.16); }
.statLabel { color: var(--muted); font-size: 16px; }
.statValue { margin-top: 5px; color: var(--text); font-size: 22px; font-weight: 950; }
.sectionHead { display: flex; align-items: flex-start; justify-content: space-between; gap: 14px; margin-bottom: 18px; }
.sectionTitle { color: var(--text); font-size: 28px; line-height: 1.12; font-weight: 950; }
.sectionSub { margin-top: 10px; color: var(--muted); line-height: 1.6; }
.forecastList { display: grid; gap: 12px; }
.forecastRow {
  display: grid;
  grid-template-columns: 92px minmax(0, 1fr) auto;
  align-items: center;
  gap: 14px;
  min-height: 96px;
  padding: 14px 18px;
  border: 1px solid var(--line);
  border-radius: 18px;
  background: rgba(0, 0, 0, 0.14);
}
.day .forecastRow { background: rgba(255, 255, 255, 0.28); }
.rowDay { color: var(--text); font-size: 21px; font-weight: 950; }
.rowDate { margin-top: 4px; color: var(--muted); font-size: 16px; }
.rowCond { display: flex; align-items: center; justify-content: center; gap: 10px; color: var(--muted); min-width: 0; }
.temps { color: var(--text); font-size: 22px; font-weight: 950; white-space: nowrap; }
.hi { color: var(--accent-2); }
.below { margin-top: 18px; }
.cityGrid { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 14px; }
.cityCard {
  position: relative;
  min-height: 210px;
  padding: 18px;
  border: 1px solid var(--line);
  border-radius: 22px;
  background: rgba(0, 0, 0, 0.14);
  color: var(--text);
  text-align: left;
  transition: 0.22s ease;
}
.day .cityCard { background: rgba(255, 255, 255, 0.28); }
.cityCard:hover { transform: translateY(-4px); border-color: rgba(91, 205, 240, 0.48); }
.cityCard .heartBtn { position: absolute; top: 12px; right: 12px; width: 40px; height: 40px; }
.cityName { padding-right: 42px; font-size: 21px; font-weight: 950; }
.cityMeta { margin-top: 6px; color: var(--muted); font-size: 15px; }
.cityMid { display: flex; justify-content: space-between; align-items: center; gap: 12px; margin-top: 28px; color: var(--accent-2); }
.cityTemp { color: var(--text); font-size: 34px; line-height: 1; font-weight: 950; }
.cityCond { margin-top: 5px; color: var(--muted); }
.cityRange { margin-top: 18px; color: var(--muted); font-weight: 800; }
.tabGrid { display: grid; grid-template-columns: minmax(0, 1fr) minmax(360px, 0.75fr); gap: 18px; }
.empty, .loading {
  min-height: 260px;
  display: grid;
  place-items: center;
  text-align: center;
  color: var(--muted);
  padding: 28px;
}
.emptyTitle { margin-top: 12px; color: var(--text); font-size: 24px; font-weight: 950; }
.emptyText { margin-top: 10px; max-width: 460px; line-height: 1.6; }
.spin { animation: spin 1s linear infinite; }
footer { padding: 20px 0 2px; color: var(--muted); text-align: center; font-size: 14px; }

@keyframes spin { to { transform: rotate(360deg); } }
@keyframes rain { to { background-position: 0 260px, 0 380px; } }

@media (max-width: 1280px) {
  .shell { grid-template-columns: 260px minmax(0, 1fr); }
  .brandTitle { font-size: 25px; }
  .navBtn { font-size: 17px; }
  .overview, .tabGrid { grid-template-columns: 1fr; }
  .cityGrid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}
@media (max-width: 860px) {
  body { overflow: auto; }
  .app { height: auto; min-height: 100vh; overflow: visible; }
  .shell { display: block; height: auto; }
  .sidebar { position: sticky; top: 0; z-index: 5; padding: 14px; gap: 14px; }
  .brandSub, .sidebarTip { display: none; }
  .nav { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; }
  .navBtn { min-height: 50px; justify-content: center; padding: 0 10px; border-radius: 14px; font-size: 0; }
  .navBtn svg { width: 20px; height: 20px; }
  .topbar { padding: 22px 16px 0; flex-direction: column; }
  .topActions { width: 100%; justify-content: space-between; }
  .searchRow, .page { padding-left: 16px; padding-right: 16px; }
  .heroWeather { grid-template-columns: 1fr; justify-items: center; text-align: center; gap: 18px; }
  .weatherIconBox { width: 132px; height: 132px; }
  .stats, .cityGrid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .cardHeader { display: block; padding-right: 48px; }
  .pill { margin-top: 14px; }
}
@media (max-width: 560px) {
  .brandMark { width: 46px; height: 46px; flex-basis: 46px; }
  .brandTitle { font-size: 23px; }
  .greeting { font-size: 32px; }
  .subtitle { font-size: 16px; }
  .theme { grid-template-columns: 16px 44px 16px; min-width: 132px; }
  .roundBtn { min-width: 50px; height: 50px; }
  .searchRow { grid-template-columns: 1fr 58px; }
  .searchInput, .submitBtn { height: 58px; border-radius: 18px; }
  .pad { padding: 20px; }
  .weatherCard { min-height: auto; }
  .stats, .cityGrid { grid-template-columns: 1fr; }
  .forecastRow { grid-template-columns: 76px minmax(0, 1fr); }
  .temps { grid-column: 2; text-align: center; }
}
`;

function titleCase(value = "") {
  return value
    .toString()
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getWeatherIcon(id = 800) {
  if (id >= 200 && id < 300) return Zap;
  if (id >= 300 && id < 400) return CloudDrizzle;
  if (id >= 500 && id < 600) return CloudRain;
  if (id >= 600 && id < 700) return CloudSnow;
  if (id >= 700 && id < 800) return Cloud;
  if (id === 800) return Sun;
  if (id > 800) return Cloud;
  return Snowflake;
}

function normalizeWeather(data, meta = "") {
  const condition = data?.weather?.[0] || {};
  const cityName = data?.name || "Unknown";
  const country = data?.sys?.country || "";
  const temp = Math.round(data?.main?.temp ?? 0);

  return {
    key: `${cityName}_${country}`.toLowerCase(),
    cityName,
    country,
    label: country ? `${cityName}, ${country}` : cityName,
    subtitle: meta || titleCase(condition.description || condition.main || "Live weather"),
    condition: titleCase(condition.main || "Weather"),
    weatherId: condition.id ?? 800,
    temp,
    tempMin: Math.round(data?.main?.temp_min ?? temp),
    tempMax: Math.round(data?.main?.temp_max ?? temp),
    feelsLike: Math.round(data?.main?.feels_like ?? temp),
    humidity: Math.round(data?.main?.humidity ?? 0),
    wind: Math.round((data?.wind?.speed ?? 0) * 3.6),
    pressure: Math.round(data?.main?.pressure ?? 0),
    visibility: typeof data?.visibility === "number" ? (data.visibility / 1000).toFixed(1) : "--",
  };
}

function normalizeForecast(list = []) {
  const groups = new Map();

  list.forEach((item) => {
    const key = item?.dt_txt?.slice(0, 10);
    if (!key) return;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(item);
  });

  return Array.from(groups.entries()).slice(0, 5).map(([dateKey, items], index) => {
    const date = new Date(`${dateKey}T00:00:00`);
    const noon = items.find((item) => item.dt_txt?.includes("12:00:00")) || items[Math.floor(items.length / 2)] || items[0];
    const temps = items.map((item) => item.main || {});
    const min = Math.min(...temps.map((item) => item.temp_min ?? item.temp ?? 0));
    const max = Math.max(...temps.map((item) => item.temp_max ?? item.temp ?? 0));
    const condition = noon?.weather?.[0] || {};

    return {
      key: dateKey,
      day: index === 0 ? "Today" : date.toLocaleDateString("en-US", { weekday: "short" }),
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      min: Math.round(min),
      max: Math.round(max),
      condition: titleCase(condition.main || "Weather"),
      weatherId: condition.id ?? 800,
    };
  });
}

async function fetchJson(url, fallbackMessage) {
  const response = await fetch(url);
  if (!response.ok) {
    let message = fallbackMessage;
    try {
      const body = await response.json();
      if (body?.message) message = titleCase(body.message);
    } catch {
      // Keep the friendly fallback.
    }
    throw new Error(message);
  }
  return response.json();
}

async function fetchCurrentByCity(city) {
  if (!API_KEY) throw new Error("Missing VITE_OPENWEATHER_API_KEY in your .env file.");
  const data = await fetchJson(
    `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`,
    "City not found"
  );
  return normalizeWeather(data);
}

async function fetchCurrentByCoords(lat, lon) {
  if (!API_KEY) throw new Error("Missing VITE_OPENWEATHER_API_KEY in your .env file.");
  const data = await fetchJson(
    `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`,
    "Could not detect weather for your location"
  );
  return normalizeWeather(data, "Detected from your current location");
}

async function fetchForecast(city) {
  if (!API_KEY) throw new Error("Missing VITE_OPENWEATHER_API_KEY in your .env file.");
  const data = await fetchJson(
    `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`,
    "Forecast unavailable"
  );
  return normalizeForecast(data?.list || []);
}

async function fetchNearby(city) {
  const cities = NEARBY_CITIES[city] || FALLBACK_NEARBY;
  const results = await Promise.all(
    cities.map(async (nearCity) => {
      try {
        const card = await fetchCurrentByCity(nearCity);
        return { ...card, subtitle: "Nearby city" };
      } catch {
        return null;
      }
    })
  );
  return results.filter(Boolean);
}

function WeatherStat({ icon: Icon, label, value }) {
  return (
    <div className="stat">
      <div className="statIcon">
        <Icon size={22} />
      </div>
      <div>
        <div className="statLabel">{label}</div>
        <div className="statValue">{value}</div>
      </div>
    </div>
  );
}

function HeartButton({ active, onClick, label }) {
  return (
    <button type="button" className={`heartBtn ${active ? "active" : ""}`} onClick={onClick} aria-label={label}>
      <Heart size={21} fill={active ? "currentColor" : "none"} />
    </button>
  );
}

function LoadingState({ label }) {
  return (
    <div className="loading">
      <div>
        <Loader2 className="spin" size={42} />
        <div style={{ marginTop: 12 }}>{label}</div>
      </div>
    </div>
  );
}

function EmptyState({ title, text }) {
  return (
    <div className="empty">
      <div>
        <Star size={42} color="var(--accent-2)" />
        <div className="emptyTitle">{title}</div>
        <div className="emptyText">{text}</div>
      </div>
    </div>
  );
}

function CityCard({ item, active, onFavorite, onOpen }) {
  return (
    <article className="cityCard" role="button" tabIndex={0} onClick={onOpen} onKeyDown={(event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onOpen();
      }
    }}>
      <HeartButton
        active={active}
        label={active ? "Remove city from favorites" : "Add city to favorites"}
        onClick={(event) => {
          event.stopPropagation();
          onFavorite(item);
        }}
      />
      <div className="cityName">{item.label}</div>
      <div className="cityMeta">{item.subtitle}</div>
      <div className="cityMid">
        {React.createElement(getWeatherIcon(item.weatherId), { size: 42, strokeWidth: 1.8 })}
        <div>
          <div className="cityTemp">{item.temp}&deg;</div>
          <div className="cityCond">{item.condition}</div>
        </div>
      </div>
      <div className="cityRange">
        {item.tempMin}&deg; / <span className="hi">{item.tempMax}&deg;</span>
      </div>
    </article>
  );
}

function App() {
  const [query, setQuery] = useState("Delhi");
  const [theme, setTheme] = useState(() => localStorage.getItem(THEME_KEY) || "night");
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [nearby, setNearby] = useState([]);
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState("");

  const isDay = theme === "day";
  const favoriteKeys = useMemo(() => new Set(favorites.map((item) => item.key)), [favorites]);
  const currentIsFavorite = weather ? favoriteKeys.has(weather.key) : false;
  const WeatherIcon = weather ? getWeatherIcon(weather.weatherId) : CloudRain;

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    loadCity("Delhi");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function hydrate(current) {
    const [nextForecast, nextNearby] = await Promise.all([
      fetchForecast(current.cityName).catch(() => []),
      fetchNearby(current.cityName).catch(() => []),
    ]);
    setWeather(current);
    setForecast(nextForecast);
    setNearby(nextNearby);
    setQuery(current.cityName);
  }

  async function loadCity(city) {
    if (!city?.trim()) return;
    setLoading(true);
    setError("");
    try {
      const current = await fetchCurrentByCity(city.trim());
      await hydrate(current);
      setActiveTab("overview");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to fetch weather.");
    } finally {
      setLoading(false);
    }
  }

  function locateUser() {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported in this browser.");
      return;
    }

    setLocating(true);
    setError("");
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const current = await fetchCurrentByCoords(latitude, longitude);
          await hydrate(current);
          setActiveTab("overview");
        } catch (err) {
          setError(err instanceof Error ? err.message : "Unable to detect your current city.");
        } finally {
          setLocating(false);
        }
      },
      () => {
        setLocating(false);
        setError("Location permission was blocked. Search a city manually or allow location access.");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  }

  function toggleFavorite(item) {
    setFavorites((current) => {
      const exists = current.some((favorite) => favorite.key === item.key);
      return exists ? current.filter((favorite) => favorite.key !== item.key) : [item, ...current];
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    loadCity(query);
  }

  const navItems = [
    { id: "overview", icon: Home, label: "Overview" },
    { id: "forecast", icon: CalendarDays, label: "Forecast" },
    { id: "nearby", icon: MapPin, label: "Nearby Cities" },
    { id: "favorites", icon: Heart, label: "Favorites" },
  ];

  const renderWeatherCard = (compact = false) => {
    if (!weather) return <LoadingState label="Search for a city to begin." />;

    return (
      <section className="panel pad weatherCard">
        <div className="heartFloat">
          <HeartButton
            active={currentIsFavorite}
            label={currentIsFavorite ? "Remove current city from favorites" : "Add current city to favorites"}
            onClick={() => toggleFavorite(weather)}
          />
        </div>
        <div className="cardHeader">
          <div>
            <div className="location">
              <MapPin size={20} color="var(--accent-2)" />
              <div className="cityTitle">{weather.label}</div>
            </div>
            <div className="desc">{weather.subtitle}</div>
          </div>
          <button type="button" className="pill" onClick={() => loadCity(weather.cityName)}>
            Current Weather
          </button>
        </div>

        <div className="heroWeather">
          <div className="weatherIconBox">
            <WeatherIcon size={compact ? 80 : 104} strokeWidth={1.7} />
          </div>
          <div>
            <div className="temp">
              {weather.temp}<span className="unit">&deg;C</span>
            </div>
            <div className="condition">{weather.condition}</div>
            <div className="feels">Feels like {weather.feelsLike}&deg;C</div>
          </div>
        </div>

        <div className="stats">
          <WeatherStat icon={Droplets} label="Humidity" value={`${weather.humidity}%`} />
          <WeatherStat icon={Wind} label="Wind" value={`${weather.wind} km/h`} />
          <WeatherStat icon={Gauge} label="Pressure" value={`${weather.pressure} hPa`} />
          <WeatherStat icon={Eye} label="Visibility" value={`${weather.visibility} km`} />
        </div>
      </section>
    );
  };

  const renderForecast = (buttonLabel = "View More", onButton = () => setActiveTab("forecast")) => (
    <section className="panel pad">
      <div className="sectionHead">
        <div>
          <div className="sectionTitle">5-Day Forecast</div>
          <div className="sectionSub">A clean outlook for the city you searched.</div>
        </div>
        <button type="button" className="pill" onClick={onButton}>{buttonLabel}</button>
      </div>

      {forecast.length ? (
        <div className="forecastList">
          {forecast.map((item) => {
            const Icon = getWeatherIcon(item.weatherId);
            return (
              <div className="forecastRow" key={item.key}>
                <div>
                  <div className="rowDay">{item.day}</div>
                  <div className="rowDate">{item.date}</div>
                </div>
                <div className="rowCond">
                  <Icon size={34} color="var(--accent-2)" strokeWidth={1.8} />
                  <span>{item.condition}</span>
                </div>
                <div className="temps">
                  {item.min}&deg; <span style={{ color: "var(--muted)" }}>/</span> <span className="hi">{item.max}&deg;</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState title="Forecast unavailable" text="Search another city or check your API key if this stays empty." />
      )}
    </section>
  );

  const renderNearby = (buttonLabel = "Back", onButton = () => setActiveTab("overview")) => (
    <section className="panel pad below">
      <div className="sectionHead">
        <div>
          <div className="sectionTitle">Nearby Cities</div>
          <div className="sectionSub">Quick weather cards for nearby places.</div>
        </div>
        <button type="button" className="pill" onClick={onButton}>{buttonLabel}</button>
      </div>
      {nearby.length ? (
        <div className="cityGrid">
          {nearby.map((item) => (
            <CityCard
              key={item.key}
              item={item}
              active={favoriteKeys.has(item.key)}
              onFavorite={toggleFavorite}
              onOpen={() => loadCity(item.cityName)}
            />
          ))}
        </div>
      ) : (
        <EmptyState title="Nearby cities are loading" text="If nothing appears, search Delhi, Mumbai, Prayagraj, or London for curated nearby places." />
      )}
    </section>
  );

  const renderFavorites = () => (
    <section className="panel pad">
      <div className="sectionHead">
        <div>
          <div className="sectionTitle">Favorite Cities</div>
          <div className="sectionSub">Tap the heart on current weather or city cards to save them here.</div>
        </div>
        <button type="button" className="pill" onClick={() => setActiveTab("overview")}>Overview</button>
      </div>
      {favorites.length ? (
        <div className="cityGrid">
          {favorites.map((item) => (
            <CityCard
              key={item.key}
              item={item}
              active
              onFavorite={toggleFavorite}
              onOpen={() => loadCity(item.cityName)}
            />
          ))}
        </div>
      ) : (
        <EmptyState title="No favorites yet" text="Add a city with the heart button and it will stay here for quick access." />
      )}
    </section>
  );

  const renderMain = () => {
    if (!weather && loading) return <section className="panel"><LoadingState label="Fetching live weather..." /></section>;
    if (!weather && error) return <section className="panel"><EmptyState title="Weather failed to load" text={error} /></section>;
    if (!weather) return <section className="panel"><LoadingState label="Search for a city to begin." /></section>;

    if (activeTab === "forecast") {
      return <div className="tabGrid">{renderWeatherCard(true)}{renderForecast("Overview", () => setActiveTab("overview"))}</div>;
    }
    if (activeTab === "nearby") return renderNearby("Overview", () => setActiveTab("overview"));
    if (activeTab === "favorites") return renderFavorites();

    return (
      <>
        <div className="overview">
          {renderWeatherCard(false)}
          {renderForecast("View More", () => setActiveTab("forecast"))}
        </div>
        {renderNearby("View Nearby", () => setActiveTab("nearby"))}
      </>
    );
  };

  return (
    <div className={`app ${isDay ? "day" : "night"}`}>
      <style>{styles}</style>
      <div className="rain" />
      <div className="skyline" />
      <div className="shell">
        {sidebarOpen && (
          <aside className="sidebar">
            <div className="brand">
              <div className="brandMark"><CloudRain size={30} /></div>
              <div>
                <div className="brandTitle">Weathernix</div>
                <div className="brandSub">Smart Weather, Beautifully Simple</div>
              </div>
            </div>
            <nav className="nav" aria-label="Main navigation">
              {navItems.map(({ id, icon: Icon, label }) => (
                <button key={id} type="button" className={`navBtn ${activeTab === id ? "active" : ""}`} onClick={() => setActiveTab(id)}>
                  <Icon size={22} />
                  <span>{label}</span>
                </button>
              ))}
            </nav>
            <div className="sidebarTip">
              <div className="tipIcon">☂</div>
              <div className="tipTitle">Stay dry, stay awesome!</div>
              <div className="tipText">Check the weather before you head out.</div>
            </div>
          </aside>
        )}

        <main className="content">
          <header className="topbar">
            <div>
              <div className="greeting">Good Evening!</div>
              <div className="subtitle">Here's the latest weather update for you.</div>
            </div>
            <div className="topActions">
              <button type="button" className="theme" onClick={() => setTheme(isDay ? "night" : "day")} aria-label="Toggle day and night design">
                <Sun size={18} color={isDay ? "#f59e0b" : "var(--muted)"} />
                <span className="switch"><span className="knob" /></span>
                <Moon size={18} color={isDay ? "var(--muted)" : "var(--accent-2)"} />
              </button>
              <button type="button" className="roundBtn" onClick={locateUser} aria-label="Use current location">
                {locating ? <Loader2 className="spin" size={22} /> : <LocateFixed size={22} />}
              </button>
              <button type="button" className="roundBtn" onClick={() => setActiveTab("favorites")} aria-label="Open favorite cities">
                <Heart size={22} />
              </button>
              <button type="button" className="roundBtn" onClick={() => setSidebarOpen((open) => !open)} aria-label="Toggle menu">
                <Menu size={22} />
              </button>
            </div>
          </header>

          <form className="searchRow" onSubmit={handleSubmit}>
            <div className="searchField">
              <Search className="searchIcon" size={22} />
              <input className="searchInput" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search for a city..." />
            </div>
            <button type="submit" className="submitBtn" aria-label="Search weather">
              <ChevronRight size={30} />
            </button>
          </form>

          {error && <div className="notice">{error}</div>}
          {(loading || locating) && weather && <div className="notice info">Refreshing live weather...</div>}

          <div className="page">
            {renderMain()}
            <footer>© 2026 Weathernix. Ready for GitHub and Vercel deployment.</footer>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
