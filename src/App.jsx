import React, { useState, useEffect, useCallback } from 'react';
import {
  Truck, CheckCircle, AlertTriangle, Clock, RefreshCw, BarChart2, Database, Shield, Server, Zap, Search, MapPin,
  Layers, Settings, HardDrive, Info, ArrowRight, TrendingUp, Users, Activity, FileText, ChevronRight, HelpCircle, AlertCircle
} from 'lucide-react';

const ORIGIN_PINCODE = "560001";

const PINCODE_DATABASE = {
  "560001": { pincode: "560001", city: "Bengaluru (MG Road/Central)", state: "Karnataka", lat: 12.9716, lng: 77.5946, tier: "Tier 1", isMetro: true, isRemote: false, isNorthEast: false },
  "560002": { pincode: "560002", city: "Bengaluru (Chickpet)", state: "Karnataka", lat: 12.9701, lng: 77.5764, tier: "Tier 1", isMetro: true, isRemote: false, isNorthEast: false },
  "560004": { pincode: "560004", city: "Bengaluru (Basavanagudi)", state: "Karnataka", lat: 12.9417, lng: 77.5755, tier: "Tier 1", isMetro: true, isRemote: false, isNorthEast: false },
  "560011": { pincode: "560011", city: "Bengaluru (Jayanagar)", state: "Karnataka", lat: 12.9299, lng: 77.5824, tier: "Tier 1", isMetro: true, isRemote: false, isNorthEast: false },
  "560012": { pincode: "560012", city: "Bengaluru (Malleshwaram)", state: "Karnataka", lat: 12.9961, lng: 77.5712, tier: "Tier 1", isMetro: true, isRemote: false, isNorthEast: false },
  "560034": { pincode: "560034", city: "Bengaluru (Koramangala)", state: "Karnataka", lat: 12.9338, lng: 77.6244, tier: "Tier 1", isMetro: true, isRemote: false, isNorthEast: false },
  "560037": { pincode: "560037", city: "Bengaluru (Marathahalli)", state: "Karnataka", lat: 12.9562, lng: 77.6975, tier: "Tier 1", isMetro: true, isRemote: false, isNorthEast: false },
  "560038": { pincode: "560038", city: "Bengaluru (Indiranagar)", state: "Karnataka", lat: 12.9719, lng: 77.6412, tier: "Tier 1", isMetro: true, isRemote: false, isNorthEast: false },
  "560056": { pincode: "560056", city: "Bengaluru (Bangalore University/West)", state: "Karnataka", lat: 12.9463, lng: 77.5097, tier: "Tier 1", isMetro: true, isRemote: false, isNorthEast: false },
  "560064": { pincode: "560064", city: "Bengaluru (Yelahanka/North)", state: "Karnataka", lat: 13.1006, lng: 77.5963, tier: "Tier 1", isMetro: true, isRemote: false, isNorthEast: false },
  "560066": { pincode: "560066", city: "Bengaluru (Whitefield/East)", state: "Karnataka", lat: 12.9698, lng: 77.75, tier: "Tier 1", isMetro: true, isRemote: false, isNorthEast: false },
  "560078": { pincode: "560078", city: "Bengaluru (JP Nagar)", state: "Karnataka", lat: 12.9063, lng: 77.5857, tier: "Tier 1", isMetro: true, isRemote: false, isNorthEast: false },
  "560094": { pincode: "560094", city: "Bengaluru (Sanjay Nagar)", state: "Karnataka", lat: 13.03, lng: 77.575, tier: "Tier 1", isMetro: true, isRemote: false, isNorthEast: false },
  "560100": { pincode: "560100", city: "Bengaluru (Electronic City)", state: "Karnataka", lat: 12.8452, lng: 77.676, tier: "Tier 1", isMetro: true, isRemote: false, isNorthEast: false },
  "570001": { pincode: "570001", city: "Mysuru", state: "Karnataka", lat: 12.3087, lng: 76.6547, tier: "Tier 2", isMetro: false, isRemote: false, isNorthEast: false },
  "575001": { pincode: "575001", city: "Mangaluru", state: "Karnataka", lat: 12.9141, lng: 74.856, tier: "Tier 2", isMetro: false, isRemote: false, isNorthEast: false },
  "576101": { pincode: "576101", city: "Udupi", state: "Karnataka", lat: 13.3409, lng: 74.7421, tier: "Tier 2", isMetro: false, isRemote: false, isNorthEast: false },
  "577001": { pincode: "577001", city: "Davanagere", state: "Karnataka", lat: 14.4644, lng: 75.9218, tier: "Tier 2", isMetro: false, isRemote: false, isNorthEast: false },
  "577201": { pincode: "577201", city: "Shivamogga", state: "Karnataka", lat: 13.9299, lng: 75.5681, tier: "Tier 2", isMetro: false, isRemote: false, isNorthEast: false },
  "580001": { pincode: "580001", city: "Hubballi / Dharwad", state: "Karnataka", lat: 15.3647, lng: 75.124, tier: "Tier 2", isMetro: false, isRemote: false, isNorthEast: false },
  "583101": { pincode: "583101", city: "Ballari", state: "Karnataka", lat: 15.1394, lng: 76.9214, tier: "Tier 2", isMetro: false, isRemote: false, isNorthEast: false },
  "585101": { pincode: "585101", city: "Kalaburagi (Gulbarga)", state: "Karnataka", lat: 17.3297, lng: 76.8343, tier: "Tier 3", isMetro: false, isRemote: false, isNorthEast: false },
  "586101": { pincode: "586101", city: "Vijayapura (Bijapur)", state: "Karnataka", lat: 16.8302, lng: 75.71, tier: "Tier 3", isMetro: false, isRemote: false, isNorthEast: false },
  "590001": { pincode: "590001", city: "Belagavi", state: "Karnataka", lat: 15.8497, lng: 74.4977, tier: "Tier 2", isMetro: false, isRemote: false, isNorthEast: false },
  "572101": { pincode: "572101", city: "Tumakuru", state: "Karnataka", lat: 13.34, lng: 77.1, tier: "Tier 2", isMetro: false, isRemote: false, isNorthEast: false },
  "571401": { pincode: "571401", city: "Mandya", state: "Karnataka", lat: 12.5218, lng: 76.8951, tier: "Tier 2", isMetro: false, isRemote: false, isNorthEast: false },
  "573201": { pincode: "573201", city: "Hassan", state: "Karnataka", lat: 13.008, lng: 76.1018, tier: "Tier 2", isMetro: false, isRemote: false, isNorthEast: false },
  "581301": { pincode: "581301", city: "Karwar", state: "Karnataka", lat: 14.808, lng: 74.13, tier: "Tier 3", isMetro: false, isRemote: true, isNorthEast: false },
  "110001": { pincode: "110001", city: "New Delhi", state: "Delhi", lat: 28.6139, lng: 77.209, tier: "Tier 1", isMetro: true, isRemote: false, isNorthEast: false },
  "400001": { pincode: "400001", city: "Mumbai", state: "Maharashtra", lat: 18.922, lng: 72.8347, tier: "Tier 1", isMetro: true, isRemote: false, isNorthEast: false },
  "700001": { pincode: "700001", city: "Kolkata", state: "West Bengal", lat: 22.5726, lng: 88.3639, tier: "Tier 1", isMetro: true, isRemote: false, isNorthEast: false },
  "600001": { pincode: "600001", city: "Chennai", state: "Tamil Nadu", lat: 13.0827, lng: 80.2707, tier: "Tier 1", isMetro: true, isRemote: false, isNorthEast: false },
  "799001": { pincode: "799001", city: "Agartala", state: "Tripura", lat: 23.8315, lng: 91.2868, tier: "Tier 3", isMetro: false, isRemote: true, isNorthEast: true },
  "190001": { pincode: "190001", city: "Srinagar", state: "Jammu & Kashmir", lat: 34.0837, lng: 74.7973, tier: "Tier 3", isMetro: false, isRemote: true, isNorthEast: false },
  "302001": { pincode: "302001", city: "Jaipur", state: "Rajasthan", lat: 26.9124, lng: 75.7873, tier: "Tier 2", isMetro: false, isRemote: false, isNorthEast: false },
  "403001": { pincode: "403001", city: "Panaji", state: "Goa", lat: 15.4909, lng: 73.8278, tier: "Tier 2", isMetro: false, isRemote: false, isNorthEast: false },
  "500001": { pincode: "500001", city: "Hyderabad", state: "Telangana", lat: 17.385, lng: 78.4867, tier: "Tier 1", isMetro: true, isRemote: false, isNorthEast: false }
};

