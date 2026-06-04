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
