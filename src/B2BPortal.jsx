/**
 * B2BPortal.jsx
 * SwiftETA v2.5 — B2B / Wholesale Shipping Estimator Portal
 *
 * Purpose : Suppliers & wholesalers can estimate shipping costs and
 *           delivery windows directly from this portal.  After login,
 *           they unlock the SDK snippet + REST API credentials they can
 *           embed on their own storefront.
 *
 * Sections
 *   1. Login Wall       — gate that hides SDK/API details
 *   2. ETA Calculator   — bulk / single-order estimate tool
 *   3. SDK Tab          — copy-paste JS snippet (blurred pre-login)
 *   4. API Tab          — REST endpoint reference  (blurred pre-login)
 *   5. Analytics Tab    — mock usage dashboard
 */

import React, { useState, useCallback } from 'react';
import {
  Lock, Unlock, Package, Truck, Code2, BarChart2,
  Copy, CheckCircle, AlertTriangle, LogOut, Building2,
  Zap, ShieldCheck, Eye, EyeOff, RefreshCw, ArrowRight,
  Globe, Key, Terminal, BookOpen, TrendingUp, Users
} from 'lucide-react';

// ─── Origin hub (same as main app) ───────────────────────────────────────────
const ORIGIN_PIN = '560001';

// ─── Mock B2B user accounts (replace with real auth in production) ────────────
const MOCK_USERS = {
  'supplier@demo.com':   { password: 'demo123',  name: 'Apex Wholesale Ltd.',    apiKey: 'sweta_live_b2b_4f8e2a1c9d',  plan: 'Pro',      calls: 12480 },
  'retailer@demo.com':   { password: 'retail123', name: 'RetailHub Pvt. Ltd.',   apiKey: 'sweta_live_b2b_7c3b5e8f2a',  plan: 'Starter',  calls: 3210  },
  'wholesale@demo.com':  { password: 'bulk2026',  name: 'BulkMart Distributors', apiKey: 'sweta_live_b2b_9a1d4c7e5b',  plan: 'Enterprise', calls: 98540 }
};

// ─── Haversine helper ─────────────────────────────────────────────────────────
const PINCODES = {
  '560001': { city: 'Bengaluru Central', state: 'Karnataka', lat: 12.9716, lng: 77.5946 },
  '560034': { city: 'Koramangala',       state: 'Karnataka', lat: 12.9338, lng: 77.6244 },
  '560066': { city: 'Whitefield',        state: 'Karnataka', lat: 12.9698, lng: 77.75   },
  '560100': { city: 'Electronic City',   state: 'Karnataka', lat: 12.8452, lng: 77.676  },
  '570001': { city: 'Mysuru',            state: 'Karnataka', lat: 12.3087, lng: 76.6547 },
  '575001': { city: 'Mangaluru',         state: 'Karnataka', lat: 12.9141, lng: 74.856  },
  '580001': { city: 'Hubballi',          state: 'Karnataka', lat: 15.3647, lng: 75.124  },
  '110001': { city: 'New Delhi',         state: 'Delhi',     lat: 28.6139, lng: 77.209  },
  '400001': { city: 'Mumbai',            state: 'Maharashtra', lat: 18.922, lng: 72.8347 },
  '600001': { city: 'Chennai',           state: 'Tamil Nadu',  lat: 13.0827, lng: 80.2707 },
  '700001': { city: 'Kolkata',           state: 'West Bengal', lat: 22.5726, lng: 88.3639 },
  '500001': { city: 'Hyderabad',         state: 'Telangana',   lat: 17.385,  lng: 78.4867 },
  '302001': { city: 'Jaipur',            state: 'Rajasthan',   lat: 26.9124, lng: 75.7873 },
  '799001': { city: 'Agartala',          state: 'Tripura',     lat: 23.8315, lng: 91.2868 },
};

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371, d2r = Math.PI / 180;
  const dLat = (lat2 - lat1) * d2r, dLon = (lon2 - lon1) * d2r;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*d2r)*Math.cos(lat2*d2r)*Math.sin(dLon/2)**2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

