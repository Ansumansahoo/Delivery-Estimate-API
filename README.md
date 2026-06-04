# ⚡ SwiftETA v2.5 — India Delivery Estimator

A production-ready, multi-level India delivery ETA estimation engine built as a single-file frontend application.

## 🚀 Live Demo

Open `index.html` directly in any browser — no build step required.

## ✨ Features

- **Multi-level ETA Engine** — L1 (Live Shiprocket API) → L2 (Simulated carriers) → L3 (Haversine fallback)
- **Real Shiprocket Integration** — Authenticate with your credentials for live serviceability checks
- **5 Real/Free APIs** integrated:
  - 📮 India Post Pincode API (free, no key)
  - 🗺️ OpenStreetMap Nominatim geocoding (free, no key)
  - 📅 Nager.Date India public holidays (free, no key)
  - 🛡️ Shiprocket serviceability (free trial — 500 shipments)
  - 📦 NimbusPost (ready to wire, free tier)
- **Haversine distance** calculation for accurate zone assignment
- **Business-day ETA** that skips weekends and public holidays
- **6 Courier Comparison** view with best-price highlighting
- **Zone Map** — 6 delivery zones by distance (Local → Remote)
- **Live Log Panel** — real-time engine activity feed
- **Express Mode** — toggle for faster delivery estimates
- **COD toggle** with automatic surcharge

## 🔌 API Reference

| API | Cost | Key Required | Endpoint |
|-----|------|-------------|----------|
| India Post Pincode | FREE | No | `https://api.postalpincode.in/pincode/{PIN}` |
| OSM Nominatim | FREE | No | `https://nominatim.openstreetmap.org/search` |
| Nager.Date Holidays | FREE | No | `https://date.nager.at/api/v3/PublicHolidays/2026/IN` |
| Shiprocket | Free trial | Email + Password | `https://apiv2.shiprocket.in/v1/external/` |
| NimbusPost | Free tier | Token | `https://api.nimbuspost.com/v1/` |
| Delhivery | Partner/KYC | Token | Enterprise onboarding |

## 🛠️ Usage

1. Open `index.html` in a browser
2. Enter origin and destination pincodes
3. (Optional) Add Shiprocket credentials → click **Sync Real Shiprocket API**
4. Click **Calculate ETA** or press Enter
5. View results across 5 tabs: Results, Courier Comparison, Zone Map, Holidays, API Docs

## 🏗️ Architecture

```
User Input (Origin PIN + Dest PIN)
    │
    ├─► India Post API → District/State lookup
    ├─► Nominatim API  → lat/lon geocoding
    │
    ▼
Haversine Distance → Zone Classification (Z1-Z6)
    │
    ├─► L1: Shiprocket Live API (if authenticated)
    ├─► L2: NimbusPost / Delhivery simulation
    └─► L3: Pure Haversine fallback
    │
    ▼
Business Days (skip weekends + Nager.Date holidays)
    │
    ▼
ETA Result + Courier Comparison
```

## 📦 Zone Classification

| Zone | Distance | Business Days | Base Rate |
|------|----------|---------------|-----------|
| Z1 — Local | ≤50 km | 1 day | ₹35 |
| Z2 — Zonal | ≤200 km | 2 days | ₹50 |
| Z3 — Regional | ≤500 km | 3 days | ₹70 |
| Z4 — Metro | ≤1000 km | 4 days | ₹95 |
| Z5 — National | ≤2000 km | 5 days | ₹120 |
| Z6 — Remote | >2000 km | 7 days | ₹150 |

## 🔐 Shiprocket Setup

1. Register at [app.shiprocket.in](https://app.shiprocket.in)
2. In the sidebar, enter your email + password
3. Click **Sync Real Shiprocket API**
4. Token is fetched and stored in memory — real serviceability checks begin

## 📄 License

MIT — free to use and modify.
