"""Serve the static Theme Studio locally with Python's standard library."""

from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import argparse
import errno


class SiteHandler(SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        # Request logging to stderr can fail when a launcher closes its pipe.
        pass


class SiteServer(ThreadingHTTPServer):
    # On Windows, SO_REUSEADDR can allow a second server to bind the same port.
    allow_reuse_address = False


def main():
    parser = argparse.ArgumentParser(description='Serve Theme Studio')
    parser.add_argument('--port', type=int, default=8000)
    args = parser.parse_args()
    root = Path(__file__).resolve().parent
    handler = partial(SiteHandler, directory=str(root))
    try:
        server = SiteServer(('127.0.0.1', args.port), handler)
    except OSError as exc:
        if exc.errno == errno.EADDRINUSE or getattr(exc, 'winerror', None) == 10048:
            raise SystemExit(f'Port {args.port} is already in use. Stop the other server or run start.cmd --port 9000.') from None
        raise
    with server:
        print(f'Theme Studio: http://127.0.0.1:{args.port}', flush=True)
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            pass


if __name__ == '__main__':
    main()
