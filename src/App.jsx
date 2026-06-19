import React, { useState, useEffect, useCallback } from 'react';
import {
  Truck, CheckCircle, AlertTriangle, Clock, RefreshCw, BarChart2, Database, Shield, Server, Zap, Search, MapPin,
  Layers, Settings, HardDrive, Info, ArrowRight, TrendingUp, Users, Activity, FileText, ChevronRight,
  HelpCircle, AlertCircle, Building2, ShoppingCart
} from 'lucide-react';
import B2BPortal from './B2BPortal.jsx';

const ORIGIN_PINCODE = "560001";

const PINCODE_DATABASE = {
  "560001": { pincode:"560001", city:"Bengaluru (MG Road/Central)", state:"Karnataka", lat:12.9716, lng:77.5946, tier:"Tier 1", isMetro:true,  isRemote:false, isNorthEast:false },
  "560002": { pincode:"560002", city:"Bengaluru (Chickpet)",        state:"Karnataka", lat:12.9701, lng:77.5764, tier:"Tier 1", isMetro:true,  isRemote:false, isNorthEast:false },
  "560004": { pincode:"560004", city:"Bengaluru (Basavanagudi)",    state:"Karnataka", lat:12.9417, lng:77.5755, tier:"Tier 1", isMetro:true,  isRemote:false, isNorthEast:false },
  "560011": { pincode:"560011", city:"Bengaluru (Jayanagar)",       state:"Karnataka", lat:12.9299, lng:77.5824, tier:"Tier 1", isMetro:true,  isRemote:false, isNorthEast:false },
  "560012": { pincode:"560012", city:"Bengaluru (Malleshwaram)",    state:"Karnataka", lat:12.9961, lng:77.5712, tier:"Tier 1", isMetro:true,  isRemote:false, isNorthEast:false },
  "560034": { pincode:"560034", city:"Bengaluru (Koramangala)",     state:"Karnataka", lat:12.9338, lng:77.6244, tier:"Tier 1", isMetro:true,  isRemote:false, isNorthEast:false },
  "560037": { pincode:"560037", city:"Bengaluru (Marathahalli)",    state:"Karnataka", lat:12.9562, lng:77.6975, tier:"Tier 1", isMetro:true,  isRemote:false, isNorthEast:false },
  "560038": { pincode:"560038", city:"Bengaluru (Indiranagar)",     state:"Karnataka", lat:12.9719, lng:77.6412, tier:"Tier 1", isMetro:true,  isRemote:false, isNorthEast:false },
  "560056": { pincode:"560056", city:"Bengaluru (University/West)", state:"Karnataka", lat:12.9463, lng:77.5097, tier:"Tier 1", isMetro:true,  isRemote:false, isNorthEast:false },
  "560064": { pincode:"560064", city:"Bengaluru (Yelahanka/North)", state:"Karnataka", lat:13.1006, lng:77.5963, tier:"Tier 1", isMetro:true,  isRemote:false, isNorthEast:false },
  "560066": { pincode:"560066", city:"Bengaluru (Whitefield/East)", state:"Karnataka", lat:12.9698, lng:77.75,   tier:"Tier 1", isMetro:true,  isRemote:false, isNorthEast:false },
  "560078": { pincode:"560078", city:"Bengaluru (JP Nagar)",        state:"Karnataka", lat:12.9063, lng:77.5857, tier:"Tier 1", isMetro:true,  isRemote:false, isNorthEast:false },
  "560094": { pincode:"560094", city:"Bengaluru (Sanjay Nagar)",    state:"Karnataka", lat:13.03,   lng:77.575,  tier:"Tier 1", isMetro:true,  isRemote:false, isNorthEast:false },
  "560100": { pincode:"560100", city:"Bengaluru (Electronic City)", state:"Karnataka", lat:12.8452, lng:77.676,  tier:"Tier 1", isMetro:true,  isRemote:false, isNorthEast:false },
  "570001": { pincode:"570001", city:"Mysuru",           state:"Karnataka",    lat:12.3087, lng:76.6547, tier:"Tier 2", isMetro:false, isRemote:false, isNorthEast:false },
  "575001": { pincode:"575001", city:"Mangaluru",        state:"Karnataka",    lat:12.9141, lng:74.856,  tier:"Tier 2", isMetro:false, isRemote:false, isNorthEast:false },
  "576101": { pincode:"576101", city:"Udupi",            state:"Karnataka",    lat:13.3409, lng:74.7421, tier:"Tier 2", isMetro:false, isRemote:false, isNorthEast:false },
  "577001": { pincode:"577001", city:"Davanagere",       state:"Karnataka",    lat:14.4644, lng:75.9218, tier:"Tier 2", isMetro:false, isRemote:false, isNorthEast:false },
  "577201": { pincode:"577201", city:"Shivamogga",       state:"Karnataka",    lat:13.9299, lng:75.5681, tier:"Tier 2", isMetro:false, isRemote:false, isNorthEast:false },
  "580001": { pincode:"580001", city:"Hubballi / Dharwad",state:"Karnataka",   lat:15.3647, lng:75.124,  tier:"Tier 2", isMetro:false, isRemote:false, isNorthEast:false },
  "583101": { pincode:"583101", city:"Ballari",          state:"Karnataka",    lat:15.1394, lng:76.9214, tier:"Tier 2", isMetro:false, isRemote:false, isNorthEast:false },
  "585101": { pincode:"585101", city:"Kalaburagi",       state:"Karnataka",    lat:17.3297, lng:76.8343, tier:"Tier 3", isMetro:false, isRemote:false, isNorthEast:false },
  "586101": { pincode:"586101", city:"Vijayapura",       state:"Karnataka",    lat:16.8302, lng:75.71,   tier:"Tier 3", isMetro:false, isRemote:false, isNorthEast:false },
  "590001": { pincode:"590001", city:"Belagavi",         state:"Karnataka",    lat:15.8497, lng:74.4977, tier:"Tier 2", isMetro:false, isRemote:false, isNorthEast:false },
  "572101": { pincode:"572101", city:"Tumakuru",         state:"Karnataka",    lat:13.34,   lng:77.1,    tier:"Tier 2", isMetro:false, isRemote:false, isNorthEast:false },
  "571401": { pincode:"571401", city:"Mandya",           state:"Karnataka",    lat:12.5218, lng:76.8951, tier:"Tier 2", isMetro:false, isRemote:false, isNorthEast:false },
  "573201": { pincode:"573201", city:"Hassan",           state:"Karnataka",    lat:13.008,  lng:76.1018, tier:"Tier 2", isMetro:false, isRemote:false, isNorthEast:false },
  "581301": { pincode:"581301", city:"Karwar",           state:"Karnataka",    lat:14.808,  lng:74.13,   tier:"Tier 3", isMetro:false, isRemote:true,  isNorthEast:false },
  "110001": { pincode:"110001", city:"New Delhi",        state:"Delhi",        lat:28.6139, lng:77.209,  tier:"Tier 1", isMetro:true,  isRemote:false, isNorthEast:false },
  "400001": { pincode:"400001", city:"Mumbai",           state:"Maharashtra",  lat:18.922,  lng:72.8347, tier:"Tier 1", isMetro:true,  isRemote:false, isNorthEast:false },
  "700001": { pincode:"700001", city:"Kolkata",          state:"West Bengal",  lat:22.5726, lng:88.3639, tier:"Tier 1", isMetro:true,  isRemote:false, isNorthEast:false },
  "600001": { pincode:"600001", city:"Chennai",          state:"Tamil Nadu",   lat:13.0827, lng:80.2707, tier:"Tier 1", isMetro:true,  isRemote:false, isNorthEast:false },
  "799001": { pincode:"799001", city:"Agartala",         state:"Tripura",      lat:23.8315, lng:91.2868, tier:"Tier 3", isMetro:false, isRemote:true,  isNorthEast:true  },
  "190001": { pincode:"190001", city:"Srinagar",         state:"J & K",        lat:34.0837, lng:74.7973, tier:"Tier 3", isMetro:false, isRemote:true,  isNorthEast:false },
  "302001": { pincode:"302001", city:"Jaipur",           state:"Rajasthan",    lat:26.9124, lng:75.7873, tier:"Tier 2", isMetro:false, isRemote:false, isNorthEast:false },
  "403001": { pincode:"403001", city:"Panaji",           state:"Goa",          lat:15.4909, lng:73.8278, tier:"Tier 2", isMetro:false, isRemote:false, isNorthEast:false },
  "500001": { pincode:"500001", city:"Hyderabad",        state:"Telangana",    lat:17.385,  lng:78.4867, tier:"Tier 1", isMetro:true,  isRemote:false, isNorthEast:false }
};

