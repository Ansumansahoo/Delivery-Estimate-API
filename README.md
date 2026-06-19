# ⚡ SwiftETA v2.5 — India Delivery Estimator + B2B SDK

> A multi-level India shipping ETA engine for **D2C storefronts** and a full **B2B/Wholesale portal** with a drop-in SDK and REST API that suppliers can embed on their own storefront.

---

## 🗂️ Repository Structure

```
Delivery-Estimate-API/
├── index.html              — Vanilla HTML standalone demo (no build needed)
├── app.html                — Vite React entry point
├── package.json            — Vite + React + Tailwind project config
├── vite.config.js          — Vite build config (input: app.html)
├── tailwind.config.js      — Tailwind CSS config
├── .gitignore              — Standard excludes
├── LICENSE                 — MIT
├── src/
│   ├── App.jsx             — Main React app (D2C ETA simulator + tabs)
│   ├── B2BPortal.jsx       — B2B Wholesale portal (login-gated SDK & API)
│   ├── main.jsx            — React entry point (createRoot)
│   ├── index.css           — Tailwind directives + global resets
│   └── swifteta-sdk.js     — Standalone JS SDK (UMD — works anywhere)
├── python/                 — Pure-Python engine + FastAPI backend (see python/README.md)
│   ├── swifteta/           — Package: engine, carriers, api, cli
│   ├── examples/           — Sample CSV for batch testing
│   └── requirements.txt
└── README.md               — This file
```

---

## 🚀 Quick Start

### Option A — Open directly (no install)
```bash
# Just open index.html in any browser
open index.html
```

### Option B — Vite dev server
```bash
git clone https://github.com/Ansumansahoo/Delivery-Estimate-API.git
cd Delivery-Estimate-API
npm install
npm run dev        # → http://localhost:5173
```

### Option C — Production build
```bash
npm run build      # output → dist/
npm run preview    # preview the build locally
```

---

## 🏪 Part 1 — D2C ETA Simulator (`App.jsx`)

The main app for e-commerce teams to test and demonstrate shipping estimates.

| Feature | Description |
|---|---|
| Multi-level engine | L1 Shiprocket live API → L2 simulated carriers → L3 Haversine fallback |
| Real Shiprocket auth | Enter email + password to unlock live serviceability data |
| 3 free APIs | India Post Pincode, OSM Nominatim, Nager.Date holidays |
| 3 live UI views | Product page widget · Cart panel · Checkout summary |
| Zone Map | 6 zones (Local ≤50 km → Cross-country >1000 km) |
| Business-day ETA | Skips weekends + public holidays |
| Live log panel | Real-time engine activity feed |

---

## 🏢 Part 2 — B2B / Wholesale Portal (`B2BPortal.jsx`)

A separate portal for **suppliers, wholesalers and distributors** to estimate bulk shipping costs and embed the widget on their own storefront.

### Login Wall

All SDK credentials, API keys, and code snippets are **blurred and inaccessible** until the user signs in.

**Demo accounts (try now):**

| Email | Password | Company |
|---|---|---|
| supplier@demo.com | demo123 | Apex Wholesale Ltd. |
| retailer@demo.com | retail123 | RetailHub Pvt. Ltd. |
| wholesale@demo.com | bulk2026 | BulkMart Distributors |

### Portal Tabs

| Tab | Access | Description |
|---|---|---|
| ETA Calculator | Public | Bulk/single order estimate tool with quantity support |
| SDK Integration | Login required | Copy-paste widget snippet, NPM usage, API key |
| API Reference | Login required | Full REST endpoint docs with request/response examples |
| Analytics | Login required | Usage stats, quota bar, recent API call log |

---

## 📦 SDK Integration (`swifteta-sdk.js`)

> **Note — PLANNED specification.** `@swifteta/b2b-sdk` is not on npm yet. The SDK code (`src/swifteta-sdk.js`) documents the intended interface; it will call the real API once the backend (`python/` or a hosted service) is deployed.

A lightweight (~8 KB) UMD library. Works in browsers, Node/CommonJS, and ES modules.

### CDN embed (fastest)
```html
<script src="https://cdn.swifteta.in/sdk/v2/swifteta-b2b.min.js"></script>
<script>
  SwiftETA.init({
    apiKey:  'YOUR_API_KEY',   // from the B2B portal after login
    origin:  '560001',          // your warehouse pincode
    theme:   'auto',            // 'light' | 'dark' | 'auto'
  });

  // Drop-in widget — just point at any container
  SwiftETA.renderWidget('#shipping-estimator');
</script>

<div id="shipping-estimator"></div>
```

