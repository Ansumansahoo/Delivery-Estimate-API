"""
swifteta.cli
============
Batch shipping-ETA estimator. CSV/Excel of orders in, estimated file out.

Usage:
    python -m swifteta.cli examples/batch_orders.csv
    python -m swifteta.cli examples/batch_orders.csv --origin 400001 --out my_estimates.csv
    python -m swifteta.cli orders.xlsx --out estimated.xlsx   # Excel too (needs openpyxl)

Input: CSV/XLSX with a 'destination' column.
Optional input columns: id, weight_kg, express, cod
Output: same rows plus distance_km, zone, carrier, days_min, days_max, rate_inr, min_date, max_date, status
"""
from __future__ import annotations

import argparse
import sys
from pathlib import Path
from typing import Optional

from .engine import bulk_estimate
from .data import ORIGIN_PINCODE


def _load(path: Path):
    import pandas as pd

    if path.suffix.lower() in (".xlsx", ".xls"):
        return pd.read_excel(path, dtype={"destination": str})
    return pd.read_csv(path, dtype={"destination": str})


def _save(df, path: Path) -> None:
    if path.suffix.lower() in (".xlsx", ".xls"):
        df.to_excel(path, index=False)
    else:
        df.to_csv(path, index=False)


def main(argv: Optional[list[str]] = None) -> int:
    p = argparse.ArgumentParser(
        prog="python -m swifteta.cli",
        description="Batch shipping-ETA estimator: CSV/XLSX of orders -> estimated file",
    )
    p.add_argument("input", type=Path, help="CSV or XLSX file with a 'destination' column")
    p.add_argument("--origin", default=ORIGIN_PINCODE, help="Origin/warehouse pincode (default: %(default)s)")
    p.add_argument("--out", type=Path, default=None, help="Output path (default: input_estimated.ext)")
    args = p.parse_args(argv)

    try:
        import pandas as pd  # noqa: F401
    except ImportError:
        print(
            "pandas is required for the CLI. Install it with:\n"
            "  pip install pandas openpyxl",
            file=sys.stderr,
        )
        return 2

    if not args.input.exists():
        print(f"ERROR: input file not found: {args.input}", file=sys.stderr)
        return 1

    df = _load(args.input)
    if "destination" not in df.columns:
        print(
            f"ERROR: input must have a 'destination' column. "
            f"Found: {list(df.columns)}",
            file=sys.stderr,
        )
        return 1

    orders = df.to_dict(orient="records")
    rows = bulk_estimate(args.origin, orders)

    import pandas as pd
    out_df = pd.DataFrame(rows)

    # Determine output path
    out_path = args.out or args.input.with_name(
        args.input.stem + "_estimated" + args.input.suffix
    )
    _save(out_df, out_path)

    ok = sum(1 for r in rows if r["status"] == "serviceable")
    not_ok = len(rows) - ok
    print(
        f"Estimated {len(rows)} orders  "
        f"({ok} serviceable, {not_ok} unserviceable)  ->  {out_path}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
