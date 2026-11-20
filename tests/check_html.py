#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Comprueba el equilibrio de etiquetas de index.html (sin dependencias)."""

import sys
from html.parser import HTMLParser
from pathlib import Path

VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link",
        "meta", "param", "source", "track", "wbr"}


class Checker(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.stack = []
        self.errors = []

    def handle_starttag(self, tag, attrs):
        if tag in VOID:
            return
        self.stack.append((tag, self.getpos()))

    def handle_startendtag(self, tag, attrs):
        return

    def handle_endtag(self, tag):
        if tag in VOID:
            return
        if not self.stack:
            self.errors.append("cierre sin apertura: </%s> en %s" % (tag, self.getpos()))
            return
        top, pos = self.stack[-1]
        if top == tag:
            self.stack.pop()
        else:
            self.errors.append("cierre </%s> en %s no coincide con <%s> abierto en %s"
                               % (tag, self.getpos(), top, pos))
            # intenta recuperar
            for i in range(len(self.stack) - 1, -1, -1):
                if self.stack[i][0] == tag:
                    del self.stack[i:]
                    break


def main() -> int:
    path = Path(__file__).resolve().parents[1] / "index.html"
    checker = Checker()
    checker.feed(path.read_text(encoding="utf-8"))
    checker.close()
    if checker.stack:
        for tag, pos in checker.stack:
            print("Sin cerrar: <%s> en %s" % (tag, pos))
    for e in checker.errors:
        print("ERROR:", e)
    ok = not checker.errors and not checker.stack
    print("HTML OK" if ok else "HTML con problemas")
    return 0 if ok else 1


if __name__ == "__main__":
    raise SystemExit(main())