### NPM / React
```bash
npm install @swifteta/b2b-sdk
```

```jsx
import SwiftETA from '@swifteta/b2b-sdk';

SwiftETA.init({ apiKey: 'YOUR_API_KEY', origin: '560001' });

// In your component
const result = await SwiftETA.estimate({
  destination: '110001',
  weight_kg:   2.5,
  express:     false,
  cod:         true,
});
console.log(result.days_min, result.rate_inr);
```

### SDK Methods

| Method | Description |
|---|---|
| `SwiftETA.init(opts)` | Initialise with API key and warehouse origin |
| `SwiftETA.estimate(params)` | Single-order ETA + rate estimate |
| `SwiftETA.bulkEstimate(orders)` | Up to 100 orders in one call |
| `SwiftETA.checkServiceable(pin)` | Check if a pincode is covered |
| `SwiftETA.getUsage()` | Fetch account quota/usage stats |
| `SwiftETA.renderWidget(selector, opts)` | Render drop-in widget into any DOM element |

---

## 🌐 REST API Reference

> **Note — PLANNED specification.** The `https://api.swifteta.in` server does not exist yet. This section documents the intended contract so the SDK and any future backend implementation agree. See the `python/` directory for a local FastAPI reference implementation.

**Base URL:** `https://api.swifteta.in` *(planned)*

**Authentication:** All requests require:
```
Authorization: Bearer YOUR_API_KEY
```

### Endpoints

#### `POST /api/b2b/v1/estimate`
Single shipment ETA calculation.

```json
// Request
{
  "origin":      "560001",
  "destination": "110001",
  "weight_kg":   2.5,
  "express":     false,
  "cod":         true
}

// Response
{
  "status":      "serviceable",
  "days_min":    3,
  "days_max":    4,
  "rate_inr":    152,
  "carrier":     "Shiprocket Air",
  "zone":        "National",
  "distance_km": 1748,
  "cached":      false
}
```

#### `POST /api/b2b/v1/bulk-estimate`
Up to 100 orders in a single call.

```json
// Request
{
  "origin": "560001",
  "orders": [
    { "id": "ORD-001", "destination": "400001", "weight_kg": 1.2 },
    { "id": "ORD-002", "destination": "700001", "weight_kg": 3.0 }
  ]
}

// Response
{
  "results": [
    { "id": "ORD-001", "days_min": 4, "rate_inr": 99  },
    { "id": "ORD-002", "days_min": 5, "rate_inr": 138 }
  ],
  "processed": 2,
  "cached":    1
}
```

#### `GET /api/b2b/v1/serviceable?pin={pincode}`
Check serviceability without a full estimate.

#### `GET /api/b2b/v1/usage`
Current API quota and usage statistics.

### Error Codes

| Code | HTTP | Meaning |
|---|---|---|
| ERR_UNSERVICEABLE | 200 | Pincode not in coverage |
| ERR_INVALID_PIN | 400 | Malformed pincode |
| ERR_QUOTA | 429 | Rate limit exceeded |
| ERR_AUTH | 401 | Invalid/expired API key |
| ERR_SERVER | 500 | Internal error — retry |

### Rate Limits

| Plan | Limit |
|---|---|
| Starter | 200 req/min · 5,000/month |
| Pro | 1,000 req/min · 50,000/month |
| Enterprise | Unlimited |

---

## 🔌 API Keys — Where to Get Them

| Service | Free? | How |
|---|---|---|
| SwiftETA B2B | Portal login | Register → Login → Copy from SDK tab |
| Shiprocket | Free trial (500 shipments) | app.shiprocket.in |
| India Post Pincode | 100% free, no key | api.postalpincode.in |
| OSM Nominatim | 100% free, no key | nominatim.openstreetmap.org |
| Nager.Date Holidays | 100% free, no key | date.nager.at |
| NimbusPost | Free tier | nimbuspost.com → Dashboard → API |

---

## 🏗️ Architecture

```
User Input (origin PIN + destination PIN)
        │
        ├─► India Post API   → district / state lookup
        ├─► Nominatim API    → lat/lon geocoding
        │
        ▼
Haversine Distance → Zone (Z1 Local … Z6 Cross-Country)
        │
        ├─► L1  Shiprocket live API  (if credentials provided)
        ├─► L1s Simulated carriers   (Shiprocket / NimbusPost / Delhivery toggles)
        └─► L2  Rule-based Haversine fallback (when all APIs offline)
        │
        ▼
Business Days  (skip weekends + Nager.Date public holidays)
        │
        ▼
ETA Result  +  Courier Comparison  +  SDK embed snippet
```

---

## 📄 License

MIT — free to use, modify, and distribute.
