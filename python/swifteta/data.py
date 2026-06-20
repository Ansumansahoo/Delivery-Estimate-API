"""
swifteta.data
=============
Static reference data: pincode DB, zone table, carriers, holidays.
Swap PINCODE_DB for a real table/API when you need full coverage.
"""
from __future__ import annotations

ORIGIN_PINCODE = "560001"

PINCODE_DB: dict[str, dict] = {
    "560001": {"city": "Bengaluru (MG Road)", "state": "Karnataka", "lat": 12.9716, "lng": 77.5946},
    "560002": {"city": "Bengaluru (Chickpet)", "state": "Karnataka", "lat": 12.9701, "lng": 77.5764},
    "560004": {"city": "Bengaluru (Basavanagudi)", "state": "Karnataka", "lat": 12.9417, "lng": 77.5755},
    "560011": {"city": "Bengaluru (Jayanagar)", "state": "Karnataka", "lat": 12.9299, "lng": 77.5824},
    "560012": {"city": "Bengaluru (Malleshwaram)", "state": "Karnataka", "lat": 12.9961, "lng": 77.5712},
    "560034": {"city": "Bengaluru (Koramangala)", "state": "Karnataka", "lat": 12.9338, "lng": 77.6244},
    "560037": {"city": "Bengaluru (Marathahalli)", "state": "Karnataka", "lat": 12.9562, "lng": 77.6975},
    "560038": {"city": "Bengaluru (Indiranagar)", "state": "Karnataka", "lat": 12.9719, "lng": 77.6412},
    "560056": {"city": "Bengaluru (University/West)", "state": "Karnataka", "lat": 12.9463, "lng": 77.5097},
    "560064": {"city": "Bengaluru (Yelahanka/North)", "state": "Karnataka", "lat": 13.1006, "lng": 77.5963},
    "560066": {"city": "Bengaluru (Whitefield/East)", "state": "Karnataka", "lat": 12.9698, "lng": 77.7500},
    "560078": {"city": "Bengaluru (JP Nagar)", "state": "Karnataka", "lat": 12.9063, "lng": 77.5857},
    "560094": {"city": "Bengaluru (Sanjay Nagar)", "state": "Karnataka", "lat": 13.0300, "lng": 77.5750},
    "560100": {"city": "Bengaluru (Electronic City)", "state": "Karnataka", "lat": 12.8452, "lng": 77.6760},
    "570001": {"city": "Mysuru", "state": "Karnataka", "lat": 12.3087, "lng": 76.6547},
    "575001": {"city": "Mangaluru", "state": "Karnataka", "lat": 12.9141, "lng": 74.8560},
    "576101": {"city": "Udupi", "state": "Karnataka", "lat": 13.3409, "lng": 74.7421},
    "577001": {"city": "Davanagere", "state": "Karnataka", "lat": 14.4644, "lng": 75.9218},
    "577201": {"city": "Shivamogga", "state": "Karnataka", "lat": 13.9299, "lng": 75.5681},
    "580001": {"city": "Hubballi/Dharwad", "state": "Karnataka", "lat": 15.3647, "lng": 75.1240},
    "583101": {"city": "Ballari", "state": "Karnataka", "lat": 15.1394, "lng": 76.9214},
    "585101": {"city": "Kalaburagi", "state": "Karnataka", "lat": 17.3297, "lng": 76.8343},
    "586101": {"city": "Vijayapura", "state": "Karnataka", "lat": 16.8302, "lng": 75.7100},
    "590001": {"city": "Belagavi", "state": "Karnataka", "lat": 15.8497, "lng": 74.4977},
    "572101": {"city": "Tumakuru", "state": "Karnataka", "lat": 13.3400, "lng": 77.1000},
    "571401": {"city": "Mandya", "state": "Karnataka", "lat": 12.5218, "lng": 76.8951},
    "573201": {"city": "Hassan", "state": "Karnataka", "lat": 13.0080, "lng": 76.1018},
    "581301": {"city": "Karwar", "state": "Karnataka", "lat": 14.8080, "lng": 74.1300},
    "110001": {"city": "New Delhi", "state": "Delhi", "lat": 28.6139, "lng": 77.2090},
    "400001": {"city": "Mumbai", "state": "Maharashtra", "lat": 18.9220, "lng": 72.8347},
    "700001": {"city": "Kolkata", "state": "West Bengal", "lat": 22.5726, "lng": 88.3639},
    "600001": {"city": "Chennai", "state": "Tamil Nadu", "lat": 13.0827, "lng": 80.2707},
    "799001": {"city": "Agartala", "state": "Tripura", "lat": 23.8315, "lng": 91.2868},
    "190001": {"city": "Srinagar", "state": "J and K", "lat": 34.0837, "lng": 74.7973},
    "302001": {"city": "Jaipur", "state": "Rajasthan", "lat": 26.9124, "lng": 75.7873},
    "403001": {"city": "Panaji", "state": "Goa", "lat": 15.4909, "lng": 73.8278},
    "500001": {"city": "Hyderabad", "state": "Telangana", "lat": 17.3850, "lng": 78.4867},
}

ZONES: list[dict] = [
    {"zone": 1, "label": "Local",    "max_km": 50,         "days": 1, "base_rate": 35},
    {"zone": 2, "label": "Zonal",    "max_km": 200,        "days": 2, "base_rate": 50},
    {"zone": 3, "label": "Regional", "max_km": 500,        "days": 3, "base_rate": 70},
    {"zone": 4, "label": "Metro",    "max_km": 1000,       "days": 4, "base_rate": 95},
    {"zone": 5, "label": "National", "max_km": 2000,       "days": 5, "base_rate": 120},
    {"zone": 6, "label": "Remote",   "max_km": float("inf"), "days": 7, "base_rate": 150},
]

CARRIERS: list[dict] = [
    {"name": "Delhivery",   "rate_multiplier": 1.00, "days_offset": 0},
    {"name": "BlueDart",    "rate_multiplier": 1.30, "days_offset": -1},
    {"name": "DTDC",        "rate_multiplier": 0.85, "days_offset": 1},
    {"name": "Ekart",       "rate_multiplier": 0.90, "days_offset": 0},
    {"name": "Xpressbees",  "rate_multiplier": 0.95, "days_offset": 0},
]

HOLIDAYS_2026: list[str] = [
    "2026-01-26",
    "2026-03-20",
    "2026-04-02",
    "2026-04-14",
    "2026-05-01",
    "2026-08-15",
    "2026-10-02",
    "2026-10-22",
    "2026-11-11",
    "2026-11-15",
    "2026-12-25",
]
