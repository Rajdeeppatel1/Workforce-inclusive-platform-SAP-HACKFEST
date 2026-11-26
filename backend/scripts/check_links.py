#!/usr/bin/env python3
"""
backend/scripts/check_links.py
══════════════════════════════
Validates HTTP reachability of external resources defined in backend/data/resources.json.
Updates `verified` boolean and `lastVerified` ISO timestamp for each resource.
"""

import json
import os
import sys
from datetime import datetime, timezone
import urllib.request
import urllib.error
import ssl

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
POSSIBLE_PATHS = [
    os.path.abspath(os.path.join(SCRIPT_DIR, "..", "data", "resources.json")),
    os.path.abspath(os.path.join(SCRIPT_DIR, "data", "resources.json")),
    os.path.abspath(os.path.join(SCRIPT_DIR, "..", "..", "backend", "data", "resources.json")),
]

RESOURCES_PATH = None
for p in POSSIBLE_PATHS:
    if os.path.exists(p):
        RESOURCES_PATH = p
        break

if not RESOURCES_PATH:
    RESOURCES_PATH = POSSIBLE_PATHS[0]

USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

def check_url(url: str, timeout: int = 8) -> bool:
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": USER_AGENT,
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
        method="HEAD"
    )
    try:
        with urllib.request.urlopen(req, timeout=timeout, context=ctx) as resp:
            code = resp.getcode()
            return 200 <= code < 400
    except urllib.error.HTTPError as e:
        if e.code in (403, 405):
            try:
                get_req = urllib.request.Request(
                    url,
                    headers={"User-Agent": USER_AGENT},
                    method="GET"
                )
                with urllib.request.urlopen(get_req, timeout=timeout, context=ctx) as get_resp:
                    return 200 <= get_resp.getcode() < 400
            except urllib.error.HTTPError as get_e:
                if get_e.code in (403,):
                    return True
                return False
            except Exception:
                return False
        return False
    except Exception:
        try:
            get_req = urllib.request.Request(
                url,
                headers={"User-Agent": USER_AGENT},
                method="GET"
            )
            with urllib.request.urlopen(get_req, timeout=timeout, context=ctx) as resp:
                return 200 <= resp.getcode() < 400
        except Exception:
            return False

def verify_all_resources(dry_run: bool = False):
    print(f"Loading resources from: {RESOURCES_PATH}")
    if not os.path.exists(RESOURCES_PATH):
        print(f"Error: Resources file not found at {RESOURCES_PATH}")
        sys.exit(1)

    with open(RESOURCES_PATH, "r", encoding="utf-8") as f:
        resources = json.load(f)

    now_iso = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    total = len(resources)
    verified_count = 0

    print(f"Verifying {total} resources...")
    for idx, item in enumerate(resources, 1):
        url = item.get("url", "")
        title = item.get("title", "")
        is_ok = check_url(url)
        item["verified"] = is_ok
        item["lastVerified"] = now_iso
        if is_ok:
            verified_count += 1
            print(f"  [{idx}/{total}] [✓ VERIFIED] {title} -> {url}")
        else:
            print(f"  [{idx}/{total}] [✗ UNVERIFIED] {title} -> {url}")

    if not dry_run:
        with open(RESOURCES_PATH, "w", encoding="utf-8") as f:
            json.dump(resources, f, indent=2)
        print(f"\nUpdated {RESOURCES_PATH}: {verified_count}/{total} links verified at {now_iso}.")
    else:
        print(f"\n[Dry-run] Would update {RESOURCES_PATH}: {verified_count}/{total} links verified.")

if __name__ == "__main__":
    dry_run = "--dry-run" in sys.argv
    verify_all_resources(dry_run=dry_run)
