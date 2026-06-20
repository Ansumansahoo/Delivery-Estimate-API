"""
swifteta.engine
===============
Pure-Python delivery-estimate engine. No framework, no I/O, no globals.
Faithful port of the JS engine with bugs fixed:
  * Rate Engine returns a real price (JS React always showed FREE)
  * Carrier ETD treated as days number, not parsed as a Date
  * No fake Redis flag
"""
from __future__ import annotations
import math
from dataclasses import dataclass, asdict
from datetime import date, timedelta
from typing import Iterable, Optional
from .data import ZONES, CARRIERS, PINCODE_DB, HOLIDAYS_2026

@dataclass
class Estimate:
    status: str
    origin: str = ""
    destination: str = ""
    city: str = ""
    state: str = ""
    distance_km: Optional[int] = None
    zone: str = ""
    carrier: str = ""
    days_min: Optional[int] = None
    days_max: Optional[int] = None
    rate_inr: Optional[int] = None
    min_date: Optional[str] = None
    max_date: Optional[str] = None
    express: bool = False
    cod: bool = False
    error: str = ""

    def to_dict(self) -> dict:
        return asdict(self)


def haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> int:
    r = 6371.0
    d_lat = math.radians(lat2 - lat1)
    d_lon = math.radians(lon2 - lon1)
    a = (
        math.sin(d_lat / 2) ** 2
        + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2))
        * math.sin(d_lon / 2) ** 2
    )
    return round(r * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a)))


def zone_for_distance(km: float) -> dict:
    for z in ZONES:
        if km <= z["max_km"]:
            return z
    return ZONES[-1]


def add_business_days(
    start: date,
    days: int,
    holidays: Iterable[str] = HOLIDAYS_2026,
) -> date:
    holiday_set = set(holidays)
    d, added, guard = start, 0, 0
    while added < days and guard < 365:
        d += timedelta(days=1)
        guard += 1
        if d.weekday() < 5 and d.isoformat() not in holiday_set:
            added += 1
    return d


def is_serviceable(pincode: str) -> bool:
    return pincode in PINCODE_DB


def _rate_inr(base_rate, weight_kg, multiplier, express, cod):
    base = base_rate + weight_kg * 20
    cod_charge = 30 if cod else 0
    exp_mult = 1.6 if express else 1.0
    return round((base * multiplier + cod_charge) * exp_mult)


def quote_carriers(distance_km, weight_kg, express=False, cod=False):
    z = zone_for_distance(distance_km)
    out = []
    for c in CARRIERS:
        days = max(1, z["days"] + c["days_offset"] + (-1 if express else 0))
        rate = _rate_inr(z["base_rate"], weight_kg, c["rate_multiplier"], express, cod)
        out.append({"carrier": c["name"], "days": days, "rate_inr": rate, "zone": z["label"]})
    return sorted(out, key=lambda x: x["rate_inr"])


def estimate(
    origin: str,
    destination: str,
    weight_kg: float = 0.5,
    express: bool = False,
    cod: bool = False,
    today: Optional[date] = None,
) -> Estimate:
    today = today or date.today()
    if not is_serviceable(destination):
        return Estimate(status="unserviceable", destination=destination,
                        error="Destination pincode outside coverage.")
    if not is_serviceable(origin):
        return Estimate(status="unserviceable", origin=origin,
                        error="Origin pincode outside coverage.")
    o, d = PINCODE_DB[origin], PINCODE_DB[destination]
    dist = haversine_km(o["lat"], o["lng"], d["lat"], d["lng"])
    best = quote_carriers(dist, weight_kg, express, cod)[0]
    days_min = best["days"]
    days_max = best["days"] + 1
    if today.weekday() in (4, 5):
        days_min += 1
        days_max += 1
    return Estimate(
        status="serviceable",
        origin=origin, destination=destination,
        city=d["city"], state=d["state"],
        distance_km=dist, zone=best["zone"], carrier=best["carrier"],
        days_min=days_min, days_max=days_max, rate_inr=best["rate_inr"],
        min_date=add_business_days(today, days_min).isoformat(),
        max_date=add_business_days(today, days_max).isoformat(),
        express=express, cod=cod,
    )


def bulk_estimate(
    origin: str,
    orders: list[dict],
    today: Optional[date] = None,
) -> list[dict]:
    rows = []
    for o in orders:
        est = estimate(
            origin=origin,
            destination=str(o["destination"]),
            weight_kg=float(o.get("weight_kg", 0.5)),
            express=bool(o.get("express", False)),
            cod=bool(o.get("cod", False)),
            today=today,
        )
        row = est.to_dict()
        row["id"] = o.get("id")
        rows.append(row)
    return rows