const COURIER_PARTNERS = [
  { id:'shiprocket', name:'Shiprocket Air',       baseSpeedMultiplier:0.9, baseSlaDays:3, reliability:0.96, rating:4.5, expressSupported:true  },
  { id:'nimbus',     name:'NimbusPost Premium',   baseSpeedMultiplier:1.0, baseSlaDays:4, reliability:0.93, rating:4.2, expressSupported:true  },
  { id:'delhivery',  name:'Delhivery Surface',    baseSpeedMultiplier:1.2, baseSlaDays:5, reliability:0.91, rating:4.0, expressSupported:false }
];

const HOLIDAYS = ["2026-01-26","2026-08-15","2026-10-02","2026-12-25"];

function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371, d2r = Math.PI / 180;
  const dLat = (lat2 - lat1) * d2r, dLon = (lon2 - lon1) * d2r;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*d2r)*Math.cos(lat2*d2r)*Math.sin(dLon/2)**2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)));
}

function getDistanceBracket(distKm) {
  if (distKm <= 50)   return { label:"0–50 km (Same City/Local)",       factor:1.0 };
  if (distKm <= 200)  return { label:"50–200 km (Intra-State/Close)",   factor:1.2 };
  if (distKm <= 500)  return { label:"200–500 km (Neighbor State)",     factor:1.5 };
  if (distKm <= 1000) return { label:"500–1000 km (Medium Distance)",   factor:1.8 };
  return               { label:"1000+ km (Cross-Country)",              factor:2.3 };
}

function calculateBusinessDaysOffset(startDate, daysOffset) {
  let d = new Date(startDate), added = 0, checks = 0;
  while (added < daysOffset && checks < 50) {
    d.setDate(d.getDate() + 1);
    const dow = d.getDay(), ds = d.toISOString().split('T')[0];
    if (dow !== 0 && dow !== 6 && !HOLIDAYS.includes(ds)) added++;
    checks++;
  }
  return d;
}

function formatDateReadable(date) {
  if (!date || !(date instanceof Date)) return "N/A";
  return date.toLocaleDateString('en-US', { weekday:'short', month:'short', day:'numeric' });
}

