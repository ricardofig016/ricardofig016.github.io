import argparse
import json
import time
from pathlib import Path
import sys
import requests
from bs4 import BeautifulSoup


BASE_COURSE_PATH = (
    "https://sigarra.up.pt/fcup/en/ucurr_geral.ficha_uc_view?pv_ocorrencia_id="
)

COURSES = {
    "calculus-i": {
        "name": "Calculus I",
        "url": f"{BASE_COURSE_PATH}488625",
    },
    "discrete-structures": {
        "name": "Discrete Structures",
        "url": f"{BASE_COURSE_PATH}508289",
    },
    "introduction-to-computers": {
        "name": "Introduction to Computers",
        "url": f"{BASE_COURSE_PATH}488623",
    },
    "introduction-to-programming": {
        "name": "Introduction to Programming",
        "url": f"{BASE_COURSE_PATH}488624",
    },
    "linear-algebra-and-analytic-geometry": {
        "name": "Linear Algebra and Analytic Geometry",
        "url": f"{BASE_COURSE_PATH}488626",
    },
    "computer-architecture": {
        "name": "Computer Architecture",
        "url": f"{BASE_COURSE_PATH}508295",
    },
    "calculus-ii": {
        "name": "Calculus II",
        "url": f"{BASE_COURSE_PATH}546494",
    },
    "computational-models": {
        "name": "Computational Models",
        "url": f"{BASE_COURSE_PATH}488628",
    },
    "functional-programming": {
        "name": "Functional Programming",
        "url": f"{BASE_COURSE_PATH}488629",
    },
    "imperative-programming": {
        "name": "Imperative Programming",
        "url": f"{BASE_COURSE_PATH}488627",
    },
    "databases": {
        "name": "Databases",
        "url": f"{BASE_COURSE_PATH}508298",
    },
    "data-structures": {
        "name": "Data Structures",
        "url": f"{BASE_COURSE_PATH}529852",
    },
    "human-machine-interfaces": {
        "name": "Human-Machine Interfaces",
        "url": f"{BASE_COURSE_PATH}548305",
    },
    "computational-logic": {
        "name": "Computational Logic",
        "url": f"{BASE_COURSE_PATH}546496",
    },
    "probability-and-statistics-b": {
        "name": "Probability and Statistics B",
        "url": f"{BASE_COURSE_PATH}529927",
    },
    "programming-challenges": {
        "name": "Programming Challenges",
        "url": f"{BASE_COURSE_PATH}548306",
    },
    "algorithm-design-and-analysis": {
        "name": "Algorithm Design and Analysis",
        "url": f"{BASE_COURSE_PATH}508301",
    },
    "artificial-intelligence": {
        "name": "Artificial Intelligence",
        "url": f"{BASE_COURSE_PATH}508303",
    },
    "operating-systems": {
        "name": "Operating Systems",
        "url": f"{BASE_COURSE_PATH}529858",
    },
    "number-theory-and-cryptography": {
        "name": "Number Theory and Cryptography",
        "url": f"{BASE_COURSE_PATH}529130",
    },
    "compilers": {
        "name": "Compilers",
        "url": f"{BASE_COURSE_PATH}546501",
    },
    "communication-networks": {
        "name": "Communication Networks",
        "url": f"{BASE_COURSE_PATH}546502",
    },
    "web-technologies": {
        "name": "Web Technologies",
        "url": f"{BASE_COURSE_PATH}548310",
    },
    "machine-learning-i": {
        "name": "Machine Learning I",
        "url": f"{BASE_COURSE_PATH}546528",
    },
    "software-architecture": {
        "name": "Software Architecture",
        "url": f"{BASE_COURSE_PATH}548309",
    },
    "computability-and-complexity": {
        "name": "Computability and Complexity",
        "url": f"{BASE_COURSE_PATH}546505",
    },
    "internship/project": {
        "name": "Internship/Project",
        "url": f"{BASE_COURSE_PATH}570340",
    },
    "decision-support-methods": {
        "name": "Decision Support Methods",
        "url": f"{BASE_COURSE_PATH}529869",
    },
    "security-and-privacy": {
        "name": "Security and Privacy",
        "url": f"{BASE_COURSE_PATH}546529",
    },
}


