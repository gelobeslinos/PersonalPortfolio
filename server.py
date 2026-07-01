#!/usr/bin/env python3
"""
Simple HTTP server for the portfolio site.
Run with: python server.py
Serves on http://localhost:8000
"""

import http.server
import socketserver
import os

PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))


class CORSRequestHandler(http.server.SimpleHTTPRequestHandler):
    """HTTP request handler with CORS headers."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def log_message(self, format, *args):
        # Suppress default logging noise; print cleaner messages
        print(f"  [{self.address_string()}] {format % args}")


def run():
    with socketserver.TCPServer(("", PORT), CORSRequestHandler) as httpd:
        httpd.allow_reuse_address = True
        print(f"\n  Portfolio running at http://localhost:{PORT}")
        print(f"  Serving files from: {DIRECTORY}")
        print(f"  Press Ctrl+C to stop.\n")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n  Server stopped.")


if __name__ == "__main__":
    run()