// ─── ETA engine ──────────────────────────────────────────────────────────────
function estimateETA(destPin, weightKg, isExpress, isCOD) {
  const orig = PINCODES[ORIGIN_PIN];
  const dest = PINCODES[destPin];
  if (!orig || !dest) return null;

  const km   = haversine(orig.lat, orig.lng, dest.lat, dest.lng);
  const zone = km <= 50 ? 1 : km <= 200 ? 2 : km <= 500 ? 3 : km <= 1000 ? 4 : 5;
  const zoneLabels = ['', 'Local', 'Zonal', 'Regional', 'National', 'Cross-Country'];
  const baseDays   = [0, 1, 2, 3, 4, 6][zone];
  const baseRate   = [0, 35, 55, 80, 110, 150][zone];
  const weightRate = Math.ceil(weightKg) * 12;
  const expressAdd = isExpress ? 80 : 0;
  const codAdd     = isCOD ? 30 : 0;
  const totalRate  = baseRate + weightRate + expressAdd + codAdd;
  const days       = isExpress ? Math.max(1, baseDays - 1) : baseDays;

  return { km, zone, zoneLabel: zoneLabels[zone], days, rate: totalRate, dest: dest.city, state: dest.state };
}

// ─── SDK code template (key is masked pre-login) ─────────────────────────────
const SDK_SNIPPET = (apiKey) => `<!-- SwiftETA B2B SDK — embed anywhere on your storefront -->
<script src="https://cdn.swifteta.in/sdk/v2/swifteta-b2b.min.js"></script>
<script>
  SwiftETA.init({
    apiKey:    '${apiKey}',   // Your live B2B API key
    origin:    '560001',       // Your warehouse pincode
    theme:     'light',        // 'light' | 'dark' | 'auto'
    currency:  'INR',
    onReady:   () => console.log('SwiftETA B2B ready'),
  });

  // Render estimator widget into any container
  SwiftETA.renderWidget('#shipping-estimator', {
    showCarrier:    true,
    showBreakdown:  true,
    expressToggle:  true,
  });

  // Or call the API directly in code
  const result = await SwiftETA.estimate({
    destination: '110001',
    weight_kg:   2.5,
    express:     false,
    cod:         true,
  });
  console.log(result.days, result.rate);
</script>

<!-- Target container -->
<div id="shipping-estimator"></div>`;

// ─── API reference endpoints ──────────────────────────────────────────────────
const API_ENDPOINTS = [
  {
    method: 'POST', path: '/api/b2b/v1/estimate',
    desc: 'Calculate shipping ETA and rate for a single order.',
    request: `{
  "origin":      "560001",
  "destination": "110001",
  "weight_kg":   2.5,
  "express":     false,
  "cod":         true
}`,
    response: `{
  "status":     "serviceable",
  "days_min":   3,
  "days_max":   4,
  "rate_inr":   152,
  "carrier":    "Shiprocket Air",
  "zone":       "National",
  "distance_km": 1748,
  "cached":     false
}`
  },
  {
    method: 'POST', path: '/api/b2b/v1/bulk-estimate',
    desc: 'Calculate ETA for up to 100 orders in a single call.',
    request: `{
  "origin": "560001",
  "orders": [
    { "id": "ORD-001", "destination": "400001", "weight_kg": 1.2 },
    { "id": "ORD-002", "destination": "700001", "weight_kg": 3.0 }
  ]
}`,
    response: `{
  "results": [
    { "id": "ORD-001", "days_min": 4, "rate_inr": 99  },
    { "id": "ORD-002", "days_min": 5, "rate_inr": 138 }
  ],
  "processed": 2,
  "cached":    1
}`
  },
  {
    method: 'GET', path: '/api/b2b/v1/serviceable?pin={pincode}',
    desc: 'Check if a pincode is serviceable and return zone info.',
    request: null,
    response: `{
  "pincode":     "110001",
  "serviceable": true,
  "zone":        "National",
  "distance_km": 1748,
  "city":        "New Delhi",
  "state":       "Delhi"
}`
  },
  {
    method: 'GET', path: '/api/b2b/v1/usage',
    desc: 'Fetch current API usage stats for your account.',
    request: null,
    response: `{
  "plan":          "Pro",
  "calls_used":    12480,
  "calls_limit":   50000,
  "reset_date":    "2026-07-01",
  "avg_latency_ms": 22
}`
  }
];

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Blurred overlay shown over SDK/API content pre-login */
function BlurGate({ children, locked }) {
  return (
    <div className="relative">
      <div className={locked ? 'blur-sm select-none pointer-events-none' : ''}>{children}</div>
      {locked && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-950/60 rounded-xl z-10">
          <Lock className="h-8 w-8 text-indigo-400" />
          <p className="text-sm font-semibold text-white">Login to unlock</p>
          <p className="text-xs text-slate-400">Access your API key, SDK snippet & credentials</p>
        </div>
      )}
    </div>
  );
}

