/**
 * B2BPortal.jsx
 * SwiftETA v2.5 — B2B / Wholesale Shipping Estimator Portal
 *
 * Complete implementation: Login wall, ETA Calculator, SDK tab,
 * API reference tab, and Analytics tab.
 *
 * Phase 0 fix: was a 40-line stub with no export — now a full component.
 * Phase 1 fix: API keys use sweta_demo_ prefix (not live_) to avoid
 *              implying production credentials are in source code.
 */

import React, { useState, useCallback } from 'react';
import {
  Lock, Package, Truck, Code2, BarChart2,
  Copy, CheckCircle, AlertTriangle, LogOut, Building2,
  Zap, ShieldCheck, Eye, EyeOff, RefreshCw,
  Globe, Key, Terminal, TrendingUp, Users
} from 'lucide-react';

const ORIGIN_PIN = '560001';

// NOTE: Demo credentials only. sweta_demo_ keys are not valid in production.
const MOCK_USERS = {
  'supplier@demo.com':  { password: 'demo123',  name: 'Apex Wholesale Ltd.',    apiKey: 'sweta_demo_b2b_4f8e2a1c9d', plan: 'Pro',        calls: 12480 },
  'retailer@demo.com':  { password: 'retail123', name: 'RetailHub Pvt. Ltd.',    apiKey: 'sweta_demo_b2b_7c3b5e8f2a', plan: 'Starter',     calls: 3210  },
  'wholesale@demo.com': { password: 'bulk2026',  name: 'BulkMart Distributors',  apiKey: 'sweta_demo_b2b_9a1d4c7e5b', plan: 'Enterprise',  calls: 98540 },
};

