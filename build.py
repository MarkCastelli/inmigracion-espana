#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Ruta Legal · empaquetador en un solo archivo HTML.

Genera dist/ruta-legal.html con el CSS y el JavaScript incrustados, para
poder llevarlo en el móvil, enviarlo por correo o abrirlo sin servidor.

Uso:
    python3 build.py
    python3 build.py --output dist/ruta-legal.html
"""

import argparse
import re
import sys
from pathlib import Path

for _stream in (sys.stdout, sys.stderr):
    try:
        _stream.reconfigure(encoding="utf-8", errors="replace")
    except (AttributeError, ValueError):
        pass

ROOT = Path(__file__).resolve().parent
DEFAULT_OUT = ROOT / "dist" / "ruta-legal.html"

LINK_RE = re.compile(r'<link\s+rel="stylesheet"\s+href="([^"]+)"\s*/?>')
SCRIPT_RE = re.compile(r'<script\s+src="([^"]+)"\s*>\s*</script>')


def read(rel: str) -> str:
    rel = rel.split("?", 1)[0]
    path = (ROOT / rel).resolve()
    if ROOT not in path.parents and path != ROOT:
        raise SystemExit("Ruta fuera del proyecto: %s" % rel)
    if not path.exists():
        raise SystemExit("No se encuentra el archivo: %s" % rel)
    return path.read_text(encoding="utf-8")


def inline_css(match: re.Match) -> str:
    css = read(match.group(1))
    return "<style>\n/* ── %s ── */\n%s\n</style>" % (match.group(1), css)


def inline_js(match: re.Match) -> str:
    rel = match.group(1)
    # Los scripts externos (GoatCounter) se mantienen como etiquetas externas.
    if rel.startswith(("http://", "https://", "//")):
        return match.group(0)
    js = read(rel)
    # Evita que un literal </script> cierre la etiqueta al incrustar.
    js = js.replace("</script", "<\\/script")
    return "<script>\n/* ── %s ── */\n%s\n</script>" % (rel, js)


def main() -> int:
    parser = argparse.ArgumentParser(description="Empaqueta Ruta Legal en un único HTML")
    parser.add_argument("--output", default=str(DEFAULT_OUT), help="archivo de salida")
    args = parser.parse_args()

    html = read("index.html")
    html = LINK_RE.sub(inline_css, html)
    html = SCRIPT_RE.sub(inline_js, html)

    # La base editable vive en JSON. En el archivo único se inyecta una copia
    # para que el directorio funcione también sin servidor y sin fetch.
    lawyers_json = read("assets/js/data/lawyers.json")
    lawyers_json = lawyers_json.replace("</script", "<\\/script")
    html = html.replace("</head>", "<script>window.__RL_LAWYERS__ = " + lawyers_json + ";</script>\n</head>", 1)

    leftover = re.findall(r'(?:src|href)="(assets/[^"?]+)', html)
    if leftover:
        print("Aviso: quedan referencias externas: %s" % ", ".join(sorted(set(leftover))), file=sys.stderr)

    banner = (
        "<!--\n"
        "  Ruta Legal · archivo único generado por build.py\n"
        "  Ábrelo en cualquier navegador. No necesita internet ni servidor.\n"
        "  Tus datos se quedan en el navegador.\n"
        "-->\n"
    )
    html = html.replace("<!doctype html>", "<!doctype html>\n" + banner, 1)

    out = Path(args.output).resolve()
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(html, encoding="utf-8")

    size_kb = out.stat().st_size / 1024
    print("Listo: %s (%.1f KB)" % (out, size_kb))
    print("Puedes abrirlo con doble clic o enviarlo al móvil.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