/** Copy-to-clipboard button */
function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };
  return (
    <button onClick={copy} className="flex items-center gap-1.5 text-[10px] bg-slate-800 hover:bg-slate-700 px-2.5 py-1.5 rounded-lg text-slate-300 transition">
      {copied ? <CheckCircle className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}

/** Single REST endpoint card */
function EndpointCard({ ep, locked }) {
  const methodColor = ep.method === 'POST' ? 'bg-indigo-950 text-indigo-300' : 'bg-emerald-950 text-emerald-300';
  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
      <div className="flex items-center gap-2 flex-wrap">
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${methodColor}`}>{ep.method}</span>
        <code className="text-xs text-slate-200 font-mono">{ep.path}</code>
      </div>
      <p className="text-xs text-slate-400">{ep.desc}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {ep.request && (
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Request Body</span>
              {!locked && <CopyBtn text={ep.request} />}
            </div>
            <BlurGate locked={locked}>
              <pre className="text-[10px] font-mono text-slate-300 bg-slate-900 p-3 rounded-lg border border-slate-800 overflow-x-auto">{ep.request}</pre>
            </BlurGate>
          </div>
        )}
        <div className={ep.request ? '' : 'md:col-span-2'}>
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] text-slate-500 uppercase font-bold">Response</span>
            {!locked && <CopyBtn text={ep.response} />}
          </div>
          <BlurGate locked={locked}>
            <pre className="text-[10px] font-mono text-slate-300 bg-slate-900 p-3 rounded-lg border border-slate-800 overflow-x-auto">{ep.response}</pre>
          </BlurGate>
        </div>
      </div>
    </div>
  );
}

// ─── Login Panel ──────────────────────────────────────────────────────────────
function LoginPanel({ onLogin }) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    // Simulate network latency
    await new Promise(r => setTimeout(r, 800));
    const user = MOCK_USERS[email.toLowerCase()];
    if (user && user.password === password) {
      onLogin({ email: email.toLowerCase(), ...user });
    } else {
      setError('Invalid credentials. Try supplier@demo.com / demo123');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-indigo-600/20 rounded-2xl border border-indigo-500/30 mb-4">
            <Building2 className="h-8 w-8 text-indigo-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">SwiftETA B2B Portal</h2>
          <p className="text-slate-400 text-sm mt-2">Sign in to access your shipping SDK, API keys & bulk estimator</p>
        </div>

        {/* Demo hint */}
        <div className="bg-indigo-950/40 border border-indigo-800/50 rounded-xl p-3 mb-6 text-xs text-indigo-300 space-y-1">
          <p className="font-semibold text-indigo-200">Demo Accounts</p>
          <p>supplier@demo.com / <span className="font-mono">demo123</span></p>
          <p>wholesale@demo.com / <span className="font-mono">bulk2026</span></p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 font-medium">Business Email</label>
            <input
              type="email" required value={email} onChange={e => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 font-medium">Password</label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 pr-11 text-sm text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition"
              />
              <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-3 text-slate-500 hover:text-slate-300">
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-rose-950/30 border border-rose-800/50 rounded-lg p-3 text-xs text-rose-300 flex items-center gap-2">
              <AlertTriangle className="h-3.5 w-3.5 shrink-0" /> {error}
            </div>
          )}

          <button type="submit" disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 transition py-3 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2">
            {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Unlock className="h-4 w-4" />}
            {loading ? 'Authenticating…' : 'Sign In to Portal'}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 mt-6">
          Don't have an account?{' '}
          <a href="mailto:sales@swifteta.in" className="text-indigo-400 hover:underline">Contact sales →</a>
        </p>
      </div>
    </div>
  );
}

// ─── ETA Calculator Tab ───────────────────────────────────────────────────────
function ETACalculator() {
  const [pin, setPin]         = useState('110001');
  const [weight, setWeight]   = useState(2.5);
  const [express, setExpress] = useState(false);
  const [cod, setCod]         = useState(false);
  const [result, setResult]   = useState(null);
  const [qty, setQty]         = useState(1);

  const calculate = useCallback(() => {
    const r = estimateETA(pin, weight * qty, express, cod);
    setResult(r);
  }, [pin, weight, express, cod, qty]);

  const pincodeList = Object.entries(PINCODES).filter(([p]) => p !== ORIGIN_PIN);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input panel */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Package className="h-4 w-4 text-indigo-400" /> Shipment Details
          </h3>

          <div>
            <label className="text-xs text-slate-400 block mb-1">Destination Pincode</label>
            <select value={pin} onChange={e => setPin(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-200 outline-none focus:border-indigo-500">
              {pincodeList.map(([p, d]) => (
                <option key={p} value={p}>{p} — {d.city}, {d.state}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Weight per unit (kg)</label>
              <input type="number" min="0.1" step="0.1" value={weight} onChange={e => setWeight(parseFloat(e.target.value)||0.5)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-200 outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Quantity / Units</label>
              <input type="number" min="1" step="1" value={qty} onChange={e => setQty(parseInt(e.target.value)||1)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-200 outline-none focus:border-indigo-500" />
            </div>
          </div>

          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={express} onChange={e => setExpress(e.target.checked)}
                className="rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-indigo-500" />
              <span className="text-xs text-slate-300">Express Shipping</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={cod} onChange={e => setCod(e.target.checked)}
                className="rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-indigo-500" />
              <span className="text-xs text-slate-300">Cash on Delivery</span>
            </label>
          </div>

          <button onClick={calculate}
            className="w-full bg-indigo-600 hover:bg-indigo-500 transition py-3 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2">
            <Zap className="h-4 w-4" /> Calculate Bulk ETA
          </button>
        </div>

        {/* Result panel */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
            <Truck className="h-4 w-4 text-indigo-400" /> Estimate Result
          </h3>
          {result ? (
            <div className="space-y-3">
              <div className="bg-slate-950 rounded-xl p-4 text-center border border-indigo-500/30">
                <div className="text-4xl font-black text-white font-mono">{result.days}</div>
                <div className="text-xs text-slate-400 mt-1">Business Day{result.days !== 1 ? 's' : ''}</div>
                <div className="text-sm font-bold text-indigo-400 mt-2">{result.dest}, {result.state}</div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  ['Zone',     result.zoneLabel],
                  ['Distance', `${result.km} km`],
                  ['Units',    qty],
                  ['Total Wt', `${(weight*qty).toFixed(1)} kg`],
                  ['Rate/Unit', `₹${result.rate}`],
                  ['Total Cost', `₹${result.rate * qty}`],
                ].map(([k, v]) => (
                  <div key={k} className="bg-slate-950 rounded-lg p-2.5 border border-slate-800">
                    <div className="text-slate-500 text-[10px] uppercase">{k}</div>
                    <div className="text-white font-semibold mt-0.5">{v}</div>
                  </div>
                ))}
              </div>
              {express && <p className="text-[10px] text-amber-400">⚡ Express surcharge (₹80/unit) included</p>}
              {cod     && <p className="text-[10px] text-slate-400">💵 COD surcharge (₹30/unit) included</p>}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-slate-500 text-sm border border-dashed border-slate-800 rounded-xl">
              <Package className="h-8 w-8 mb-2 opacity-30" />
              Fill details and click Calculate
            </div>
          )}
        </div>
      </div>

      {/* Bulk preview table */}
      {result && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <h3 className="text-sm font-bold text-white mb-4">📦 Bulk Order Breakdown</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-slate-500 border-b border-slate-800">
                  {['#', 'Destination', 'Weight', 'Zone', 'Days', 'Rate', 'Shipping Type'].map(h => (
                    <th key={h} className="text-left py-2 pr-4 font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: Math.min(qty, 5) }, (_, i) => (
                  <tr key={i} className="border-b border-slate-800/50 text-slate-300">
                    <td className="py-2 pr-4 font-mono text-slate-500">ORD-{String(i+1).padStart(3,'0')}</td>
                    <td className="py-2 pr-4">{result.dest}</td>
                    <td className="py-2 pr-4">{weight} kg</td>
                    <td className="py-2 pr-4">{result.zoneLabel}</td>
                    <td className="py-2 pr-4 font-bold text-white">{result.days}d</td>
                    <td className="py-2 pr-4 text-indigo-400 font-bold">₹{result.rate}</td>
                    <td className="py-2 pr-4">{express ? 'Express Air' : 'Standard Surface'}</td>
                  </tr>
                ))}
                {qty > 5 && (
                  <tr className="text-slate-500 text-center">
                    <td colSpan={7} className="py-2">… and {qty - 5} more identical orders</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SDK Tab ──────────────────────────────────────────────────────────────────
function SDKTab({ user }) {
  const locked  = !user;
  const apiKey  = user ? user.apiKey : 'sweta_live_b2b_••••••••••••••••';
  const snippet = SDK_SNIPPET(apiKey);

  return (
    <div className="space-y-6">
      {/* Key card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
          <Key className="h-4 w-4 text-indigo-400" /> Your API Credentials
        </h3>
        <BlurGate locked={locked}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-950 rounded-xl p-3 border border-slate-800">
              <div className="text-slate-500 text-[10px] uppercase mb-1">Live API Key</div>
              <code className="text-indigo-300 font-mono break-all">{apiKey}</code>
            </div>
            <div className="bg-slate-950 rounded-xl p-3 border border-slate-800">
              <div className="text-slate-500 text-[10px] uppercase mb-1">Plan</div>
              <div className="text-white font-bold">{user?.plan || 'Pro'}</div>
            </div>
            <div className="bg-slate-950 rounded-xl p-3 border border-slate-800">
              <div className="text-slate-500 text-[10px] uppercase mb-1">API Calls Used</div>
              <div className="text-white font-bold font-mono">{(user?.calls || 0).toLocaleString()}</div>
            </div>
          </div>
        </BlurGate>
      </div>

      {/* Installation steps */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-5">
          <Terminal className="h-4 w-4 text-indigo-400" /> Quick Start — 3 Steps
        </h3>
        <div className="space-y-4">
          {[
            {
              step: '1', title: 'Include the SDK',
              code: `<script src="https://cdn.swifteta.in/sdk/v2/swifteta-b2b.min.js"></script>`,
              desc: 'Add this tag before </body> on any storefront page.'
            },
            {
              step: '2', title: 'Initialise with your API key',
              code: `SwiftETA.init({ apiKey: '${apiKey}', origin: '560001' });`,
              desc: 'Call once on page load. Origin is your warehouse pincode.'
            },
            {
              step: '3', title: 'Render the widget or call the API',
              code: `SwiftETA.renderWidget('#shipping-box');`,
              desc: 'Drop a <div id="shipping-box"> anywhere — the widget auto-renders.'
            }
          ].map(({ step, title, code, desc }) => (
            <div key={step} className="flex gap-4">
              <div className="w-7 h-7 rounded-full bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-xs font-bold text-indigo-400 shrink-0">{step}</div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-white mb-1">{title}</div>
                <p className="text-xs text-slate-400 mb-2">{desc}</p>
                <BlurGate locked={locked}>
                  <div className="flex justify-between items-start bg-slate-950 rounded-lg border border-slate-800 p-3 gap-3">
                    <code className="text-[11px] font-mono text-slate-300 break-all flex-1">{code}</code>
                    {!locked && <CopyBtn text={code} />}
                  </div>
                </BlurGate>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full snippet */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Code2 className="h-4 w-4 text-indigo-400" /> Full Embed Snippet
          </h3>
          {!locked && <CopyBtn text={snippet} />}
        </div>
        <BlurGate locked={locked}>
          <pre className="text-[11px] font-mono text-slate-300 bg-slate-950 border border-slate-800 rounded-xl p-5 overflow-x-auto max-h-80 overflow-y-auto">
            {snippet}
          </pre>
        </BlurGate>
      </div>

      {/* NPM install */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
          <Package className="h-4 w-4 text-indigo-400" /> NPM / React Integration
        </h3>
        <div className="space-y-3 text-xs">
          <div className="bg-slate-950 rounded-xl border border-slate-800 p-3">
            <div className="text-slate-500 text-[10px] uppercase mb-2">Install</div>
            <code className="text-slate-300 font-mono">npm install @swifteta/b2b-sdk</code>
          </div>
          <BlurGate locked={locked}>
            <div className="bg-slate-950 rounded-xl border border-slate-800 p-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-500 text-[10px] uppercase">React Usage</span>
                {!locked && <CopyBtn text={`import { useSwiftETA } from '@swifteta/b2b-sdk';\n\nexport default function ProductPage() {\n  const { estimate, loading } = useSwiftETA({ apiKey: '${apiKey}' });\n  return <SwiftETAWidget onEstimate={estimate} />;\n}`} />}
              </div>
              <pre className="text-[11px] font-mono text-slate-300 overflow-x-auto">{`import { useSwiftETA } from '@swifteta/b2b-sdk';

export default function ProductPage() {
  const { estimate, loading } = useSwiftETA({
    apiKey: '${apiKey}'
  });
  return <SwiftETAWidget onEstimate={estimate} />;
}`}</pre>
            </div>
          </BlurGate>
        </div>
      </div>
    </div>
  );
}

// ─── API Reference Tab ────────────────────────────────────────────────────────
function APITab({ user }) {
  const locked = !user;
  return (
    <div className="space-y-6">
      {/* Base URL */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
          <Globe className="h-4 w-4 text-indigo-400" /> Base URL & Authentication
        </h3>
        <div className="space-y-3 text-xs">
          <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 flex justify-between items-center">
            <div>
              <div className="text-slate-500 text-[10px] uppercase mb-1">Production Base URL</div>
              <code className="text-slate-200 font-mono">https://api.swifteta.in</code>
            </div>
            <CopyBtn text="https://api.swifteta.in" />
          </div>
          <BlurGate locked={locked}>
            <div className="bg-slate-950 rounded-xl p-3 border border-slate-800">
              <div className="text-slate-500 text-[10px] uppercase mb-2">Auth Header (all requests)</div>
              <code className="text-slate-300 font-mono">Authorization: Bearer {user?.apiKey || 'YOUR_API_KEY'}</code>
            </div>
          </BlurGate>
          <div className="bg-indigo-950/30 border border-indigo-900/50 rounded-xl p-3 text-indigo-300">
            All endpoints use HTTPS. Rate limit: <strong>1000 req/min</strong> (Pro), 200 req/min (Starter).
          </div>
        </div>
      </div>

      {/* Endpoints */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-5">
          <BookOpen className="h-4 w-4 text-indigo-400" /> Endpoint Reference
        </h3>
        <div className="space-y-4">
          {API_ENDPOINTS.map((ep, i) => <EndpointCard key={i} ep={ep} locked={locked} />)}
        </div>
      </div>

      {/* Error codes */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <h3 className="text-sm font-bold text-white mb-4">⚠️ Error Codes</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead><tr className="text-slate-500 border-b border-slate-800">
              {['Code','HTTP','Meaning','Resolution'].map(h => <th key={h} className="text-left py-2 pr-4">{h}</th>)}
            </tr></thead>
            <tbody>
              {[
                ['ERR_UNSERVICEABLE','200','Pincode not in coverage network','Check /serviceable endpoint first'],
                ['ERR_INVALID_PIN','400','Malformed 6-digit pincode','Validate client-side before calling'],
                ['ERR_QUOTA','429','Rate limit or quota exceeded','Upgrade plan or add retry logic'],
                ['ERR_AUTH','401','Invalid or expired API key','Regenerate key from portal'],
                ['ERR_SERVER','500','Internal error','Retry with exponential backoff'],
              ].map(([code,http,msg,fix]) => (
                <tr key={code} className="border-b border-slate-800/50 text-slate-300">
                  <td className="py-2 pr-4 font-mono text-rose-400">{code}</td>
                  <td className="py-2 pr-4 font-mono text-slate-400">{http}</td>
                  <td className="py-2 pr-4">{msg}</td>
                  <td className="py-2 pr-4 text-slate-400">{fix}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Analytics Tab ────────────────────────────────────────────────────────────
function AnalyticsTab({ user }) {
  if (!user) return (
    <div className="flex flex-col items-center justify-center py-20 text-slate-500">
      <Lock className="h-8 w-8 mb-3" />
      <p className="text-sm font-medium">Login to view your usage analytics</p>
    </div>
  );

  const planLimits = { Starter: 5000, Pro: 50000, Enterprise: 999999 };
  const limit = planLimits[user.plan] || 50000;
  const pct   = Math.min(100, Math.round((user.calls / limit) * 100));

  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'API Calls Used',    value: user.calls.toLocaleString(),   sub: `of ${limit.toLocaleString()}`, color: 'text-white'        },
          { label: 'Plan',             value: user.plan,                      sub: 'Current tier',       color: 'text-indigo-400'    },
          { label: 'Avg Latency',      value: '22ms',                         sub: 'Cached: 8ms',        color: 'text-emerald-400'   },
          { label: 'Quota Used',       value: `${pct}%`,                      sub: 'Reset monthly',      color: pct > 80 ? 'text-rose-400' : 'text-amber-400' },
        ].map(({ label, value, sub, color }) => (
          <div key={label} className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <div className="text-slate-500 text-[10px] uppercase font-bold mb-1">{label}</div>
            <div className={`text-2xl font-black font-mono ${color}`}>{value}</div>
            <div className="text-slate-500 text-[10px] mt-1">{sub}</div>
          </div>
        ))}
      </div>

      {/* Quota bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-bold text-white">Monthly Quota Usage</h3>
          <span className="text-xs text-slate-400">{user.calls.toLocaleString()} / {limit.toLocaleString()} calls</span>
        </div>
        <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${pct > 80 ? 'bg-rose-500' : pct > 50 ? 'bg-amber-500' : 'bg-indigo-500'}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-[10px] text-slate-500">
          <span>0</span><span>{pct}% used</span><span>{limit.toLocaleString()}</span>
        </div>
      </div>

      {/* Mock recent calls */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <h3 className="text-sm font-bold text-white mb-4">Recent API Calls (Last 24h)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead><tr className="text-slate-500 border-b border-slate-800">
              {['Time','Endpoint','Status','Latency','Destination'].map(h => <th key={h} className="text-left py-2 pr-4">{h}</th>)}
            </tr></thead>
            <tbody>
              {[
                ['09:41:22','/b2b/v1/estimate',    '200 OK', '18ms', '110001 — Delhi'],
                ['09:38:05','/b2b/v1/bulk-estimate','200 OK', '64ms', '400001 — Mumbai (×8)'],
                ['09:31:47','/b2b/v1/serviceable', '200 OK', '9ms',  '700001 — Kolkata'],
                ['09:28:12','/b2b/v1/estimate',    '200 OK', '21ms', '560066 — Whitefield'],
                ['09:15:03','/b2b/v1/estimate',    '429 ERR','—',    '—'],
              ].map(([t,ep,st,lat,dest],i) => (
                <tr key={i} className="border-b border-slate-800/50 text-slate-300">
                  <td className="py-2 pr-4 font-mono text-slate-500">{t}</td>
                  <td className="py-2 pr-4 font-mono text-indigo-400">{ep}</td>
                  <td className={`py-2 pr-4 font-mono ${st.startsWith('2') ? 'text-emerald-400' : 'text-rose-400'}`}>{st}</td>
                  <td className="py-2 pr-4">{lat}</td>
                  <td className="py-2 pr-4">{dest}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Main B2B Portal export ───────────────────────────────────────────────────
export default function B2BPortal() {
  const [user, setUser]   = useState(null);   // null = not logged in
  const [tab,  setTab]    = useState('calc');  // calc | sdk | api | analytics

  const TABS = [
    { id: 'calc',      label: 'ETA Calculator',  icon: <Package     className="h-3.5 w-3.5" />, public: true  },
    { id: 'sdk',       label: 'SDK Integration', icon: <Code2       className="h-3.5 w-3.5" />, public: false },
    { id: 'api',       label: 'API Reference',   icon: <Terminal    className="h-3.5 w-3.5" />, public: false },
    { id: 'analytics', label: 'Analytics',       icon: <BarChart2   className="h-3.5 w-3.5" />, public: false },
  ];

  if (!user) return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Portal header */}
      <div className="border-b border-slate-800 bg-slate-900 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600/20 rounded-xl border border-indigo-500/30">
            <Building2 className="h-5 w-5 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white">SwiftETA B2B Portal</h1>
            <p className="text-[10px] text-slate-400">Wholesale & Supplier Shipping Platform</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="h-4 w-4 text-emerald-500" /> Secure Login Required
        </div>
      </div>
      <LoginPanel onLogin={setUser} />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Portal header (logged in) */}
      <div className="border-b border-slate-800 bg-slate-900 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600/20 rounded-xl border border-indigo-500/30">
            <Building2 className="h-5 w-5 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white">SwiftETA B2B Portal</h1>
            <p className="text-[10px] text-slate-400">{user.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] bg-indigo-950 border border-indigo-800 text-indigo-300 px-2.5 py-1 rounded-lg font-semibold">{user.plan} Plan</span>
          <span className="text-xs text-slate-400">{user.email}</span>
          <button onClick={() => setUser(null)} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition">
            <LogOut className="h-3.5 w-3.5" /> Logout
          </button>
        </div>
      </div>

      {/* Welcome banner */}
      <div className="bg-indigo-950/30 border-b border-indigo-900/40 px-6 py-3 flex items-center gap-3 text-xs text-indigo-300">
        <ShieldCheck className="h-4 w-4 text-emerald-400" />
        <span>Welcome back, <strong className="text-white">{user.name}</strong> — Your API key, SDK snippet and usage analytics are now unlocked.</span>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-800 bg-slate-900/60 px-6">
        <div className="flex gap-1 pt-2">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-all border-b-2 ${
                tab === t.id
                  ? 'border-indigo-500 text-white bg-slate-800'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}>
              {t.icon}
              {t.label}
              {!t.public && !user && <Lock className="h-2.5 w-2.5 text-slate-500" />}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="max-w-5xl mx-auto p-6">
        {tab === 'calc'      && <ETACalculator />}
        {tab === 'sdk'       && <SDKTab user={user} />}
        {tab === 'api'       && <APITab user={user} />}
        {tab === 'analytics' && <AnalyticsTab user={user} />}
      </div>
    </div>
  );
}
