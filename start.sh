#!/usr/bin/env sh
# Ruta Legal · arranque en Linux / macOS / Android (Termux)
set -eu
cd "$(dirname "$0")"

if command -v python3 >/dev/null 2>&1; then
  exec python3 serve.py "$@"
fi
if command -v python >/dev/null 2>&1; then
  exec python serve.py "$@"
fi

echo ""
echo "  No se ha encontrado Python 3."
echo "  Puedes abrir index.html directamente en el navegador."
echo "  O instalar Python: https://www.python.org/downloads/"
echo ""
exit 1
