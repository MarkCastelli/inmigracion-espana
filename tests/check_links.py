#!/usr/bin/env python3
"""Comprueba que los enlaces https de la app responden.

Uso:
  python tests/check_links.py          # solo la app (JS + index)
  python tests/check_links.py --all    # app + README + docs
  python tests/check_links.py --strict # sale con error si hay 4xx/5xx

No forma parte de la suite normal: necesita red. Algunos organismos
bloquean bots (403/429); se listan aparte para revisión manual.
"""
from __future__ import annotations

import argparse
import concurrent.futures
import re
import ssl
import sys
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
URL_RE = re.compile(r"https://[^\s\"'<>)\]]+")
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36"
CTX = ssl._create_unverified_context()


def files(include_docs: bool):
    out = [ROOT / "index.html"]
    out += sorted((ROOT / "assets" / "js").rglob("*.js"))
    if include_docs:
        out += [ROOT / "README.md"]
        out += sorted((ROOT / "docs").glob("*.md"))
    return out


def urls(include_docs: bool):
    found = set()
    for path in files(include_docs):
        if not path.exists():
            continue
        try:
            text = path.read_text(encoding="utf-8")
        except Exception:
            continue
        for raw in URL_RE.findall(text):
            url = raw.rstrip(".,;:`")
            if url.startswith(("https://fonts.", "https://www.w3.org/")):
                continue
            found.add(url)
    return sorted(found)


def check(url: str):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    try:
        with urllib.request.urlopen(req, timeout=20, context=CTX) as r:
            return url, r.status, r.geturl(), ""
    except urllib.error.HTTPError as e:
        return url, e.code, e.geturl() or url, str(e.reason)[:100]
    except Exception as e:
        return url, 0, url, f"{type(e).__name__}: {str(e)[:100]}"


def is_error_page(result):
    url, status, final, err = result
    low = (final or "").lower()
    return "/error" in low or "error.htm" in low or "error.html" in low


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--all", action="store_true", help="incluye README y docs")
    ap.add_argument("--strict", action="store_true", help="falla con 4xx/5xx/0")
    args = ap.parse_args()

    all_urls = urls(args.all)
    print(f"Comprobando {len(all_urls)} enlaces...\n")
    results = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
        for res in pool.map(check, all_urls):
            results.append(res)

    ok = [r for r in results if 200 <= r[1] < 400 and not is_error_page(r)]
    blocked = [r for r in results if r[1] in (401, 403, 429)]
    unknown = [r for r in results if r[1] == 0]
    bad = [r for r in results if (r[1] >= 400 and r[1] not in (401, 403, 429)) or is_error_page(r)]

    for url, status, final, err in sorted(results, key=lambda x: (x[1] != 200, x[1], x[0])):
        mark = "OK " if 200 <= status < 400 and not is_error_page((url, status, final, err)) else ("BLQ" if status in (401, 403, 429) else ("?  " if status == 0 else "MAL"))
        extra = f" -> {final}" if final and final != url else ""
        print(f"{mark} {status:3} {url}{extra}{('  ' + err) if err else ''}")

    print(f"\nOK: {len(ok)} · bloqueados: {len(blocked)} · no verificables: {len(unknown)} · mal: {len(bad)}")
    if bad:
        print("\nEnlaces mal:")
        for url, status, final, err in bad:
            print(f"  {status} {url} -> {final} {err}")
    if args.strict and bad:
        sys.exit(1)


if __name__ == "__main__":
    main()
