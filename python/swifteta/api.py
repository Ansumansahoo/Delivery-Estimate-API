"""
swifteta.api
============
FastAPI REST gateway. Implements the exact routes the README/SDK document.
No carrier credentials ever reach the browser -- they live here server-side.

Run it:
    pip install fastapi uvicorn
    uvicorn swifteta.api:app --reload --port 8000

Test it:
    # 401 without token
    curl localhost:8000/api/b2b/v1/serviceable?pin=560001
    # 200 with demo token
    curl -X POST localhost:8000/api/b2b/v1/estimate \
         -H "Authorization: Bearer demo_key" \
         -H "Content-Type: application/json" \
         -d '{"destination":"110001","weight_kg":2.5,"cod":true}'
"""
from __future__ import annotations

from fastapi import FastAPI, Header, HTTPException
from pydantic import BaseModel, Field
from typing import Optional

from .engine import estimate as _estimate, bulk_estimate as _bulk, is_serviceable
from .data import ORIGIN_PINCODE

app = FastAPI(
    title="SwiftETA API",
    version="1.0.0",
    description="India delivery-estimate engine. See python/README.md for docs.",
)

# ---------------------------------------------------------------------------
# Auth: replace with a real key store (DB / env) before exposing to internet
# ---------------------------------------------------------------------------
_VALID_KEYS: set[str] = {"demo_key", "sweta_test_local"}
_usage: dict[str, int] = {}


def _auth(authorization: Optional[str]) -> str:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(401, "ERR_AUTH: missing bearer token")
    key = authorization.split(" ", 1)[1]
    if key not in _VALID_KEYS:
        raise HTTPException(401, "ERR_AUTH: invalid API key")
    _usage[key] = _usage.get(key, 0) + 1
    return key


# ---------------------------------------------------------------------------
# Request models
# ---------------------------------------------------------------------------

class EstimateReq(BaseModel):
    origin: str = ORIGIN_PINCODE
    destination: str
    weight_kg: float = 0.5
    express: bool = False
    cod: bool = False


class Order(BaseModel):
    id: str = ""
    destination: str
    weight_kg: float = 0.5
    express: bool = False
    cod: bool = False


class BulkReq(BaseModel):
    origin: str = ORIGIN_PINCODE
    orders: list[Order] = Field(..., max_length=100)


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@app.post("/api/b2b/v1/estimate")
def post_estimate(body: EstimateReq, authorization: str = Header(None)):
    _auth(authorization)
    return _estimate(
        body.origin, body.destination,
        body.weight_kg, body.express, body.cod,
    ).to_dict()


@app.post("/api/b2b/v1/bulk-estimate")
def post_bulk(body: BulkReq, authorization: str = Header(None)):
    _auth(authorization)
    results = _bulk(body.origin, [o.model_dump() for o in body.orders])
    return {"results": results, "processed": len(results)}


@app.get("/api/b2b/v1/serviceable")
def get_serviceable(pin: str, authorization: str = Header(None)):
    _auth(authorization)
    return {"pincode": pin, "serviceable": is_serviceable(pin)}


@app.get("/api/b2b/v1/usage")
def get_usage(authorization: str = Header(None)):
    key = _auth(authorization)
    return {"api_key": key[:8] + "...", "calls": _usage.get(key, 0)}


@app.get("/health")
def health():
    return {"status": "ok", "version": app.version}
