#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Ruta Legal · servidor local opcional.

La app funciona abriendo index.html directamente. Este servidor solo hace
falta si tu navegador bloquea el almacenamiento local en file:// o si quieres
abrirla desde el móvil en la misma red.

Uso:
    python3 serve.py                 # abre http://127.0.0.1:8765
    python3 serve.py --port 9000
    python3 serve.py --no-browser
    python3 serve.py --lan           # accesible desde el móvil (misma wifi)

Solo usa la biblioteca estándar. No envía datos a ningún sitio.
"""

import argparse
import http.server
import socket
import socketserver
import sys
import threading
import webbrowser
from functools import partial
from pathlib import Path

# Consolas de Windows en cp1252: evita UnicodeEncodeError.
for _stream in (sys.stdout, sys.stderr):
    try:
        _stream.reconfigure(encoding="utf-8", errors="replace")
    except (AttributeError, ValueError):
        pass

ROOT = Path(__file__).resolve().parent
DEFAULT_PORT = 8765


class Handler(http.server.SimpleHTTPRequestHandler):
    """Sirve los archivos de la app sin caché y sin listar directorios."""

    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("Referrer-Policy", "no-referrer")
        super().end_headers()

    def log_message(self, fmt, *args):
        # Silencioso salvo errores.
        if args and str(args[1] if len(args) > 1 else "").startswith(("4", "5")):
            sys.stderr.write("  %s\n" % (fmt % args))


class Server(socketserver.ThreadingTCPServer):
    allow_reuse_address = True
    daemon_threads = True


def free_port(start: int) -> int:
    for port in range(start, start + 60):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
            try:
                sock.bind(("127.0.0.1", port))
                return port
            except OSError:
                continue
    return start


def main() -> int:
    parser = argparse.ArgumentParser(description="Servidor local de Ruta Legal")
    parser.add_argument("--port", type=int, default=DEFAULT_PORT, help="puerto inicial (por defecto 8765)")
    parser.add_argument("--no-browser", action="store_true", help="no abrir el navegador automáticamente")
    parser.add_argument("--lan", action="store_true", help="permitir acceso desde otros dispositivos de la red local")
    args = parser.parse_args()

    host = "0.0.0.0" if args.lan else "127.0.0.1"
    port = free_port(args.port) if not args.lan else args.port

    handler = partial(Handler, directory=str(ROOT))
    try:
        httpd = Server((host, port), handler)
    except OSError as exc:
        print("No se pudo abrir el puerto %s: %s" % (port, exc), file=sys.stderr)
        return 1

    if args.lan:
        local_ip = "127.0.0.1"
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as sock:
                sock.connect(("8.8.8.8", 80))
                local_ip = sock.getsockname()[0]
        except OSError:
            pass
        url = "http://%s:%d/" % (local_ip, port)
    else:
        url = "http://127.0.0.1:%d/" % port

    print()
    print("  Ruta Legal - servidor local")
    print("  -----------------------------------------")
    print("  Abre:  %s" % url)
    print("  Datos: solo en tu navegador. Nada sale de aqui.")
    print("  Para parar: Ctrl + C")
    print()

    if not args.no_browser:
        threading.Timer(0.6, lambda: webbrowser.open(url)).start()

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n  Servidor detenido. Tus datos siguen en el navegador.\n")
    finally:
        httpd.server_close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