const COURIER_PARTNERS = [
  { id: 'shiprocket', name: 'Shiprocket Air', baseSpeedMultiplier: 0.9, baseSlaDays: 3, reliability: 0.96, rating: 4.5, expressSupported: true },
  { id: 'nimbus', name: 'NimbusPost Premium', baseSpeedMultiplier: 1.0, baseSlaDays: 4, reliability: 0.93, rating: 4.2, expressSupported: true },
  { id: 'delhivery', name: 'Delhivery Surface', baseSpeedMultiplier: 1.2, baseSlaDays: 5, reliability: 0.91, rating: 4.0, expressSupported: false }
];

const HOLIDAYS = [
  "2026-01-26",
  "2026-08-15",
  "2026-10-02",
  "2026-12-25"
];

function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

function getDistanceBracket(distKm) {
  if (distKm <= 50)   return { label: "0–50 km (Same City/Local)",          factor: 1.0 };
  if (distKm <= 200)  return { label: "50–200 km (Intra-State/Close)",       factor: 1.2 };
  if (distKm <= 500)  return { label: "200–500 km (Neighbor State)",          factor: 1.5 };
  if (distKm <= 1000) return { label: "500–1000 km (Medium Distance)",        factor: 1.8 };
  return               { label: "1000+ km (Cross-Country)",                   factor: 2.3 };
}

function calculateBusinessDaysOffset(startDate, daysOffset) {
  let currentDate = new Date(startDate);
  let addedDays = 0;
  let checks = 0;
  while (addedDays < daysOffset && checks < 50) {
    currentDate.setDate(currentDate.getDate() + 1);
    const dayOfWeek = currentDate.getDay();
    const formattedDate = currentDate.toISOString().split('T')[0];
    const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);
    const isHoliday = HOLIDAYS.includes(formattedDate);
    if (!isWeekend && !isHoliday) addedDays++;
    checks++;
  }
  return currentDate;
}

