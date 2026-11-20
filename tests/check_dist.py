#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Comprueba que dist/ruta-legal.html es realmente autónomo."""

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FILE = ROOT / "dist" / "ruta-legal.html"


def main() -> int:
    if not FILE.exists():
        print("FALLA: no existe %s. Ejecuta python build.py" % FILE)
        return 1
    text = FILE.read_text(encoding="utf-8")
    checks = {
        "tiene CSS incrustado": "<style>" in text,
        "tiene al menos 9 scripts incrustados": text.count("<script>") >= 9,
        "no referencia assets externos": ('src="assets' not in text) and ('href="assets' not in text),
        "no usa módulos ES": 'type="module"' not in text,
        "incluye el ejemplo": "Ver un plan de ejemplo" in text,
        "incluye el generador de PDF": "buildPlanPDF" in text,
        "incluye el lector de voz": "speechSynthesis" in text,
        "incluye la barra de voz": 'id="speechBar"' in text,
        "incluye formularios oficiales": "EX-31" in text,
        "incluye el directorio": "Dónde ir" in text,
        "incluye consulta IA": "Consulta IA" in text,
        "incluye trámites": "Trámites" in text,
        "incluye derechos y ayudas": "Derechos" in text and "discapacidad" in text,
        "incluye reconocimiento de estudios": "homologación" in text,
        "incluye preguntas": "Preguntas" in text and "patera" in text,
        "incluye online": "DEHú" in text and "Mercurio" in text,
        "incluye formularios": "EX-17" in text and "790-012" in text,
        "incluye ilegal/irregular": "irregular" in text,
        "incluye el aviso legal": "no sustituye" in text.lower(),
        "incluye la fecha de revisión": "2026" in text,
    }
    for name, ok in checks.items():
        print(("OK    " if ok else "FALLA ") + name)
    print("Tamano: %.1f KB" % (len(text.encode("utf-8")) / 1024))
    return 0 if all(checks.values()) else 1


if __name__ == "__main__":
    raise SystemExit(main())
