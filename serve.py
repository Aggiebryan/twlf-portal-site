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


class Server(socketserver.TCPServer):
    allow_reuse_address = True


if __name__ == "__main__":
    with Server(("", PORT), Handler) as httpd:
        print(f"Serving {ROOT} at http://localhost:{PORT} (Ctrl+C to stop)")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nStopped.")