def main():

    parser = argparse.ArgumentParser(
        description="Scrape FCUP course info (name & Program section)."
    )
    parser.add_argument(
        "--output",
        default="public/data/fcup/courses.json",
        help="Path to output JSON file (will be created or updated).",
    )
    parser.add_argument(
        "--limit",
        type=int,
        default=None,
        help="Limit number of courses to scrape (useful for testing).",
    )
    parser.add_argument(
        "--delay",
        type=float,
        default=0.0,
        help="Delay in seconds between requests to be polite (default 0).",
    )
    parser.add_argument(
        "--timeout",
        type=float,
        default=20.0,
        help="HTTP request timeout in seconds (default 20).",
    )
    parser.add_argument(
        "--retries",
        type=int,
        default=2,
        help="Number of retries for failed requests (default 2).",
    )
    parser.add_argument(
        "--verbose", "-v", action="store_true", help="Verbose logging output."
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Scrape and print summary without writing output file.",
    )
    args = parser.parse_args()

    output_path = Path(args.output)
    output_path.parent.mkdir(parents=True, exist_ok=True)

    # Load existing JSON if present and non-empty
    existing = {}
    if output_path.exists() and output_path.stat().st_size > 0:
        try:
            existing = json.loads(output_path.read_text(encoding="utf-8"))
            if not isinstance(existing, dict):
                print("Existing JSON is not an object; starting fresh.")
                existing = {}
        except Exception as e:  # pragma: no cover
            print(f"Warning: could not parse existing JSON ({e}); starting fresh.")

    session = requests.Session()
    session.headers.update(
        {
            "User-Agent": "Mozilla/5.0 (compatible; CourseScraper/1.0; +https://github.com/ricardofig016)"
        }
    )

    def fetch(url: str):
        last_exc = None
        for attempt in range(1, args.retries + 2):  # retries + initial
            try:
                resp = session.get(url, timeout=args.timeout)
                if resp.status_code >= 400:
                    raise RuntimeError(f"HTTP {resp.status_code}")
                return resp.text
            except Exception as exc:  # pragma: no cover
                last_exc = exc
                if args.verbose:
                    print(f"Attempt {attempt} failed for {url}: {exc}")
                if attempt < args.retries + 1:
                    time.sleep(min(2**attempt, 5))
        raise last_exc  # type: ignore

    def normalize_whitespace(text: str) -> str:
        import re

        return re.sub(r"\s+", " ", text).strip()

    def parse_course(html: str):
        soup = BeautifulSoup(html, "html.parser")
        program_h3 = soup.find(
            lambda tag: tag.name == "h3"
            and normalize_whitespace(tag.get_text()).lower() == "program"
        )
        program_blocks = []
        if program_h3:
            for sibling in program_h3.next_siblings:
                # If it's a Tag
                name = getattr(sibling, "name", None)
                if name is not None:
                    # Stop when another heading is reached
                    if name in {"h1", "h2", "h3", "h4", "h5", "h6"}:
                        break
                    if name in {"script", "style", "noscript"}:
                        continue
                    text = normalize_whitespace(sibling.get_text(" "))
                    if text:
                        program_blocks.append(text)
                else:
                    # NavigableString: include if non-empty after stripping
                    text = normalize_whitespace(str(sibling))
                    if text:
                        program_blocks.append(text)

        program_content = "\n".join(program_blocks)
        return {"content": program_content}

    # Iterate courses
    items = list(COURSES.items())
    if args.limit is not None:
        items = items[: args.limit]

    updated_courses = 0
    for slug, meta in items:
        url = meta["url"]
        name = meta["name"]
        if args.verbose:
            print(f"Scraping {slug}: {url}")
        try:
            html = fetch(url)
            parsed = parse_course(html)
            # Merge
            existing.setdefault(slug, {}).update({"url": url, "name": name, **parsed})
            updated_courses += 1
            if args.delay:
                time.sleep(args.delay)
        except Exception as e:  # pragma: no cover
            print(f"Error scraping {slug}: {e}", file=sys.stderr)

    if args.dry_run:
        print(json.dumps(existing, ensure_ascii=False, indent=2))
        print(f"(dry-run) Updated {updated_courses} course(s). Output not written.")
        return

    output_path.write_text(
        json.dumps(existing, ensure_ascii=False, indent=2, sort_keys=True) + "\n",
        encoding="utf-8",
    )
    print(f"Wrote data for {updated_courses} course(s) to {output_path}")


if __name__ == "__main__":
    main()
