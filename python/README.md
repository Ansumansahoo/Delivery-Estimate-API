# SwiftETA — Python Package

Pure-Python port of the SwiftETA delivery-estimate engine. Same Haversine->zone->rate->ETA logic as the JS demo, importable from anywhere.

## Why Python?

The JS version runs only inside a browser tab. In Python the same logic is importable from scripts, notebooks, Airflow DAGs, and Jira/Sheets pipelines with no UI and no browser CORS limits.

## Install

```bash
pip install -r requirements.txt
```

The core engine has **zero** third-party dependencies. Only install extras for the interface you use:
- **REST API**: fastapi, uvicorn, pydantic
- **CLI batch tool**: pandas, openpyxl
- **Live carrier calls**: requests

## Three ways to use it

### 1. As a library

```python
from swifteta import estimate, bulk_estimate

r = estimate("560001", "110001", weight_kg=2.5, cod=True)
print(r.days_min, r.days_max, r.rate_inr, r.carrier)
# 7 8 174 DTDC

import pandas as pd
rows = bulk_estimate("560001", [
    {"id": "ORD-001", "destination": "400001", "weight_kg": 1.2},
    {"id": "ORD-002", "destination": "700001", "express": True},
])
pd.DataFrame(rows)   # one row per order, ready for Excel/Sheets/Jira
```

### 2. Batch CLI

```bash
# CSV in -> CSV out
python -m swifteta.cli examples/batch_orders.csv

# Excel in -> Excel out
python -m swifteta.cli orders.xlsx --out estimated.xlsx

# Custom origin
python -m swifteta.cli orders.csv --origin 400001 --out result.csv
```

Input needs a `destination` column; `id`, `weight_kg`, `express`, `cod` are optional.

Output adds: `distance_km`, `zone`, `carrier`, `days_min`, `days_max`, `rate_inr`, `min_date`, `max_date`, `status`.

### 3. REST API

```bash
uvicorn swifteta.api:app --reload --port 8000
```

```bash
# 401 without token
curl localhost:8000/api/b2b/v1/serviceable?pin=560001

# Estimate with demo token
curl -X POST localhost:8000/api/b2b/v1/estimate \
     -H "Authorization: Bearer demo_key" \
     -H "Content-Type: application/json" \
     -d '{"destination":"110001","weight_kg":2.5,"cod":true}'

# Bulk estimate
curl -X POST localhost:8000/api/b2b/v1/bulk-estimate \
     -H "Authorization: Bearer demo_key" \
     -H "Content-Type: application/json" \
     -d '{"orders":[{"id":"1","destination":"400001"},{"id":"2","destination":"700001"}]}'
```

## Package structure

```
python/
  swifteta/
    __init__.py   # exports estimate, bulk_estimate, is_serviceable
    data.py       # pincode DB (37), zones, carriers, holidays — swap for real data
    engine.py     # haversine -> zone -> rate -> business-day ETA (pure, zero deps)
    carriers.py   # live Shiprocket adapter (server-side; creds from env)
    api.py        # FastAPI app: /estimate, /bulk-estimate, /serviceable, /usage
    cli.py        # batch tool: CSV/XLSX in -> estimated file out
  examples/
    batch_orders.csv   # 5-order sample input
  requirements.txt
  README.md
```

## Honest caveats

- **37-pincode demo DB**: for production, replace `PINCODE_DB` in `data.py` with a full India Post pincode table or back `is_serviceable()` with a real serviceability API.
- **In-memory API key store**: `_VALID_KEYS` in `api.py` is for local testing only — replace with a real key store before exposing to the internet.
- **Live carrier calls**: `carriers.py` needs `SHIPROCKET_TOKEN` in the environment. Obtain it via `shiprocket_login(email, password)`.