// ── Mode Switcher pill component ────────────────────────────────────────────
function ModeSwitcher({ mode, onChange }) {
  return (
    <div className="relative flex items-center bg-slate-800/80 border border-slate-700/60 rounded-full p-1 gap-0.5 select-none">
      {/* sliding highlight */}
      <div
        className="absolute top-1 bottom-1 rounded-full bg-indigo-600 shadow-lg shadow-indigo-500/30 transition-all duration-300 ease-in-out"
        style={{
          left:  mode === 'b2b' ? 'calc(50% + 2px)' : '4px',
          right: mode === 'b2b' ? '4px'             : 'calc(50% + 2px)',
        }}
      />
      {/* Direct Customer button */}
      <button
        onClick={() => onChange('d2c')}
        className={`relative z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors duration-200 ${
          mode === 'd2c' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <ShoppingCart className="h-3 w-3" />
        <span>Direct Customer</span>
      </button>
      {/* B2B Supplier button */}
      <button
        onClick={() => onChange('b2b')}
        className={`relative z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors duration-200 ${
          mode === 'b2b' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Building2 className="h-3 w-3" />
        <span>B2B Supplier</span>
      </button>
    </div>
  );
}

export default function App() {
  // ── top-level mode: 'd2c' (Direct Customer) | 'b2b' (B2B Supplier)
  // default is 'd2c' so customers land on the main estimator
  const [mode, setMode] = useState('d2c');

  // ── D2C simulation state ────────────────────────────────────────────────
  const [activeTab, setActiveTab]               = useState('simulation');
  const [destinationPincode, setDestinationPincode] = useState('560066');
  const [expressOption, setExpressOption]       = useState(false);

  const [isEngineLoading, setIsEngineLoading]   = useState(false);
  const [useRealShiprocket, setUseRealShiprocket] = useState(false);
  const [shiprocketEmail, setShiprocketEmail]   = useState('');
  const [shiprocketPassword, setShiprocketPassword] = useState('');
  const [secureToken, setSecureToken]           = useState('');

  const [apiShiprocketUp, setApiShiprocketUp]   = useState(true);
  const [apiNimbusUp, setApiNimbusUp]           = useState(true);
  const [apiDelhiveryUp, setApiDelhiveryUp]     = useState(false);
  const [enableRedisCache, setEnableRedisCache] = useState(true);

  const [searchesCount, setSearchesCount]       = useState(4820);
  const [apiFailureCount, setApiFailureCount]   = useState(48);
  const [conversionRate]                        = useState(3.4);
  const [estimationResult, setEstimationResult] = useState({
    status: "unserviceable", error: "Please configure settings or search a valid pincode."
  });
  const [logs, setLogs] = useState([
    { id:1, time:"11:51:24", type:"info",    text:"Client cache layer initialized."            },
    { id:2, time:"11:52:05", type:"info",    text:"Shiprocket Adapter verified online (healthcheck OK)"    },
    { id:3, time:"11:52:06", type:"warning", text:"Delhivery Adapter reported partial timeout. Fallback enabled." }
  ]);

  const addLog = useCallback((text, type = "info") => {
    const t = new Date().toTimeString().split(' ')[0];
    setLogs(prev => [{ id: Date.now(), time: t, type, text }, ...prev.slice(0, 49)]);
  }, []);

  const executeRealShiprocketSLA = async (targetPin, tokenToUse) => {
    try {
      addLog("Sending fetch query to Shiprocket SLA serviceability endpoint...", "info");
      const response = await fetch(
        'https://apiv2.shiprocket.in/v1/external/courier/serviceability?' +
          new URLSearchParams({ pickup_postcode: ORIGIN_PINCODE, delivery_postcode: targetPin, weight: '0.5', cod: '0' }),
        { method:'GET', headers:{ 'Content-Type':'application/json', 'Authorization': `Bearer ${tokenToUse}` } }
      );
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const resData = await response.json();
      if (resData?.status===200 && resData?.data?.available_courier_companies?.[0]) {
        const top = resData.data.available_courier_companies[0];
        addLog("Real Shiprocket API returned serviceability matrix successfully.", "info");
        return { carrierName: top.courier_name||"Shiprocket Air", etd: top.etd||"", rate: top.rate||"120.00" };
      }
      throw new Error("Pincode unserviceable on Shiprocket platform.");
    } catch (err) {
      addLog("CORS / Network block on Shiprocket endpoint. Reverting cleanly...", "warning");
      throw err;
    }
  };

  const computeShippingETA = useCallback(async () => {
    if (!destinationPincode || !PINCODE_DATABASE[destinationPincode] || destinationPincode.length !== 6) {
      setEstimationResult({ status:"unserviceable", error:"Entered pincode is outside our service network." });
      return;
    }
    setIsEngineLoading(true);
    const dest = PINCODE_DATABASE[destinationPincode], origin = PINCODE_DATABASE[ORIGIN_PINCODE];
    const distanceKm = calculateHaversineDistance(origin.lat, origin.lng, dest.lat, dest.lng);
    const bracket    = getDistanceBracket(distanceKm);
    const isSameCity  = (origin.pincode.substring(0,3) === dest.pincode.substring(0,3)) || distanceKm < 45;
    const isSameState = origin.state === dest.state;

    let zone = "Zonal";
    if      (isSameCity)                   zone = "Local (Same City)";
    else if (isSameState)                  zone = "Regional (Same State)";
    else if (dest.isNorthEast)             zone = "Special (North-East)";
    else if (dest.isRemote)                zone = "Special (Remote Area)";
    else if (origin.isMetro && dest.isMetro) zone = "National (Metro to Metro)";
    else                                   zone = "National (Zone Outer)";

    let selectedEngine="", primaryCarrier="", baseDaysEstimate=3, confidence=98, rateAmount="FREE";
    const expressAllowed = !dest.isRemote;
    const cacheFound = enableRedisCache ? parseInt(destinationPincode,10)%2===0 : false;

    let level1Success = false;
    if (useRealShiprocket && secureToken) {
      try {
        const live = await executeRealShiprocketSLA(dest.pincode, secureToken);
        selectedEngine = "Level 1: Live Shiprocket API (Production)";
        primaryCarrier = live.carrierName;
        rateAmount     = `₹ ${live.rate}`;
        if (live.etd) {
          const days = parseInt(live.etd, 10);
          baseDaysEstimate = Math.max(1, days);
        } else { baseDaysEstimate = 3; }
        confidence = 99; level1Success = true;
      } catch { addLog("Level 1 fallback activated. Triggering failover...", "warning"); }
    }
    if (!level1Success) {
      if      (apiShiprocketUp) { selectedEngine="Level 1: Shiprocket API (Simulator)";  primaryCarrier="Shiprocket Air";          baseDaysEstimate=3; confidence=97; }
      else if (apiNimbusUp)     { selectedEngine="Level 1: NimbusPost API (Fallback)";   primaryCarrier="NimbusPost Premium";      baseDaysEstimate=4; confidence=94; }
      else if (apiDelhiveryUp)  { selectedEngine="Level 1: Delhivery API (Tertiary)";    primaryCarrier="Delhivery Surface";       baseDaysEstimate=5; confidence=91; }
      else {
        selectedEngine = "Level 2: Internal Rule-Based Core"; primaryCarrier = "Multi-Carrier Ground"; confidence = 88;
        if      (isSameCity)                   baseDaysEstimate = 1;
        else if (isSameState)                  baseDaysEstimate = 2;
        else if (dest.isNorthEast)             baseDaysEstimate = 7;
        else if (dest.isRemote)                baseDaysEstimate = 8;
        else if (origin.isMetro && dest.isMetro) baseDaysEstimate = 3;
        else                                   baseDaysEstimate = 4;
        if      (distanceKm > 1000) baseDaysEstimate += 1.5;
        else if (distanceKm > 500)  baseDaysEstimate += 0.8;
      }
    }

    // Phase 1 fix: compute carrier rate using distance bracket factor
    if (rateAmount === "FREE") {
      const distFactor = getDistanceBracket(distanceKm).factor;
      const baseRate = 35 + (0.5 * 20); // 0.5kg default weight
      rateAmount = "₹ " + Math.round(baseRate * distFactor);
    }

    let minDays = Math.max(1, Math.floor(baseDaysEstimate*(expressOption?0.6:1)));
    let maxDays = Math.ceil((baseDaysEstimate+1.5)*(expressOption?0.7:1));
    if (maxDays <= minDays) maxDays = minDays + 1;

    let mlNote = "", weekendImpact = false;
    const now = new Date(), dow = now.getDay();
    if (dow===5 || dow===6) { minDays++; maxDays++; weekendImpact=true; mlNote="ML Layer +1 day: weekend processing latency."; }

    setEstimationResult({
      status:"serviceable", origin:ORIGIN_PINCODE, destination:dest.pincode, city:dest.city, state:dest.state, tier:dest.tier,
      distanceKm, bracket:bracket.label, zone, engine:selectedEngine, carrier:primaryCarrier, rate:rateAmount,
      minDays, maxDays, minDate:calculateBusinessDaysOffset(now,minDays), maxDate:calculateBusinessDaysOffset(now,maxDays),
      expressSupported:expressAllowed, confidence:expressOption?Math.max(75,confidence-8):confidence,
      isWeekendImpact:weekendImpact, mlAdjustmentNote:mlNote, cached:enableRedisCache&&cacheFound
    });
    setIsEngineLoading(false);
  }, [destinationPincode, apiShiprocketUp, apiNimbusUp, apiDelhiveryUp, enableRedisCache, expressOption, useRealShiprocket, secureToken, addLog]);

  const triggerShiprocketAuthentication = async () => {
    if (!shiprocketEmail || !shiprocketPassword) { addLog("Auth failed: Email/password required.", "error"); return; }
    setIsEngineLoading(true);
    addLog("Connecting to apiv2.shiprocket.in/v1/external/auth/login...", "info");
    try {
      const response = await fetch('https://apiv2.shiprocket.in/v1/external/auth/login', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ email:shiprocketEmail, password:shiprocketPassword })
      });
      if (!response.ok) throw new Error(`Unauthorized ${response.status}`);
      const parsed = await response.json();
      if (parsed?.token) { setSecureToken(parsed.token); setUseRealShiprocket(true); addLog("Production token granted. Real Shiprocket active.", "info"); }
      else throw new Error("No token in response.");
    } catch (err) {
      addLog(`Auth failed: ${err.message}. Using simulator.`, "error"); setUseRealShiprocket(false);
    } finally { setIsEngineLoading(false); }
  };

  useEffect(() => { computeShippingETA(); }, [computeShippingETA]);

  const handlePincodeSearch = (pin) => {
    setDestinationPincode(pin);
    if (PINCODE_DATABASE[pin]) setSearchesCount(p=>p+1);
    else if (pin.length===6)   setApiFailureCount(p=>p+1);
  };

  const quickTestPincodes = [
    { code:"560094", label:"Bengaluru Sanjay Nagar (Local)"  },
    { code:"560100", label:"Bengaluru Electronic City"        },
    { code:"570001", label:"Mysuru (Intra-State)"            },
    { code:"580001", label:"Hubballi North Karnataka"         },
    { code:"110001", label:"New Delhi (Metro Route)"          },
    { code:"799001", label:"Agartala (Remote / NE)"          }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">

      {/* ════════════════════════════════════════════════════════
          GLOBAL HEADER — always visible, contains mode switcher
         ════════════════════════════════════════════════════════ */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
        <div className="max-w-[1700px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">

          {/* Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="p-2.5 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-500/20">
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                SwiftETA
                <span className="text-xs bg-indigo-500/20 text-indigo-400 font-semibold px-2 py-0.5 rounded-full border border-indigo-500/30">
                  v2.5
                </span>
              </h1>
              <p className="text-xs text-slate-400 hidden sm:block">
                {mode === 'd2c'
                  ? 'High-Fidelity Shipping SLA & Courier Recommendation Engine'
                  : 'B2B / Wholesale Shipping Portal — SDK & API Access'}
              </p>
            </div>
          </div>

          {/* ── MODE SWITCHER (centre-ish) ── */}
          <div className="flex flex-col items-center gap-1">
            <ModeSwitcher mode={mode} onChange={setMode} />
            <p className="text-[9px] text-slate-500 tracking-wide">
              {mode === 'd2c'
                ? 'Estimating for yourself? You are in the right place.'
                : 'Supplier / wholesaler? Manage your shipping SDK here.'}
            </p>
          </div>

          {/* D2C sub-tabs (only visible in d2c mode) */}
          {mode === 'd2c' && (
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setActiveTab('simulation')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${activeTab==='simulation' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
              >
                <Layers className="h-3.5 w-3.5" /> Simulation
              </button>
              <button
                onClick={() => setActiveTab('docs')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${activeTab==='docs' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
              >
                <FileText className="h-3.5 w-3.5" /> Docs
              </button>
            </div>
          )}
        </div>
      </header>

      {/* ════════════════════════════════════════════════════════
          MODE — B2B SUPPLIER  →  render B2BPortal directly
         ════════════════════════════════════════════════════════ */}
      {mode === 'b2b' && (
        <div className="flex-1">
          {/* Strip the B2BPortal's own full-screen wrapper since we share the header */}
          <B2BPortal embedded />
        </div>
      )}

      {/* ════════════════════════════════════════════════════════
          MODE — DIRECT CUSTOMER  →  original simulation app
         ════════════════════════════════════════════════════════ */}
      {mode === 'd2c' && (
        <>
          {/* Origin notice bar */}
          <div className="bg-indigo-950/40 border-b border-indigo-900/50 px-6 py-2.5 flex items-center justify-between text-xs text-indigo-300">
            <span className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-indigo-400 animate-bounce" />
              Fulfillment Center: <strong className="text-white ml-1">Bengaluru Hub ({ORIGIN_PINCODE})</strong>
            </span>
            <span className="hidden md:flex items-center gap-1.5 text-indigo-400 font-medium">
              <Zap className="h-3 w-3 text-amber-400 fill-amber-400" /> Haversine Engine Active
            </span>
          </div>

          <main className="flex-1 max-w-[1700px] w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* ── SIMULATION TAB ─────────────────────────────────── */}
            {activeTab === 'simulation' && (
              <>
                {/* SIDEBAR 4 cols */}
                <div className="lg:col-span-4 flex flex-col gap-6">

                  {/* Simulation Controls */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                        <Settings className="h-4 w-4 text-indigo-400" /> Simulation Control
                      </h3>
                      <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-md font-mono">Live Toggle</span>
                    </div>
                    <p className="text-xs text-slate-400 mb-4">
                      Toggle API health to watch the <strong>Automatic Fallback Chain</strong> in real time.
                    </p>

                    {/* Shiprocket Live Credentials */}
                    <div className="space-y-3 mb-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
                      <div className="text-xs font-bold text-indigo-400 border-b border-slate-800 pb-1.5 flex justify-between items-center">
                        <span className="flex items-center gap-1"><Shield className="h-3 w-3" /> Live Shiprocket</span>
                        <span className="text-[10px] bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded">Level 1 Direct</span>
                      </div>
                      <input type="email" placeholder="Shiprocket Email" value={shiprocketEmail}
                        onChange={e => setShiprocketEmail(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg py-1.5 px-2.5 text-xs outline-none focus:border-indigo-500 text-slate-200" />
                      <input type="password" placeholder="Shiprocket Password" value={shiprocketPassword}
                        onChange={e => setShiprocketPassword(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg py-1.5 px-2.5 text-xs outline-none focus:border-indigo-500 text-slate-200" />
                      <button onClick={triggerShiprocketAuthentication} disabled={isEngineLoading}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 transition py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 disabled:opacity-50">
                        {isEngineLoading ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Zap className="h-3.5 w-3.5" />}
                        Sync Real Shiprocket API
                      </button>
                      {secureToken && (
                        <div className="bg-emerald-950/40 border border-emerald-900/50 p-2 rounded text-[10px] text-emerald-400">
                          ✓ Connected. Real serviceability active.
                        </div>
                      )}
                    </div>

                    {/* API toggles */}
                    <div className="space-y-3 mb-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
                      <div className="text-xs font-semibold text-slate-300 border-b border-slate-800 pb-1.5 mb-2 flex justify-between">
                        <span>Integration Tier (Level 1 APIs)</span>
                        <span className="text-indigo-400">Priority</span>
                      </div>
                      {[
                        { label:"Shiprocket Air API",    state:apiShiprocketUp, setter:setApiShiprocketUp, ord:"1st" },
                        { label:"NimbusPost Premium API", state:apiNimbusUp,    setter:setApiNimbusUp,     ord:"2nd" },
                        { label:"Delhivery API",          state:apiDelhiveryUp, setter:setApiDelhiveryUp,  ord:"3rd" }
                      ].map(({ label, state, setter, ord }) => (
                        <div key={label} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] bg-indigo-950 text-indigo-400 font-bold px-1.5 py-0.5 rounded">{ord}</span>
                            <span className="text-xs text-slate-200">{label}</span>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={state} onChange={() => setter(v=>!v)} className="sr-only peer" />
                            <div className="w-9 h-5 bg-slate-800 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                          </label>
                        </div>
                      ))}
                    </div>

                    {/* Redis toggle */}
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 mb-4">
                      <div className="text-xs font-semibold text-rose-400 border-b border-slate-800 pb-1.5 mb-3 flex justify-between items-center">
                        <span className="flex items-center gap-1.5"><HardDrive className="h-3 w-3" /> Client Cache Layer</span>
                        <span className="text-[10px] bg-rose-950 text-rose-300 px-1.5 py-0.5 rounded">24h SLA</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs text-slate-200 block">Enable Client Cache</span>
                          <span className="text-[10px] text-slate-500">Saves ~350ms per lookup</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked={enableRedisCache} onChange={()=>setEnableRedisCache(v=>!v)} className="sr-only peer" />
                          <div className="w-9 h-5 bg-slate-800 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-500"></div>
                        </label>
                      </div>
                    </div>

                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">Status:</span>
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping inline-block"></span>
                        <span className="text-xs text-white font-medium">Fallback Ready</span>
                      </div>
                    </div>
                  </div>

                  {/* Pincode Search */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-4">
                      <Search className="h-4 w-4 text-indigo-400" /> Pincode Simulator
                    </h3>
                    <div className="relative mb-4">
                      <input type="text" placeholder="Enter 6-digit Pincode (e.g. 560094)"
                        value={destinationPincode}
                        onChange={e => {
                          const val = e.target.value.replace(/\D/g,'').substring(0,6);
                          setDestinationPincode(val);
                          if (val.length===6) handlePincodeSearch(val);
                        }}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 pl-10 text-sm text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      />
                      <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                      {destinationPincode.length>0 && destinationPincode.length<6 && (
                        <span className="absolute right-3 top-3 text-[10px] text-amber-500 bg-amber-500/10 px-2 py-1 rounded">Entering…</span>
                      )}
                      {destinationPincode.length===6 && estimationResult.status==="unserviceable" && (
                        <span className="absolute right-3 top-3 text-[10px] text-rose-500 bg-rose-500/10 px-2 py-1 rounded">Unserviceable</span>
                      )}
                      {destinationPincode.length===6 && estimationResult.status==="serviceable" && (
                        <span className="absolute right-3 top-3 text-[10px] text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded">Valid Zone</span>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Quick Presets:</span>
                      <div className="max-h-[220px] overflow-y-auto space-y-1.5 pr-1">
                        {quickTestPincodes.map(item => (
                          <button key={item.code} onClick={() => handlePincodeSearch(item.code)}
                            className={`w-full text-left p-2 rounded-lg border text-[11px] flex justify-between items-center transition-all ${destinationPincode===item.code ? 'bg-indigo-600/20 border-indigo-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'}`}>
                            <div>
                              <span className="font-mono bg-slate-900 px-1.5 py-0.5 rounded text-indigo-400 mr-2">{item.code}</span>
                              <span>{PINCODE_DATABASE[item.code]?.city.split(" (")[0]}</span>
                            </div>
                            <ChevronRight className="h-3 w-3 text-slate-500" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Math Metrics */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex-1">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-3">
                      <Database className="h-4 w-4 text-indigo-400" /> Math Engine Metrics
                    </h3>
                    {estimationResult.status==="serviceable" ? (
                      <div className="space-y-3 text-xs">
                        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                          <span className="text-slate-400 block text-[10px] uppercase">Haversine Distance</span>
                          <strong className="text-lg text-white font-mono block mt-1">{estimationResult.distanceKm} km</strong>
                          <span className="text-xs text-indigo-400">{estimationResult.bracket}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                            <span className="text-slate-400 block text-[10px] uppercase">Zone</span>
                            <strong className="text-slate-200 block font-mono mt-0.5 text-xs">{estimationResult.zone}</strong>
                          </div>
                          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                            <span className="text-slate-400 block text-[10px] uppercase">Tier</span>
                            <strong className="text-slate-200 block mt-0.5 text-xs">{estimationResult.tier}</strong>
                          </div>
                        </div>
                        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-slate-400 text-[10px] uppercase">Engine Path</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${estimationResult.engine.includes('Level 1') ? 'bg-emerald-950 text-emerald-400' : 'bg-amber-950 text-amber-400'}`}>
                              {estimationResult.engine.includes('Level 1') ? 'API-driven' : 'Fallback'}
                            </span>
                          </div>
                          <p className="text-white font-mono text-xs">{estimationResult.engine}</p>
                        </div>
                        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                          <div className="flex justify-between">
                            <span className="text-slate-400 text-[10px] uppercase">Cache Hit</span>
                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${estimationResult.cached ? 'bg-rose-950 text-rose-300' : 'bg-slate-900 text-slate-500'}`}>
                              {estimationResult.cached ? 'HIT' : 'MISS'}
                            </span>
                          </div>
                          <code className="text-[10px] text-slate-400 mt-1 block">ETA:{ORIGIN_PINCODE}:{destinationPincode}</code>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 bg-slate-950 rounded-xl border border-dashed border-slate-800 text-slate-500 text-xs">
                        Select a valid pincode to show metrics.
                      </div>
                    )}
                  </div>
                </div>

                {/* MAIN CONTENT 8 cols */}
                <div className="lg:col-span-8 flex flex-col gap-6">

                  {/* Three live page views */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-4 mb-6">
                      <div>
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                          <Layers className="h-5 w-5 text-indigo-400" /> Interactive User Flow Views
                        </h2>
                        <p className="text-xs text-slate-400">Live integration at each stage of the buyer checkout lifecycle</p>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-xs bg-slate-800 px-3 py-1.5 rounded-lg font-mono text-slate-300">Origin: {ORIGIN_PINCODE}</span>
                        <span className="text-xs bg-slate-800 px-3 py-1.5 rounded-lg font-mono text-slate-300">Target: {destinationPincode||"---"}</span>
                      </div>
                    </div>

                    {/* VIEW 1 — PDP Widget */}
                    <div className="border border-slate-800 rounded-2xl bg-slate-950 p-5 mb-6 relative overflow-hidden">
                      <div className="absolute top-0 right-0 bg-indigo-600/10 border-l border-b border-indigo-500/20 px-3 py-1 rounded-bl-xl text-[10px] font-bold text-indigo-400 uppercase">1. Product Detail Page Widget</div>
                      <h4 className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-wider">PDP Shipping Estimator</h4>
                      <div className="max-w-md bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-md">
                        <div className="flex gap-3 mb-4 border-b border-slate-800 pb-3">
                          <div className="w-12 h-12 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-lg">💻</div>
                          <div>
                            <span className="text-slate-400 text-[10px] block uppercase font-semibold">Premium Electronics</span>
                            <h5 className="text-sm font-semibold text-white">Quantum Developer Ultrabook v4</h5>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <label className="block text-xs font-medium text-slate-300">Deliver to</label>
                          <div className="flex gap-2">
                            <div className="relative flex-1">
                              <input type="text" className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2 px-3 pl-8 text-xs text-slate-200 outline-none focus:ring-1 focus:ring-indigo-500"
                                placeholder="Enter 6-Digit PIN" value={destinationPincode}
                                onChange={e => { const v=e.target.value.replace(/\D/g,'').substring(0,6); setDestinationPincode(v); if(v.length===6) handlePincodeSearch(v); }} />
                              <MapPin className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-indigo-400" />
                            </div>
                            <button onClick={computeShippingETA} className="bg-indigo-600 hover:bg-indigo-500 transition px-4 py-2 rounded-lg text-xs font-semibold text-white flex items-center gap-1">
                              {isEngineLoading && <RefreshCw className="h-3 w-3 animate-spin" />} Check SLA
                            </button>
                          </div>
                          {isEngineLoading ? (
                            <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-5 flex flex-col items-center gap-3">
                              <RefreshCw className="h-8 w-8 text-indigo-500 animate-spin" />
                              <span className="text-xs text-slate-400">Resolving Fallback Chain…</span>
                            </div>
                          ) : estimationResult.status==="serviceable" ? (
                            <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3 space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-emerald-400 flex items-center gap-1.5 font-semibold"><CheckCircle className="h-4 w-4" /> Delivery Available</span>
                                <span className="text-[10px] text-slate-400 font-mono">{estimationResult.city}, {estimationResult.state}</span>
                              </div>
                              <div className="pt-1.5 border-t border-slate-800">
                                <span className="text-[10px] text-slate-400 uppercase block">Timeline:</span>
                                <strong className="text-sm text-white">{estimationResult.minDays} – {estimationResult.maxDays} Business Days</strong>
                                <p className="text-[11px] text-indigo-300 mt-0.5">{formatDateReadable(estimationResult.minDate)} – {formatDateReadable(estimationResult.maxDate)}</p>
                              </div>
                              {estimationResult.expressSupported ? (
                                <div className="flex items-center justify-between pt-2 border-t border-slate-800 bg-indigo-950/20 p-2 rounded">
                                  <div className="flex items-center gap-1.5">
                                    <span className="p-1 bg-amber-500/10 text-amber-400 rounded">🚀</span>
                                    <div>
                                      <span className="text-[10px] text-slate-200 font-semibold block">Express Shipping</span>
                                      <span className="text-[9px] text-slate-400">Reduce to 1-2 days</span>
                                    </div>
                                  </div>
                                  <input type="checkbox" checked={expressOption} onChange={e=>setExpressOption(e.target.checked)} className="rounded bg-slate-900 border-slate-700 text-indigo-600" />
                                </div>
                              ) : (
                                <div className="bg-slate-900 p-2 rounded text-[10px] text-slate-400">⚠️ Express unavailable for remote/NE areas.</div>
                              )}
                              <div className="flex justify-between text-[10px] pt-1 border-t border-slate-900">
                                <span className="text-slate-500">Confidence</span>
                                <span className="text-indigo-400 font-bold">{estimationResult.confidence}%</span>
                              </div>
                            </div>
                          ) : (
                            <div className="bg-rose-950/10 border border-rose-900/30 rounded-lg p-3 text-xs text-rose-300 flex items-start gap-2">
                              <AlertTriangle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                              <div>
                                <span className="font-semibold block">Shipping Restricted</span>
                                <span className="text-[10px] text-slate-400">No active partners for pincode <strong>{destinationPincode||"---"}</strong>.</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* VIEW 2 — Cart */}
                    <div className="border border-slate-800 rounded-2xl bg-slate-950 p-5 mb-6 relative overflow-hidden">
                      <div className="absolute top-0 right-0 bg-indigo-600/10 border-l border-b border-indigo-500/20 px-3 py-1 rounded-bl-xl text-[10px] font-bold text-indigo-400 uppercase">2. Cart Estimator Panel</div>
                      <h4 className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-wider">Cart Summary Delivery Window</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-between">
                          <div>
                            <span className="text-slate-400 text-[10px] uppercase font-semibold">Subtotal (1 item)</span>
                            <div className="text-white font-bold text-lg mt-1">₹ 89,990.00</div>
                          </div>
                          {estimationResult.status==="serviceable" ? (
                            <div className="bg-slate-950 border border-slate-800 p-2.5 rounded-lg mt-4 text-[11px] space-y-1">
                              <div className="flex justify-between text-slate-300"><span>Earliest:</span><strong className="text-white">{formatDateReadable(estimationResult.minDate)}</strong></div>
                              <div className="flex justify-between text-slate-300"><span>Latest:</span><strong className="text-white">{formatDateReadable(estimationResult.maxDate)}</strong></div>
                            </div>
                          ) : (
                            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs text-rose-400 text-center mt-4">Enter serviceable pincode.</div>
                          )}
                        </div>
                        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
                          <span className="text-slate-400 text-[10px] uppercase font-semibold block">Logistics Route</span>
                          {estimationResult.status==="serviceable" ? (
                            <div className="space-y-2 text-xs">
                              <div className="flex justify-between bg-slate-950 p-2 rounded border border-slate-800">
                                <span className="text-slate-400">Carrier:</span><span className="text-indigo-400 font-bold">{estimationResult.carrier}</span>
                              </div>
                              <div className="flex justify-between bg-slate-950 p-2 rounded border border-slate-800">
                                <span className="text-slate-400">Zone:</span><span className="text-white">{estimationResult.zone}</span>
                              </div>
                              {estimationResult.isWeekendImpact && <p className="text-[10px] text-amber-400">✨ {estimationResult.mlAdjustmentNote}</p>}
                              <p className="text-[10px] text-slate-400">ETA: <strong className="text-indigo-300">{estimationResult.minDays}–{estimationResult.maxDays} days</strong></p>
                            </div>
                          ) : <div className="py-6 text-center text-slate-500 text-xs">Pending coordinates</div>}
                        </div>
                      </div>
                    </div>

                    {/* VIEW 3 — Checkout */}
                    <div className="border border-slate-800 rounded-2xl bg-slate-950 p-5 relative overflow-hidden">
                      <div className="absolute top-0 right-0 bg-indigo-600/10 border-l border-b border-indigo-500/20 px-3 py-1 rounded-bl-xl text-[10px] font-bold text-indigo-400 uppercase">3. Final Checkout Summary</div>
                      <h4 className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-wider">Select Shipping Method</h4>
                      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
                        <div className="p-3 bg-slate-950 rounded-xl border border-indigo-500/30 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold">✓</div>
                            <div>
                              <span className="text-xs font-bold text-white block">Standard Free Shipping</span>
                              {estimationResult.status==="serviceable"
                                ? <span className="text-[10px] text-slate-400">{formatDateReadable(estimationResult.minDate)} – {formatDateReadable(estimationResult.maxDate)}</span>
                                : <span className="text-[10px] text-rose-500">Pincode unserviceable</span>}
                            </div>
                          </div>
                          <span className="text-xs font-bold text-white">{estimationResult.status==="serviceable" ? estimationResult.rate : "FREE"}</span>
                        </div>
                        {estimationResult.status==="serviceable" && estimationResult.expressSupported && (
                          <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-800 hover:border-indigo-500/30 transition flex items-center justify-between cursor-pointer">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-amber-600/20 text-amber-400 flex items-center justify-center">🚀</div>
                              <div>
                                <span className="text-xs font-bold text-slate-200 block">Express Air Cargo</span>
                                <span className="text-[10px] text-slate-400">{estimationResult.minDays-1>0?estimationResult.minDays-1:1}–{estimationResult.maxDays-2>1?estimationResult.maxDays-2:2} days</span>
                              </div>
                            </div>
                            <span className="text-xs font-bold text-emerald-400">+ ₹ 150.00</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Analytics */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <h2 className="text-base font-bold text-white flex items-center gap-2"><BarChart2 className="h-5 w-5 text-indigo-400" /> Operational Metrics & Logs</h2>
                        <p className="text-xs text-slate-400">Real-time mock analytics for SLA performance</p>
                      </div>
                      <button onClick={() => { setSearchesCount(4820); setApiFailureCount(48); addLog("Metrics recalibrated.", "info"); }}
                        className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-white">
                        <RefreshCw className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                      {[
                        { label:"Pincode Searches",  value:searchesCount,                                                color:"text-white"       },
                        { label:"Conversion Lift",   value:`+${conversionRate}%`,                                      color:"text-emerald-400" },
                        { label:"Fallback Rate",     value:`${Math.round((apiFailureCount/searchesCount)*1000)/10}%`,  color:"text-amber-400"  },
                        { label:"Cache Speed",       value:"18ms",                                                       color:"text-rose-400"    }
                      ].map(({ label, value, color }) => (
                        <div key={label} className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                          <span className="text-slate-500 text-[10px] uppercase font-bold block">{label}</span>
                          <strong className={`text-2xl font-mono mt-1 block ${color}`}>{value}</strong>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Engine Log</span>
                      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs h-40 overflow-y-auto space-y-2">
                        {logs.map(l => (
                          <div key={l.id} className="flex gap-2.5 items-start">
                            <span className="text-slate-500 shrink-0">{l.time}</span>
                            <span className={`text-[10px] font-bold px-1.5 rounded shrink-0 uppercase ${l.type==='error'?'bg-rose-950 text-rose-400':l.type==='warning'?'bg-amber-950 text-amber-400':'bg-indigo-950 text-indigo-300'}`}>{l.type}</span>
                            <span className="text-slate-300 break-all">{l.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ── DOCS TAB ─────────────────────────────────────────── */}
            {activeTab === 'docs' && (
              <div className="lg:col-span-12 space-y-6">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-indigo-600/20 text-indigo-400 rounded-xl"><Server className="h-6 w-6" /></div>
                    <div>
                      <h2 className="text-lg font-bold text-white">SwiftETA Core Architecture</h2>
                      <p className="text-xs text-slate-400">NestJS microservices · PostgreSQL · Redis · AWS deployment configs</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    High-availability microservices architecture using NestJS (Node.js), TypeScript, PostgreSQL as source of truth, and Redis for sub-50ms SLA caching. Third-party 3PL APIs use the Adapter Pattern for hot-swapping.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-4"><Layers className="h-4 w-4 text-indigo-400" /> NestJS File Layout</h3>
                    <pre className="bg-slate-950 p-4 rounded-xl text-xs font-mono text-slate-300 overflow-x-auto border border-slate-800">{`shipping-eta-engine/
├── src/
│   ├── modules/
│   │   ├── eta/
│   │   │   ├── adapters/
│   │   │   │   ├── shiprocket.adapter.ts
│   │   │   │   ├── nimbuspost.adapter.ts
│   │   │   │   └── delhivery.adapter.ts
│   │   │   ├── eta.service.ts   ← CORE HYBRID LOGIC
│   │   │   └── eta.controller.ts
│   │   └── pincode/
│   │       ├── pincode.service.ts
│   │       └── pincode.entity.ts
│   └── common/
│       ├── interceptors/cache.interceptor.ts
│       └── guards/rate-limiter.guard.ts
├── Dockerfile
└── package.json`}</pre>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-4"><Zap className="h-4 w-4 text-amber-400" /> REST API Contracts</h3>
                    <div className="space-y-4">
                      <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                        <span className="text-[10px] bg-emerald-950 text-emerald-400 font-bold px-2 py-0.5 rounded font-mono">POST /api/v1/shipping/eta</span>
                        <pre className="text-[10px] text-slate-300 font-mono mt-2 bg-slate-900 p-2.5 rounded border border-slate-800">{`{
  "origin_pincode":      "560001",
  "destination_pincode": "560066",
  "weight_grams":         500,
  "enable_express":       true
}`}</pre>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-4"><Database className="h-4 w-4 text-indigo-400" /> PostgreSQL Schemas</h3>
                    <pre className="bg-slate-950 p-4 rounded-xl text-xs font-mono text-slate-300 overflow-x-auto border border-slate-800">{`CREATE TABLE pincode_master (
  pincode   VARCHAR(6) PRIMARY KEY,
  city      VARCHAR(100) NOT NULL,
  state     VARCHAR(100) NOT NULL,
  latitude  DECIMAL(9,6) NOT NULL,
  longitude DECIMAL(9,6) NOT NULL,
  zone      VARCHAR(20)  NOT NULL
);

CREATE TABLE courier_coverage (
  id          SERIAL PRIMARY KEY,
  courier_id  VARCHAR(50) NOT NULL,
  origin_pin  VARCHAR(6)  NOT NULL,
  dest_pin    VARCHAR(6)  NOT NULL,
  sla_days    INT         NOT NULL,
  express     BOOLEAN     DEFAULT FALSE
);`}</pre>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-4"><HardDrive className="h-4 w-4 text-rose-400" /> Redis Cache Design</h3>
                    <div className="space-y-3 text-xs">
                      <p className="text-slate-300">Latency SLA <strong>&lt;50ms</strong> via NestJS interceptor pattern pulling from Redis before any DB call.</p>
                      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono space-y-2">
                        <div><span className="text-indigo-400 text-[10px] block">// TTL</span><code className="text-white">86400 seconds (24h)</code></div>
                        <div><span className="text-indigo-400 text-[10px] block">// Key Pattern</span><code className="text-white">ETA:{'{origin}'}:{'{dest}'}:{'{weight}'}</code></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </>
      )}
    </div>
  );
}
