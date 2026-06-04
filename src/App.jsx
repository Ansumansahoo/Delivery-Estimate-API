import React, { useState, useEffect, useCallback } from 'react';
import {
  Truck, CheckCircle, AlertTriangle, Clock, RefreshCw, BarChart2, Database, Shield, Server, Zap, Search, MapPin,
  Layers, Settings, HardDrive, Info, ArrowRight, TrendingUp, Users, Activity, FileText, ChevronRight, HelpCircle, AlertCircle, Building2
} from 'lucide-react';
import B2BPortal from './B2BPortal.jsx';


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