function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371, d2r = Math.PI / 180;
  const dLat = (lat2 - lat1) * d2r, dLon = (lon2 - lon1) * d2r;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * d2r) * Math.cos(lat2 * d2r) * Math.sin(dLon / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

const PIN_DB = {
  '560001': { city: 'Bengaluru (Central)',    lat: 12.9716, lng: 77.5946 },
  '560066': { city: 'Bengaluru (Whitefield)', lat: 12.9698, lng: 77.75   },
  '110001': { city: 'New Delhi',              lat: 28.6139, lng: 77.209  },
  '400001': { city: 'Mumbai',                 lat: 18.922,  lng: 72.8347 },
  '700001': { city: 'Kolkata',                lat: 22.5726, lng: 88.3639 },
  '600001': { city: 'Chennai',                lat: 13.0827, lng: 80.2707 },
  '500001': { city: 'Hyderabad',              lat: 17.385,  lng: 78.4867 },
  '302001': { city: 'Jaipur',                 lat: 26.9124, lng: 75.7873 },
  '570001': { city: 'Mysuru',                 lat: 12.3087, lng: 76.6547 },
  '799001': { city: 'Agartala (NE/Remote)',   lat: 23.8315, lng: 91.2868 },
};

function calcRate(distKm, weightKg) {
  let f = distKm <= 50 ? 1.0 : distKm <= 200 ? 1.2 : distKm <= 500 ? 1.5 : distKm <= 1000 ? 1.8 : 2.3;
  return Math.round((35 + weightKg * 20) * f);
}

function calcDays(distKm) {
  return distKm <= 50 ? 1 : distKm <= 200 ? 2 : distKm <= 500 ? 3 : distKm <= 1000 ? 4 : 5;
}

function sdkSnippet(apiKey) {
  return `<!-- SwiftETA B2B SDK v2.5 -->
<script src="https://cdn.swifteta.in/sdk/v2/swifteta.min.js"></` + `script>
<script>
  SwiftETA.init({ apiKey: '${apiKey}', origin: '560001', container: '#eta-widget' });
</` + `script>
<div id="eta-widget"></div>`;
}

export default function B2BPortal({ embedded = false }) {
  const [user, setUser]             = useState(null);
  const [email, setEmail]           = useState('');
  const [pass, setPass]             = useState('');
  const [showPass, setShowPass]     = useState(false);
  const [loginErr, setLoginErr]     = useState('');
  const [tab, setTab]               = useState('calculator');
  const [destPin, setDestPin]       = useState('110001');
  const [weight, setWeight]         = useState(0.5);
  const [result, setResult]         = useState(null);
  const [loading, setLoading]       = useState(false);
  const [copied, setCopied]         = useState(false);

  const handleLogin = useCallback((e) => {
    e.preventDefault();
    const found = MOCK_USERS[email.trim().toLowerCase()];
    if (found && found.password === pass) {
      setUser({ email: email.trim().toLowerCase(), ...found });
      setLoginErr('');
    } else {
      setLoginErr('Invalid credentials. Try supplier@demo.com / demo123');
    }
  }, [email, pass]);

  const runCalc = useCallback(() => {
    const dest = PIN_DB[destPin];
    if (!dest) { setResult({ error: 'Pincode not in demo DB.' }); return; }
    const origin = PIN_DB[ORIGIN_PIN];
    setLoading(true);
    setTimeout(() => {
      const dist = haversineKm(origin.lat, origin.lng, dest.lat, dest.lng);
      setResult({ dist, days: calcDays(dist), rate: calcRate(dist, weight), city: dest.city });
      setLoading(false);
    }, 600);
  }, [destPin, weight]);

  const handleCopy = () => {
    if (!user) return;
    navigator.clipboard.writeText(sdkSnippet(user.apiKey)).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 2000);
    });
  };

  if (!user) {
    return (
      <div className={`${embedded ? '' : 'min-h-screen bg-slate-950'} flex items-center justify-center p-6`}>
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-indigo-600 rounded-xl"><Building2 className="h-6 w-6 text-white" /></div>
            <div>
              <h2 className="text-xl font-bold text-white">B2B Supplier Portal</h2>
              <p className="text-xs text-slate-400">SwiftETA v2.5 — SDK and API Access</p>
            </div>
          </div>
          <div className="bg-indigo-950/40 border border-indigo-900/50 rounded-xl p-3 mb-6 text-xs text-indigo-300">
            <strong>Demo:</strong> supplier@demo.com / demo123
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="supplier@demo.com"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Password</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} value={pass} onChange={e => setPass(e.target.value)} placeholder="demo123"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 pr-10 text-sm text-slate-100 placeholder-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none" required />
                <button type="button" onClick={() => setShowPass(v => !v)} className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300">
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            {loginErr && (
              <div className="flex items-center gap-2 text-rose-400 text-xs bg-rose-950/30 border border-rose-900/50 p-2.5 rounded-lg">
                <AlertTriangle className="h-3.5 w-3.5 shrink-0" />{loginErr}
              </div>
            )}
            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 transition py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2">
              <Lock className="h-4 w-4" /> Sign In to Portal
            </button>
          </form>
          <div className="mt-5 pt-4 border-t border-slate-800 space-y-2">
            <p className="text-[10px] text-slate-500 text-center uppercase tracking-wider">Quick Login</p>
            {Object.entries(MOCK_USERS).map(([e, u]) => (
              <button key={e} onClick={() => { setEmail(e); setPass(u.password); }}
                className="w-full text-left p-2.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 transition text-xs flex justify-between items-center">
                <span className="text-slate-300">{e}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${u.plan==='Enterprise'?'bg-amber-950 text-amber-400':u.plan==='Pro'?'bg-indigo-950 text-indigo-400':'bg-slate-800 text-slate-400'}`}>{u.plan}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const TABS = [
    { id: 'calculator', label: 'ETA Calculator', Icon: Truck },
    { id: 'sdk',        label: 'SDK Snippet',    Icon: Code2 },
    { id: 'api',        label: 'API Reference',  Icon: Terminal },
    { id: 'analytics',  label: 'Analytics',      Icon: BarChart2 },
  ];

  return (
    <div className={`${embedded ? '' : 'min-h-screen bg-slate-950'} text-slate-100`}>
      {!embedded && (
        <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-xl"><Building2 className="h-5 w-5 text-white" /></div>
            <div><h1 className="text-lg font-bold text-white">B2B Supplier Portal</h1><p className="text-xs text-slate-400">SwiftETA v2.5</p></div>
          </div>
          <button onClick={() => setUser(null)} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition">
            <LogOut className="h-3.5 w-3.5" /> Sign Out
          </button>
        </header>
      )}
      <div className="max-w-5xl mx-auto p-4 md:p-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center font-bold text-indigo-400">{user.name[0]}</div>
            <div><p className="text-sm font-semibold text-white">{user.name}</p><p className="text-xs text-slate-400">{user.email}</p></div>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="text-center"><span className="text-slate-500 block text-[10px] uppercase">Plan</span><span className={`font-bold ${user.plan==='Enterprise'?'text-amber-400':user.plan==='Pro'?'text-indigo-400':'text-slate-300'}`}>{user.plan}</span></div>
            <div className="text-center"><span className="text-slate-500 block text-[10px] uppercase">Calls</span><span className="font-bold text-white">{user.calls.toLocaleString()}</span></div>
            {embedded && <button onClick={() => setUser(null)} className="text-slate-400 hover:text-white ml-1"><LogOut className="h-3.5 w-3.5" /></button>}
          </div>
        </div>

        <div className="bg-slate-900 border border-indigo-900/40 rounded-2xl p-4 mb-5">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2"><Key className="h-4 w-4 text-indigo-400" /><span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">API Key</span></div>
            <span className="text-[10px] bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded font-mono">Demo</span>
          </div>
          <div className="flex items-center gap-2">
            <code className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-indigo-300 truncate">{user.apiKey}</code>
            <button onClick={() => navigator.clipboard.writeText(user.apiKey)} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition text-slate-400 hover:text-white"><Copy className="h-3.5 w-3.5" /></button>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl mb-5 overflow-x-auto">
          {TABS.map(({ id, label, Icon }) => (
            <button key={id} onClick={() => setTab(id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${tab===id?'bg-indigo-600 text-white shadow-md':'text-slate-400 hover:text-slate-200'}`}>
              <Icon className="h-3.5 w-3.5" />{label}
            </button>
          ))}
        </div>

        {tab === 'calculator' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-4"><Package className="h-4 w-4 text-indigo-400" />Shipment Parameters</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Destination Pincode</label>
                  <select value={destPin} onChange={e => setDestPin(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500">
                    {Object.entries(PIN_DB).filter(([p]) => p !== ORIGIN_PIN).map(([p, d]) => (
                      <option key={p} value={p}>{p} — {d.city}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Weight (kg)</label>
                  <input type="number" min="0.1" max="50" step="0.1" value={weight} onChange={e => setWeight(parseFloat(e.target.value)||0.5)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-400">
                  <span className="font-semibold text-slate-300">Origin:</span> Bengaluru Hub (560001)
                </div>
                <button onClick={runCalc} disabled={loading}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 transition py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-50">
                  {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
                  {loading ? 'Calculating…' : 'Get Bulk Estimate'}
                </button>
              </div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-4"><Truck className="h-4 w-4 text-indigo-400" />Estimate Result</h3>
              {result ? (
                result.error ? <div className="text-rose-400 text-sm">{result.error}</div> : (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
                        <span className="text-slate-400 text-[10px] uppercase block">ETA</span>
                        <strong className="text-3xl text-indigo-400 font-mono block mt-1">{result.days}</strong>
                        <span className="text-xs text-slate-400">Business Days</span>
                      </div>
                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
                        <span className="text-slate-400 text-[10px] uppercase block">Rate</span>
                        <strong className="text-3xl text-emerald-400 font-mono block mt-1">₹{result.rate}</strong>
                        <span className="text-xs text-slate-400">Per Shipment</span>
                      </div>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5 text-xs">
                      <div className="flex justify-between"><span className="text-slate-400">Destination</span><span className="text-white font-semibold">{result.city}</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">Distance</span><span className="text-white font-semibold">{result.dist} km</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">Engine</span><span className="text-indigo-400 font-semibold">Haversine + Rate Matrix</span></div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/20 border border-emerald-900/40 p-2.5 rounded-lg">
                      <CheckCircle className="h-3.5 w-3.5 shrink-0" />Estimate generated using SwiftETA engine
                    </div>
                  </div>
                )
              ) : (
                <div className="text-center py-12 text-slate-500 text-sm">
                  <Package className="h-10 w-10 mx-auto mb-3 opacity-30" />
                  Configure parameters and click Get Bulk Estimate
                </div>
              )}
            </div>
          </div>
        )}

        {tab === 'sdk' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2"><Code2 className="h-4 w-4 text-indigo-400" />Drop-in SDK Snippet</h3>
              <button onClick={handleCopy}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${copied?'bg-emerald-600 text-white':'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>
                {copied ? <CheckCircle className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}{copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <p className="text-xs text-slate-400 mb-4">Paste into any HTML page. Your API key is pre-filled.</p>
            <pre className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono text-emerald-300 overflow-x-auto whitespace-pre-wrap">{sdkSnippet(user.apiKey)}</pre>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              {[{Icon:Zap,label:'< 2KB',desc:'Gzipped bundle'},{Icon:Globe,label:'CDN Hosted',desc:'Global edge'},{Icon:ShieldCheck,label:'CORS Safe',desc:'No server needed'}].map(({Icon,label,desc}) => (
                <div key={label} className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex items-center gap-2.5">
                  <Icon className="h-4 w-4 text-indigo-400 shrink-0" />
                  <div><p className="font-semibold text-white">{label}</p><p className="text-slate-500 text-[10px]">{desc}</p></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'api' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-4"><Terminal className="h-4 w-4 text-indigo-400" />REST API Reference</h3>
            <p className="text-xs text-slate-400 mb-4">Base URL: <code className="bg-slate-950 px-1.5 py-0.5 rounded text-indigo-300">https://api.swifteta.in/v1</code> (Phase 3 — not yet live)</p>
            {[
              { method:'POST', path:'/estimate', desc:'Single shipment ETA.', body:'{
  "origin": "560001",
  "destination": "110001",
  "weight_kg": 0.5
}', resp:'{
  "days_min": 3,
  "days_max": 5,
  "rate_inr": 120
}' },
              { method:'POST', path:'/bulk-estimate', desc:'Batch ETA — up to 100 shipments.', body:'{
  "shipments": [
    { "origin": "560001", "destination": "400001" }
  ]
}', resp:'{
  "results": [ { "days_min": 3 } ]
}' },
            ].map(ep => (
              <div key={ep.path} className="mb-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-emerald-950 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded font-mono">{ep.method}</span>
                  <code className="text-indigo-300 text-xs font-mono">{ep.path}</code>
                </div>
                <p className="text-xs text-slate-400 mb-2">{ep.desc}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div><span className="text-[10px] text-slate-500 uppercase mb-1 block">Request</span><pre className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-amber-300 overflow-x-auto">{ep.body}</pre></div>
                  <div><span className="text-[10px] text-slate-500 uppercase mb-1 block">Response</span><pre className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-emerald-300 overflow-x-auto">{ep.resp}</pre></div>
                </div>
              </div>
            ))}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs">
              <span className="text-slate-400">Auth header: </span>
              <code className="text-indigo-300 font-mono">X-API-Key: {user.apiKey}</code>
            </div>
          </div>
        )}

        {tab === 'analytics' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[{label:'API Calls (30d)',value:user.calls.toLocaleString(),color:'text-white'},{label:'ETA Accuracy',value:'97.2%',color:'text-emerald-400'},{label:'Avg Latency',value:'18ms',color:'text-indigo-400'},{label:'Success Rate',value:'99.8%',color:'text-amber-400'}].map(({label,value,color}) => (
                <div key={label} className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">{label}</span>
                  <strong className={`text-2xl font-mono mt-1 block ${color}`}>{value}</strong>
                </div>
              ))}
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-4"><TrendingUp className="h-4 w-4 text-indigo-400" />Usage by Plan</h3>
              <div className="space-y-3">
                {[{label:'Starter',pct:25,color:'bg-slate-500'},{label:'Pro',pct:65,color:'bg-indigo-500'},{label:'Enterprise',pct:100,color:'bg-amber-500'}].map(({label,pct,color}) => (
                  <div key={label}>
                    <div className="flex justify-between text-xs mb-1"><span className="text-slate-300">{label}</span><span className="text-slate-500">{pct}%</span></div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden"><div className={`h-full ${color} rounded-full`} style={{width:`${pct}%`}} /></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-3"><Users className="h-4 w-4 text-indigo-400" />Active Accounts</h3>
              <div className="space-y-2">
                {Object.entries(MOCK_USERS).map(([e, u]) => (
                  <div key={e} className={`flex items-center justify-between p-3 rounded-xl border ${e===user.email?'border-indigo-500/40 bg-indigo-950/20':'border-slate-800 bg-slate-950'}`}>
                    <div><p className="text-xs font-semibold text-white">{u.name}</p><p className="text-[10px] text-slate-400">{e}</p></div>
                    <div className="text-right">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${u.plan==='Enterprise'?'bg-amber-950 text-amber-400':u.plan==='Pro'?'bg-indigo-950 text-indigo-400':'bg-slate-800 text-slate-400'}`}>{u.plan}</span>
                      <p className="text-[10px] text-slate-500 mt-0.5">{u.calls.toLocaleString()} calls</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