function formatDateReadable(date) {
  if (!date || !(date instanceof Date)) return "N/A";
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

export default function App() {
  const [activeTab, setActiveTab] = useState('simulation');
  const [destinationPincode, setDestinationPincode] = useState('560066');
  const [expressOption, setExpressOption] = useState(false);

  const [isEngineLoading, setIsEngineLoading] = useState(false);
  const [useRealShiprocket, setUseRealShiprocket] = useState(false);
  const [shiprocketEmail, setShiprocketEmail] = useState('');
  const [shiprocketPassword, setShiprocketPassword] = useState('');
  const [secureToken, setSecureToken] = useState('');

  const [apiShiprocketUp, setApiShiprocketUp] = useState(true);
  const [apiNimbusUp, setApiNimbusUp] = useState(true);
  const [apiDelhiveryUp, setApiDelhiveryUp] = useState(false);
  const [enableRedisCache, setEnableRedisCache] = useState(true);

  const [searchesCount, setSearchesCount] = useState(4820);
  const [apiFailureCount, setApiFailureCount] = useState(48);
  const [conversionRate] = useState(3.4);
  const [estimationResult, setEstimationResult] = useState({
    status: "unserviceable",
    error: "Please configure settings or search a valid pincode."
  });
  const [logs, setLogs] = useState([
    { id: 1, time: "11:51:24", type: "info",    text: "Redis initialization completed successfully." },
    { id: 2, time: "11:52:05", type: "info",    text: "Shiprocket Adapter verified online (Endpoint healthcheck OK)" },
    { id: 3, time: "11:52:06", type: "warning", text: "Delhivery Adapter reported partial timeout. Fallback enabled." }
  ]);

  const addLog = useCallback((text, type = "info") => {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    setLogs(prev => [{ id: Date.now(), time: timeStr, type, text }, ...prev.slice(0, 49)]);
  }, []);

  // ── Level 1: Real Shiprocket serviceability call ──────────────────────────
  const executeRealShiprocketSLA = async (targetPin, tokenToUse) => {
    try {
      addLog("Sending fetch query to Shiprocket SLA serviceability endpoint...", "info");
      const response = await fetch(
        'https://apiv2.shiprocket.in/v1/external/courier/serviceability?' +
          new URLSearchParams({
            pickup_postcode:   ORIGIN_PINCODE,
            delivery_postcode: targetPin,
            weight:            '0.5',
            cod:               '0'
          }),
        {
          method:  'GET',
          headers: {
            'Content-Type':  'application/json',
            'Authorization': `Bearer ${tokenToUse}`
          }
        }
      );
      if (!response.ok) throw new Error(`HTTP Error Status: ${response.status}`);
      const resData = await response.json();
      if (
        resData &&
        resData.status === 200 &&
        resData.data &&
        resData.data.available_courier_companies
      ) {
        const topCourier = resData.data.available_courier_companies[0];
        if (topCourier) {
          addLog("Real Shiprocket API returned serviceability matrix successfully.", "info");
          return {
            carrierName: topCourier.courier_name || "Shiprocket Air",
            etd:         topCourier.etd           || "",
            rate:        topCourier.rate           || "120.00"
          };
        }
      }
      throw new Error("Pincode unserviceable on Shiprocket platform.");
    } catch (err) {
      addLog("CORS / Network block on Shiprocket endpoint. Reverting cleanly...", "warning");
      throw err;
    }
  };

  // ── Main ETA Orchestrator ─────────────────────────────────────────────────
  const computeShippingETA = useCallback(async () => {
    if (!destinationPincode || !PINCODE_DATABASE[destinationPincode] || destinationPincode.length !== 6) {
      setEstimationResult({ status: "unserviceable", error: "Entered pincode is currently outside our service network." });
      return;
    }

    setIsEngineLoading(true);

    const dest   = PINCODE_DATABASE[destinationPincode];
    const origin = PINCODE_DATABASE[ORIGIN_PINCODE];

    const distanceKm = calculateHaversineDistance(origin.lat, origin.lng, dest.lat, dest.lng);
    const bracket    = getDistanceBracket(distanceKm);

    const isSameCity  = (origin.pincode.substring(0, 3) === dest.pincode.substring(0, 3)) || (distanceKm < 45);
    const isSameState = (origin.state === dest.state);

    let zoneClassification = "Zonal";
    if      (isSameCity)                         zoneClassification = "Local (Same City)";
    else if (isSameState)                         zoneClassification = "Regional (Same State)";
    else if (dest.isNorthEast)                    zoneClassification = "Special (North-East)";
    else if (dest.isRemote)                       zoneClassification = "Special (Remote Area)";
    else if (origin.isMetro && dest.isMetro)      zoneClassification = "National (Metro to Metro)";
    else                                          zoneClassification = "National (Zone Outer)";

    let selectedEngine   = "";
    let primaryCarrier   = "";
    let baseDaysEstimate = 3;
    const expressAllowed = !dest.isRemote;
    let confidence       = 98;
    let rateAmount       = "FREE";

    const cacheFound = enableRedisCache
      ? parseInt(destinationPincode, 10) % 2 === 0
      : false;

    // ── Level 1: Real Shiprocket API ─────────────────────────────────────
    let level1Success = false;
    if (useRealShiprocket && secureToken) {
      try {
        const liveResult = await executeRealShiprocketSLA(dest.pincode, secureToken);
        selectedEngine = "Level 1: Live Shiprocket API Instance (Production Hub)";
        primaryCarrier = liveResult.carrierName;
        rateAmount     = `₹ ${liveResult.rate}`;
        if (liveResult.etd) {
          const etdDate = new Date(liveResult.etd);
          const rawDays = Math.ceil((etdDate.getTime() - new Date().getTime()) / (1000 * 3600 * 24));
          baseDaysEstimate = Math.max(1, rawDays);
        } else {
          baseDaysEstimate = 3;
        }
        confidence    = 99;
        level1Success = true;
      } catch {
        addLog("Level 1 real-time fallback activated. Triggering prioritized integration failover...", "warning");
      }
    }

    // ── Level 1 Simulated + Level 2 Fallback ─────────────────────────────
    if (!level1Success) {
      if (apiShiprocketUp) {
        selectedEngine   = "Level 1: Shiprocket API (Primary Simulator)";
        primaryCarrier   = "Shiprocket Air";
        baseDaysEstimate = 3;
        confidence       = 97;
      } else if (apiNimbusUp) {
        selectedEngine   = "Level 1: NimbusPost API (Secondary Fallback)";
        primaryCarrier   = "NimbusPost Premium";
        baseDaysEstimate = 4;
        confidence       = 94;
      } else if (apiDelhiveryUp) {
        selectedEngine   = "Level 1: Delhivery API (Tertiary Fallback)";
        primaryCarrier   = "Delhivery Surface";
        baseDaysEstimate = 5;
        confidence       = 91;
      } else {
        selectedEngine = "Level 2: Internal Rule-Based Core";
        primaryCarrier = "Local Post Multi-Carrier Ground";
        confidence     = 88;
        if      (isSameCity)                    baseDaysEstimate = 1;
        else if (isSameState)                   baseDaysEstimate = 2;
        else if (dest.isNorthEast)              baseDaysEstimate = 7;
        else if (dest.isRemote)                 baseDaysEstimate = 8;
        else if (origin.isMetro && dest.isMetro) baseDaysEstimate = 3;
        else                                    baseDaysEstimate = 4;
        if      (distanceKm > 1000) baseDaysEstimate += 1.5;
        else if (distanceKm > 500)  baseDaysEstimate += 0.8;
      }
    }

    let computedMinDays = Math.max(1, Math.floor(baseDaysEstimate * (expressOption ? 0.6 : 1)));
    let computedMaxDays = Math.ceil((baseDaysEstimate + 1.5) * (expressOption ? 0.7 : 1));
    if (computedMaxDays <= computedMinDays) computedMaxDays = computedMinDays + 1;

    let mlAdjustmentNote = "";
    let isWeekendImpact  = false;
    const now        = new Date();
    const dayOfWeek  = now.getDay();
    if (dayOfWeek === 5 || dayOfWeek === 6) {
      computedMinDays   += 1;
      computedMaxDays   += 1;
      isWeekendImpact    = true;
      mlAdjustmentNote   = "ML Layer adjusted +1 day due to imminent weekend processing latency.";
    }

    const targetMinDate = calculateBusinessDaysOffset(now, computedMinDays);
    const targetMaxDate = calculateBusinessDaysOffset(now, computedMaxDays);

    setEstimationResult({
      status:           "serviceable",
      origin:           ORIGIN_PINCODE,
      destination:      dest.pincode,
      city:             dest.city,
      state:            dest.state,
      tier:             dest.tier,
      distanceKm,
      bracket:          bracket.label,
      zone:             zoneClassification,
      engine:           selectedEngine,
      carrier:          primaryCarrier,
      rate:             rateAmount,
      minDays:          computedMinDays,
      maxDays:          computedMaxDays,
      minDate:          targetMinDate,
      maxDate:          targetMaxDate,
      expressSupported: expressAllowed,
      confidence:       expressOption ? Math.max(75, confidence - 8) : confidence,
      isWeekendImpact,
      mlAdjustmentNote,
      cached:           enableRedisCache && cacheFound
    });

    setIsEngineLoading(false);
  }, [
    destinationPincode, apiShiprocketUp, apiNimbusUp, apiDelhiveryUp,
    enableRedisCache, expressOption, useRealShiprocket, secureToken, addLog
  ]);

  // ── Shiprocket Authentication ─────────────────────────────────────────────
  const triggerShiprocketAuthentication = async () => {
    if (!shiprocketEmail || !shiprocketPassword) {
      addLog("Authentication failed: Email and password fields cannot be left empty.", "error");
      return;
    }
    setIsEngineLoading(true);
    addLog(`Initiating connection request to apiv2.shiprocket.in/v1/external/auth/login...`, "info");
    try {
      const response = await fetch('https://apiv2.shiprocket.in/v1/external/auth/login', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email: shiprocketEmail, password: shiprocketPassword })
      });
      if (!response.ok) throw new Error(`Unauthorized. Status code: ${response.status}`);
      const parsed = await response.json();
      if (parsed && parsed.token) {
        setSecureToken(parsed.token);
        setUseRealShiprocket(true);
        addLog("Production token granted. Real Shiprocket instance integration active.", "info");
      } else {
        throw new Error("Response payload lacks dynamic verification token.");
      }
    } catch (err) {
      addLog(`Failed to authenticate with Shiprocket. Using premium sandboxed simulator. (${err.message})`, "error");
      setUseRealShiprocket(false);
    } finally {
      setIsEngineLoading(false);
    }
  };

  useEffect(() => { computeShippingETA(); }, [computeShippingETA]);

  const handlePincodeSearch = (pin) => {
    setDestinationPincode(pin);
    if (PINCODE_DATABASE[pin])    setSearchesCount(prev => prev + 1);
    else if (pin.length === 6)    setApiFailureCount(prev => prev + 1);
  };

  const quickTestPincodes = [
    { code: "560094", label: "Bengaluru Sanjay Nagar (Local Hub)" },
    { code: "560100", label: "Bengaluru Electronic City" },
    { code: "570001", label: "Mysuru District (Intra-State)" },
    { code: "580001", label: "Hubballi North Karnataka" },
    { code: "110001", label: "New Delhi (Metro Route)" },
    { code: "799001", label: "Agartala (Remote / NE)" }
  ];

  // ─────────────────────────────────────────────────────────────────────────
  //  RENDER
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">

      {/* HEADER */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-500/20">
            <Truck className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              SwiftETA{' '}
              <span className="text-xs bg-indigo-500/20 text-indigo-400 font-semibold px-2 py-0.5 rounded-full border border-indigo-500/30">
                Enterprise Grade v2.5
              </span>
            </h1>
            <p className="text-xs text-slate-400">High-Fidelity Shipping SLA, Courier Recommendation & Fallback Engine</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('simulation')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-2 ${activeTab === 'simulation' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Layers className="h-3.5 w-3.5" /> Simulation & Live Apps
          </button>
          <button
            onClick={() => setActiveTab('docs')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-2 ${activeTab === 'docs' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <FileText className="h-3.5 w-3.5" /> Architecture & Spec Docs
          </button>
        </div>
      </header>

      {/* ORIGIN NOTICE */}
      <div className="bg-indigo-950/40 border-b border-indigo-900/50 px-6 py-2.5 flex items-center justify-between text-xs text-indigo-300">
        <span className="flex items-center gap-2">
          <MapPin className="h-3.5 w-3.5 text-indigo-400 animate-bounce" />
          Global Fulfillment Center:{' '}
          <strong className="text-white">Bengaluru Hub ({ORIGIN_PINCODE})</strong>
        </span>
        <span className="hidden md:inline-flex items-center gap-1.5 text-indigo-400 font-medium">
          <Zap className="h-3 w-3 text-amber-400 fill-amber-400" /> Haversine Engine Real-time Active
        </span>
      </div>

      <main className="flex-1 max-w-[1700px] w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ═══════════════════════════════════════════════════════
            TAB 1: SIMULATION
           ═══════════════════════════════════════════════════════ */}
        {activeTab === 'simulation' && (
          <>
            {/* SIDEBAR — 4 cols */}
            <div className="lg:col-span-4 flex flex-col gap-6">

              {/* SIMULATION CONTROL */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Settings className="h-4 w-4 text-indigo-400" /> Simulation Control
                  </h3>
                  <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-md font-mono">Live Toggle</span>
                </div>
                <p className="text-xs text-slate-400 mb-4">
                  Toggle external API health check parameters to see the engine's{' '}
                  <strong>Automatic Level-based Fallback Pattern</strong> in real time.
                </p>

                {/* Live Shiprocket credentials */}
                <div className="space-y-3 mb-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div className="text-xs font-semibold text-slate-300 border-b border-slate-800 pb-1.5 flex justify-between items-center">
                    <span className="flex items-center gap-1 text-indigo-400 font-bold">
                      <Shield className="h-3 w-3" /> Live Shiprocket Integration
                    </span>
                    <span className="text-[10px] bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded uppercase">Level 1 Direct</span>
                  </div>
                  <div className="space-y-2">
                    <input
                      type="email"
                      placeholder="Shiprocket Account Email"
                      value={shiprocketEmail}
                      onChange={e => setShiprocketEmail(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg py-1.5 px-2.5 text-xs outline-none focus:border-indigo-500 text-slate-200"
                    />
                    <input
                      type="password"
                      placeholder="Shiprocket Password"
                      value={shiprocketPassword}
                      onChange={e => setShiprocketPassword(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg py-1.5 px-2.5 text-xs outline-none focus:border-indigo-500 text-slate-200"
                    />
                    <button
                      onClick={triggerShiprocketAuthentication}
                      disabled={isEngineLoading}
                      className="w-full bg-indigo-600 hover:bg-indigo-500 transition py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 disabled:opacity-50"
                    >
                      {isEngineLoading
                        ? <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                        : <Zap className="h-3.5 w-3.5" />}
                      Sync Real Shiprocket API
                    </button>
                    {secureToken && (
                      <div className="bg-emerald-950/40 border border-emerald-900/50 p-2 rounded text-[10px] text-emerald-400 mt-2">
                        ✓ Connected to Production. Real serviceability checks active on searches.
                      </div>
                    )}
                  </div>
                </div>

                {/* API priority toggles */}
                <div className="space-y-3.5 mb-5 bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div className="text-xs font-semibold text-slate-300 border-b border-slate-800 pb-1.5 mb-2 flex justify-between">
                    <span>Integration Tier (Level 1 APIs)</span>
                    <span className="text-indigo-400">Order Priority</span>
                  </div>
                  {[
                    { label: "Shiprocket Air API",    state: apiShiprocketUp, setter: setApiShiprocketUp, ord: "1st" },
                    { label: "NimbusPost Premium API", state: apiNimbusUp,     setter: setApiNimbusUp,     ord: "2nd" },
                    { label: "Delhivery API",          state: apiDelhiveryUp,  setter: setApiDelhiveryUp,  ord: "3rd" }
                  ].map(({ label, state, setter, ord }) => (
                    <div key={label} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] bg-indigo-950 text-indigo-400 font-bold px-1.5 py-0.5 rounded">{ord}</span>
                        <span className="text-xs font-medium text-slate-200">{label}</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={state} onChange={() => setter(v => !v)} className="sr-only peer" />
                        <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                      </label>
                    </div>
                  ))}
                </div>

                {/* Redis toggle */}
                <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800 mb-4">
                  <div className="text-xs font-semibold text-slate-300 border-b border-slate-800 pb-1.5 mb-2 flex justify-between items-center">
                    <span className="flex items-center gap-1.5 text-rose-400"><HardDrive className="h-3 w-3" /> Redis Cache Layer</span>
                    <span className="text-[10px] bg-rose-950 text-rose-300 px-1.5 py-0.5 rounded">24 Hour SLA</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-medium block text-slate-200">Enable Cache Middleware</span>
                      <span className="text-[10px] text-slate-500 block">Saves 350ms network round-trip overhead</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={enableRedisCache} onChange={() => setEnableRedisCache(v => !v)} className="sr-only peer" />
                      <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-500"></div>
                    </label>
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">Current Status:</span>
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                    <span className="text-xs text-white font-medium">Fallback Ready</span>
                  </div>
                </div>
              </div>

              {/* PINCODE SEARCH */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-4">
                  <Search className="h-4 w-4 text-indigo-400" /> Pincode Simulator
                </h3>
                <p className="text-xs text-slate-400 mb-4">
                  Type any Karnataka/Bengaluru pincode below or select from our rich geographical presets.
                </p>
                <div className="relative mb-4">
                  <input
                    type="text"
                    placeholder="Enter 6-digit Pincode (e.g. 560094)"
                    value={destinationPincode}
                    onChange={e => {
                      const val = e.target.value.replace(/\D/g, '').substring(0, 6);
                      setDestinationPincode(val);
                      if (val.length === 6) handlePincodeSearch(val);
                    }}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 pl-10 text-sm text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                  />
                  <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                  {destinationPincode.length > 0 && destinationPincode.length < 6 && (
                    <span className="absolute right-3 top-3 text-[10px] text-amber-500 bg-amber-500/10 px-2 py-1 rounded">Entering...</span>
                  )}
                  {destinationPincode.length === 6 && estimationResult.status === "unserviceable" && (
                    <span className="absolute right-3 top-3 text-[10px] text-rose-500 bg-rose-500/10 px-2 py-1 rounded">Unserviceable</span>
                  )}
                  {destinationPincode.length === 6 && estimationResult.status === "serviceable" && (
                    <span className="absolute right-3 top-3 text-[10px] text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded">Valid Zone</span>
                  )}
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Karnataka Preset Hubs:</span>
                  <div className="max-h-[220px] overflow-y-auto space-y-1.5 pr-1">
                    {quickTestPincodes.map(item => (
                      <button
                        key={item.code}
                        onClick={() => handlePincodeSearch(item.code)}
                        className={`w-full text-left p-2 rounded-lg border text-[11px] flex justify-between items-center transition-all ${destinationPincode === item.code ? 'bg-indigo-600/20 border-indigo-500 text-white font-medium' : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'}`}
                      >
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

              {/* MATH ENGINE METRICS */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex-1">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-3">
                  <Database className="h-4 w-4 text-indigo-400" /> Math Engine Metrics
                </h3>
                {estimationResult.status === "serviceable" ? (
                  <div className="space-y-3.5 text-xs">
                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                      <span className="text-slate-400 block text-[10px] uppercase">Haversine Distance</span>
                      <strong className="text-lg text-white font-mono block mt-1">{estimationResult.distanceKm} km</strong>
                      <span className="text-xs text-indigo-400">{estimationResult.bracket}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                        <span className="text-slate-400 block text-[10px] uppercase">Zone Code</span>
                        <strong className="text-slate-200 block font-mono mt-0.5 text-xs">{estimationResult.zone}</strong>
                      </div>
                      <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                        <span className="text-slate-400 block text-[10px] uppercase">Region Tier</span>
                        <strong className="text-slate-200 block mt-0.5 text-xs">{estimationResult.tier}</strong>
                      </div>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-slate-400 text-[10px] uppercase">Algorithm Engine Path</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${estimationResult.engine.includes('Level 1') ? 'bg-emerald-950 text-emerald-400' : 'bg-amber-950 text-amber-400'}`}>
                          {estimationResult.engine.includes('Level 1') ? 'API-driven' : 'Fallback System'}
                        </span>
                      </div>
                      <p className="text-white font-mono text-xs">{estimationResult.engine}</p>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 text-[10px] uppercase">Redis Hit State</span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${estimationResult.cached ? 'bg-rose-950 text-rose-300' : 'bg-slate-900 text-slate-500'}`}>
                          {estimationResult.cached ? 'HIT (Stale Served)' : 'MISS (DB Query)'}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 mt-1 block">
                        Cache key: <code className="text-slate-300">ETA:{ORIGIN_PINCODE}:{destinationPincode}</code>
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 bg-slate-950 rounded-xl border border-dashed border-slate-800 text-slate-500 text-xs">
                    Select a valid serviceable pincode to display distance/zone matrix.
                  </div>
                )}
              </div>
            </div>

            {/* MAIN CONTENT AREA — 8 cols */}
            <div className="lg:col-span-8 flex flex-col gap-6">

              {/* THREE LIVE VIEWS */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                <div className="flex justify-between items-center border-b border-slate-800 pb-4 mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <Layers className="h-5 w-5 text-indigo-400 animate-pulse" /> Interactive User Flow Views
                    </h2>
                    <p className="text-xs text-slate-400">SwiftETA integration at each critical stage of the buyer checkout lifecycle</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-xs bg-slate-800 px-3 py-1.5 rounded-lg font-mono text-slate-300">Origin: {ORIGIN_PINCODE}</span>
                    <span className="text-xs bg-slate-800 px-3 py-1.5 rounded-lg font-mono text-slate-300">Target: {destinationPincode || "---"}</span>
                  </div>
                </div>

                {/* VIEW 1: Product Detail Page */}
                <div className="border border-slate-800 rounded-2xl bg-slate-950 p-5 mb-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-indigo-600/10 border-l border-b border-indigo-500/20 px-3 py-1 rounded-bl-xl text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
                    1. Product Detail Page Widget
                  </div>
                  <h4 className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 inline-block"></span> PDP Shipping Estimator Box
                  </h4>
                  <div className="max-w-md bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-md">
                    <div className="flex gap-3 mb-4 border-b border-slate-800 pb-3">
                      <div className="w-12 h-12 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-white font-bold text-lg">💻</div>
                      <div>
                        <span className="text-slate-400 text-[10px] block uppercase font-semibold">Premium Electronics Category</span>
                        <h5 className="text-sm font-semibold text-white">Quantum Developer Ultrabook v4</h5>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="block text-xs font-medium text-slate-300">Deliver to</label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <input
                            type="text"
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2 px-3 pl-8 text-xs text-slate-200 outline-none focus:ring-1 focus:ring-indigo-500"
                            placeholder="Enter 6-Digit PIN"
                            value={destinationPincode}
                            onChange={e => {
                              const val = e.target.value.replace(/\D/g, '').substring(0, 6);
                              setDestinationPincode(val);
                              if (val.length === 6) handlePincodeSearch(val);
                            }}
                          />
                          <MapPin className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-indigo-400" />
                        </div>
                        <button
                          onClick={computeShippingETA}
                          className="bg-indigo-600 hover:bg-indigo-500 transition px-4 py-2 rounded-lg text-xs font-semibold text-white flex items-center gap-1"
                        >
                          {isEngineLoading && <RefreshCw className="h-3 w-3 animate-spin" />}
                          Check SLA
                        </button>
                      </div>

                      {isEngineLoading ? (
                        <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-5 flex flex-col items-center justify-center space-y-3">
                          <RefreshCw className="h-8 w-8 text-indigo-500 animate-spin" />
                          <span className="text-xs text-slate-400 font-medium">Resolving Integration Fallback Chain...</span>
                        </div>
                      ) : estimationResult.status === "serviceable" ? (
                        <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-emerald-400 flex items-center gap-1.5 font-semibold">
                              <CheckCircle className="h-4 w-4 fill-emerald-950 text-emerald-400" /> ✓ Delivery Available
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">{estimationResult.city}, {estimationResult.state}</span>
                          </div>
                          <div className="pt-1.5 border-t border-slate-800">
                            <span className="text-[10px] text-slate-400 uppercase block">Estimated Delivery Timeline:</span>
                            <strong className="text-sm text-white font-bold">{estimationResult.minDays} – {estimationResult.maxDays} Business Days</strong>
                            <p className="text-[11px] text-indigo-300 font-medium mt-0.5">
                              Expected Arrival: {formatDateReadable(estimationResult.minDate)} – {formatDateReadable(estimationResult.maxDate)}
                            </p>
                          </div>
                          {estimationResult.expressSupported ? (
                            <div className="flex items-center justify-between pt-2 border-t border-slate-800 bg-indigo-950/20 p-2 rounded mt-1">
                              <div className="flex items-center gap-1.5">
                                <span className="p-1 bg-amber-500/10 text-amber-400 rounded">🚀</span>
                                <div>
                                  <span className="text-[10px] text-slate-200 font-semibold block">Express Shipping Available</span>
                                  <span className="text-[9px] text-slate-400">Reduce timeline to 1-2 days</span>
                                </div>
                              </div>
                              <input
                                type="checkbox"
                                checked={expressOption}
                                onChange={e => setExpressOption(e.target.checked)}
                                className="rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-indigo-500"
                              />
                            </div>
                          ) : (
                            <div className="bg-slate-900 p-2 rounded text-[10px] text-slate-400 mt-1">
                              ⚠️ Express is unavailable for remote and Northeast locations.
                            </div>
                          )}
                          <div className="flex justify-between items-center text-[10px] pt-1 border-t border-slate-900">
                            <span className="text-slate-500">Confidence Match Rate</span>
                            <span className="text-indigo-400 font-bold font-mono">{estimationResult.confidence}% Confidence Index</span>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-rose-950/10 border border-rose-900/30 rounded-lg p-3 text-xs text-rose-300 flex items-start gap-2">
                          <AlertTriangle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-semibold block">Shipping Restricted</span>
                            <span className="text-[10px] text-slate-400">
                              No active courier partners serviceable to pincode <strong>{destinationPincode || "---"}</strong>. Please enter another pin.
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* VIEW 2: Cart Summary */}
                <div className="border border-slate-800 rounded-2xl bg-slate-950 p-5 mb-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-indigo-600/10 border-l border-b border-indigo-500/20 px-3 py-1 rounded-bl-xl text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
                    2. Shopping Cart Estimator Panel
                  </div>
                  <h4 className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 inline-block"></span> Cart Summary Delivery Window
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-between">
                      <div>
                        <span className="text-slate-400 text-[10px] uppercase font-semibold">Subtotal Items (1)</span>
                        <div className="text-white font-bold text-lg mt-1">₹ 89,990.00</div>
                        <span className="text-[10px] text-slate-500 block mt-0.5">Shipping charges calculated below</span>
                      </div>
                      {estimationResult.status === "serviceable" ? (
                        <div className="bg-slate-950 border border-slate-800 p-2.5 rounded-lg mt-4 text-[11px] space-y-1">
                          <div className="flex justify-between text-slate-300">
                            <span>Earliest Arrival:</span>
                            <strong className="text-white font-medium">{formatDateReadable(estimationResult.minDate)}</strong>
                          </div>
                          <div className="flex justify-between text-slate-300">
                            <span>Latest Arrival:</span>
                            <strong className="text-white font-medium">{formatDateReadable(estimationResult.maxDate)}</strong>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs text-rose-400 text-center mt-4">
                          Enter serviceable pincode to unlock cart rates.
                        </div>
                      )}
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
                      <span className="text-slate-400 text-[10px] uppercase font-semibold block">Smart Logistics Route Details</span>
                      {estimationResult.status === "serviceable" ? (
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between items-center bg-slate-950 p-2 rounded border border-slate-800">
                            <span className="text-slate-400">Allocated Partner:</span>
                            <span className="text-indigo-400 font-bold">{estimationResult.carrier}</span>
                          </div>
                          <div className="flex justify-between items-center bg-slate-950 p-2 rounded border border-slate-800">
                            <span className="text-slate-400">Transit Zones:</span>
                            <span className="text-white">{estimationResult.zone}</span>
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {estimationResult.isWeekendImpact && (
                              <span className="text-amber-400 block font-medium">✨ {estimationResult.mlAdjustmentNote}</span>
                            )}
                            <span className="block mt-1">
                              Estimated Days: <strong className="text-indigo-300">{estimationResult.minDays}–{estimationResult.maxDays} days</strong>
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="py-6 text-center text-slate-500 text-xs">Pending checkout coordinates</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* VIEW 3: Checkout SLA */}
                <div className="border border-slate-800 rounded-2xl bg-slate-950 p-5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-indigo-600/10 border-l border-b border-indigo-500/20 px-3 py-1 rounded-bl-xl text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
                    3. Final Checkout Commitment Summary
                  </div>
                  <h4 className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 inline-block"></span> Checkout Shipping SLA Option
                  </h4>
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                    <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">Select Shipping Method</span>
                    <div className="space-y-2 mt-3">
                      <div className="p-3 bg-slate-950 rounded-xl border border-indigo-500/30 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold">✓</div>
                          <div>
                            <span className="text-xs font-bold text-white block">Standard Free Shipping</span>
                            {estimationResult.status === "serviceable" ? (
                              <span className="text-[10px] text-slate-400 block">
                                Estimated delivery: {formatDateReadable(estimationResult.minDate)} – {formatDateReadable(estimationResult.maxDate)}
                              </span>
                            ) : (
                              <span className="text-[10px] text-rose-500 block">Pincode unserviceable</span>
                            )}
                          </div>
                        </div>
                        <span className="text-xs font-bold text-white">
                          {estimationResult.status === "serviceable" ? estimationResult.rate : "FREE"}
                        </span>
                      </div>
                      {estimationResult.status === "serviceable" && estimationResult.expressSupported && (
                        <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-800 hover:border-indigo-500/30 transition flex items-center justify-between cursor-pointer">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-amber-600/20 text-amber-400 flex items-center justify-center font-bold">🚀</div>
                            <div>
                              <span className="text-xs font-bold text-slate-200 block">Premium Super-Fast Air Cargo</span>
                              <span className="text-[10px] text-slate-400 block">
                                Guaranteed delivery in{' '}
                                {estimationResult.minDays - 1 > 0 ? estimationResult.minDays - 1 : 1}–
                                {estimationResult.maxDays - 2 > 1 ? estimationResult.maxDays - 2 : 2} days
                              </span>
                            </div>
                          </div>
                          <span className="text-xs font-bold text-emerald-400">+ ₹ 150.00</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* ANALYTICS & LOGGER */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                      <BarChart2 className="h-5 w-5 text-indigo-400" /> Operational Metrics & Logs
                    </h2>
                    <p className="text-xs text-slate-400 font-medium">Real-time mock analytics for SLA performance & error recovery rates</p>
                  </div>
                  <button
                    onClick={() => { setSearchesCount(4820); setApiFailureCount(48); addLog("Dashboard analytics metrics manually recalibrated.", "info"); }}
                    className="text-slate-400 hover:text-white p-2 rounded-lg bg-slate-950 border border-slate-800 transition"
                    title="Recalibrate Data"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <span className="text-slate-500 text-[10px] uppercase font-bold block">Pincode Searches</span>
                    <strong className="text-2xl text-white font-mono mt-1 block">{searchesCount}</strong>
                    <span className="text-[9px] text-indigo-400 mt-1 block">Live simulator sessions</span>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <span className="text-slate-500 text-[10px] uppercase font-bold block">Conversion Lift</span>
                    <strong className="text-2xl text-emerald-400 font-mono mt-1 block">+{conversionRate}%</strong>
                    <span className="text-[9px] text-slate-500 mt-1 block">Via trust SLA badge</span>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <span className="text-slate-500 text-[10px] uppercase font-bold block">Internal Fallback Rate</span>
                    <strong className="text-2xl text-amber-400 font-mono mt-1 block">
                      {Math.round((apiFailureCount / searchesCount) * 100 * 10) / 10}%
                    </strong>
                    <span className="text-[9px] text-slate-500 mt-1 block">Level 2 usage frequency</span>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <span className="text-slate-500 text-[10px] uppercase font-bold block">Cache Response Speed</span>
                    <strong className="text-2xl text-rose-400 font-mono mt-1 block">18ms</strong>
                    <span className="text-[9px] text-slate-500 mt-1 block">Redis lookups average</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-300 block uppercase tracking-wider">Engine Log Monitor (Standard Output)</span>
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs h-40 overflow-y-auto space-y-2">
                    {logs.map(logEntry => (
                      <div key={logEntry.id} className="flex gap-2.5 items-start">
                        <span className="text-slate-500 shrink-0 text-[11px]">{logEntry.time}</span>
                        <span className={`text-[10px] font-bold px-1.5 rounded shrink-0 uppercase ${
                          logEntry.type === 'error'   ? 'bg-rose-950 text-rose-400'   :
                          logEntry.type === 'warning' ? 'bg-amber-950 text-amber-400' :
                          'bg-indigo-950 text-indigo-300'
                        }`}>{logEntry.type}</span>
                        <span className="text-slate-300 break-all">{logEntry.text}</span>
                      </div>
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-500 block text-right italic">Active in-memory simulation tracking updates immediately</span>
                </div>
              </div>
            </div>
          </>
        )}
