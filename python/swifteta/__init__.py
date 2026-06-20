"""
swifteta
========
Pure-Python delivery-estimate engine for India shipments.

Three interfaces:
  Library  : from swifteta import estimate, bulk_estimate
  CLI      : python -m swifteta.cli orders.csv --out estimated.csv
  REST API : uvicorn swifteta.api:app --port 8000

The core engine has ZERO third-party dependencies (stdlib only).
Install optional extras for the interfaces you use:
  pip install fastapi uvicorn        # REST API
  pip install pandas openpyxl        # CLI batch tool
  pip install requests               # live carrier calls
"""

from .engine import estimate, bulk_estimate, is_serviceable

__all__ = ["estimate", "bulk_estimate", "is_serviceable"]
__version__ = "1.0.0"
