"""Check every portal link resolves to a real page.

Run it where there is unrestricted internet — your own machine — because the
cloud session this was written in cannot reach any of these hosts.

    python check_links.py                 # checks links.json
    python check_links.py --csv out.csv   # also writes a spreadsheet

Reads links.json. If you have exported the SharePoint Portal Links list to
CSV, pass it instead and the same checks run over that:

    python check_links.py --csv-in "Portal Links.csv"

A word on judgement: a non-200 does NOT always mean dead. Government and legal
sites commonly return 403 or 429 to anything that is not a human in a browser,
and some sit behind bot protection that never answers a script. Those are
reported as NEEDS A LOOK, not as broken, and should be opened by hand before
anything is deleted. Only DNS failures, connection refusals and genuine 404s
are reported as broken.
"""

import argparse
import csv
import json
import socket
import ssl
import sys
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from urllib.parse import urlparse

UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36")
TIMEOUT = 20

OK, LOOK, BROKEN = "OK", "NEEDS A LOOK", "BROKEN"


def check(link):
    url = link["url"]
    request = urllib.request.Request(url, method="GET", headers={
        "User-Agent": UA,
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
    })
    try:
        with urllib.request.urlopen(request, timeout=TIMEOUT) as response:
            final = response.geturl()
            moved = urlparse(final).hostname != urlparse(url).hostname
            note = f"redirects to {urlparse(final).hostname}" if moved else ""
            return link, OK, response.status, note
    except urllib.error.HTTPError as error:
        # 401/403/429 are usually bot protection or a login wall, not a dead page.
        if error.code in (401, 403, 405, 429, 503):
            return link, LOOK, error.code, "blocks automated requests — open it by hand"
        if error.code == 404:
            return link, BROKEN, 404, "page not found"
        return link, LOOK, error.code, "unexpected status"
    except urllib.error.URLError as error:
        reason = error.reason
        if isinstance(reason, socket.gaierror):
            return link, BROKEN, "-", "domain does not resolve"
        if isinstance(reason, ConnectionRefusedError):
            return link, BROKEN, "-", "connection refused"
        if isinstance(reason, (ssl.SSLError, ssl.SSLCertVerificationError)):
            return link, LOOK, "-", f"TLS problem: {reason}"
        if isinstance(reason, socket.timeout):
            return link, LOOK, "-", f"timed out after {TIMEOUT}s"
        return link, LOOK, "-", str(reason)
    except socket.timeout:
        return link, LOOK, "-", f"timed out after {TIMEOUT}s"
    except Exception as error:                      # noqa: BLE001 - report, never crash the run
        return link, LOOK, "-", f"{type(error).__name__}: {error}"


def load(args):
    if args.csv_in:
        with open(args.csv_in, newline="", encoding="utf-8-sig") as handle:
            rows = list(csv.DictReader(handle))
        def pick(row, *names):
            for n in names:
                for key in row:
                    if key.strip().lower() == n:
                        return (row[key] or "").strip()
            return ""
        return [{"id": pick(r, "linkid", "id"), "name": pick(r, "title", "name"),
                 "url": pick(r, "linkurl", "url"), "category": pick(r, "linkcategory", "category")}
                for r in rows if pick(r, "linkurl", "url")]
    return json.load(open(args.file, encoding="utf-8"))["links"]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--file", default="links.json")
    parser.add_argument("--csv-in", help="a CSV exported from the SharePoint Portal Links list")
    parser.add_argument("--csv", help="write the results to this CSV")
    parser.add_argument("--workers", type=int, default=8)
    args = parser.parse_args()

    links = load(args)
    print(f"Checking {len(links)} links, {args.workers} at a time…\n")

    with ThreadPoolExecutor(max_workers=args.workers) as pool:
        results = list(pool.map(check, links))

    order = {BROKEN: 0, LOOK: 1, OK: 2}
    results.sort(key=lambda r: (order[r[1]], r[0].get("name", "")))

    for link, verdict, status, note in results:
        if verdict == OK and not note:
            continue
        print(f"{verdict:<13} {str(status):<4} {link.get('id',''):<5} "
              f"{link.get('name','')[:30]:<30} {note}")
        print(f"{'':<24}{link['url']}")

    counts = {v: sum(1 for r in results if r[1] == v) for v in (OK, LOOK, BROKEN)}
    print(f"\n  {counts[OK]} OK   {counts[LOOK]} need a look   {counts[BROKEN]} broken")
    if counts[BROKEN]:
        print("\nBroken — safe to remove once you have confirmed each one:")
        for link, verdict, _s, note in results:
            if verdict == BROKEN:
                print(f"  {link.get('id',''):<5} {link.get('name','')}  ({note})")
                print(f"        {link['url']}")

    if args.csv:
        with open(args.csv, "w", newline="", encoding="utf-8") as handle:
            writer = csv.writer(handle)
            writer.writerow(["verdict", "status", "id", "name", "category", "url", "note"])
            for link, verdict, status, note in results:
                writer.writerow([verdict, status, link.get("id", ""), link.get("name", ""),
                                 link.get("category", ""), link["url"], note])
        print(f"\nWrote {args.csv}")

    return 0


if __name__ == "__main__":
    sys.exit(main())
