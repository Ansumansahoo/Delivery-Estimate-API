"""
swifteta.carriers
=================
SERVER-SIDE live carrier adapter.  Credentials come from environment
variables — never from the browser.

Usage:
    from swifteta.carriers import shiprocket_serviceability

    result = shiprocket_serviceability(
        origin="560001",
        destination="110001",
        weight_kg=2.5,
        token=os.environ["SHIPROCKET_TOKEN"],
    )

The FastAPI gateway (api.py) authenticates once on startup and caches
the token; the browser never sees it.

Dependencies: requests (pip install requests)
"""
from __future__ import annotations
import os
from typing import Optional


def shiprocket_login(email: str, password: str) -> str:
    """Authenticate with Shiprocket and return a Bearer token.

    Raises RuntimeError on failure.
    """
    import requests  # optional dep — only needed for live calls

    resp = requests.post(
        "https://apiv2.shiprocket.in/v1/external/auth/login",
        json={"email": email, "password": password},
        timeout=10,
    )
    data = resp.json()
    if not resp.ok or not data.get("token"):
        raise RuntimeError(f"Shiprocket auth failed: {data.get('message', resp.status_code)}")
    return data["token"]


def shiprocket_serviceability(
    origin: str,
    destination: str,
    weight_kg: float = 0.5,
    cod: bool = False,
    token: Optional[str] = None,
) -> Optional[dict]:
    """
    Call the Shiprocket serviceability API server-side.

    Returns the cheapest available carrier as a dict with keys:
      carrier, days, rate_inr, engine
    or None if unserviceable or request fails.

    token defaults to the SHIPROCKET_TOKEN env-var.
    """
    import requests

    token = token or os.environ.get("SHIPROCKET_TOKEN", "")
    if not token:
        return None

    params = {
        "pickup_postcode": origin,
        "delivery_postcode": destination,
        "weight": str(weight_kg),
        "cod": "1" if cod else "0",
    }
    try:
        resp = requests.get(
            "https://apiv2.shiprocket.in/v1/external/courier/serviceability",
            params=params,
            headers={"Authorization": f"Bearer {token}"},
            timeout=10,
        )
        data = resp.json()
        couriers = data.get("data", {}).get("available_courier_companies", [])
        if not couriers:
            return None
        best = sorted(couriers, key=lambda c: c.get("rate", 99999))[0]
        return {
            "carrier": best.get("courier_name", "Shiprocket"),
            "days": int(best.get("estimated_delivery_days") or 3),
            "rate_inr": int(best.get("rate") or 0),
            "engine": "L1-Shiprocket-Live",
        }
    except Exception:
        return None
