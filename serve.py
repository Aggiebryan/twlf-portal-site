"""Local dev server for the TWLF portal.

Serves the repository directory over HTTP so the portal can be previewed at
http://localhost:3000. Resolves its own location, so it works from any
machine and any working directory.

    python serve.py          # port 3000
    PORT=8080 python serve.py
"""

import http.server
import os
import socketserver

ROOT = os.path.dirname(os.path.abspath(__file__))
PORT = int(os.environ.get("PORT", "3000"))


class Handler(http.server.SimpleHTTPRequestHandler):
    extensions_map = {
        **http.server.SimpleHTTPRequestHandler.extensions_map,
        ".css": "text/css",
        ".js": "application/javascript",
        ".mjs": "application/javascript",
        ".svg": "image/svg+xml",
        ".json": "application/json",
    }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def end_headers(self):
        # Never cache during development; the browser holding onto a stale
        # app.js or auth.js hides changes that are already on disk.
        self.send_header("Cache-Control", "no-store, must-revalidate")
        super().end_headers()

    def handle_one_request(self):
        # Edge and Chrome quietly upgrade localhost to https and remember it.
        # The TLS handshake against this plain HTTP server would otherwise show
        # up as pages of binary garbage and a stale-looking page.
        try:
            peek = self.rfile.peek(3)
        except Exception:
            peek = b""
        if peek.startswith(b"\x16\x03"):
            print(
                f"\n  A browser tried to reach this server over HTTPS.\n"
                f"  This is a plain HTTP dev server: open http://localhost:{PORT}\n"
                f"  and type the http:// prefix so the browser stops upgrading.\n"
            )
            self.close_connection = True
            return
        super().handle_one_request()


class Server(socketserver.TCPServer):
    # On Windows SO_REUSEADDR lets a second process bind a port that is already
    # listening, and the OS hands new connections to whichever socket it likes.
    # A stale server can then silently shadow this one and serve older files.
    # Off Windows it only clears TIME_WAIT, which is what we actually want.
    allow_reuse_address = os.name != "nt"


if __name__ == "__main__":
    with Server(("", PORT), Handler) as httpd:
        print(f"Serving {ROOT} at http://localhost:{PORT} (Ctrl+C to stop)")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nStopped.")
