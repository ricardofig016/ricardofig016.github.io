import json
from pathlib import Path
import requests
import re
from bs4 import BeautifulSoup


BASE_COURSE_PATH = (
    "https://sigarra.up.pt/fcup/en/ucurr_geral.ficha_uc_view?pv_ocorrencia_id="
)
OUTPUT_PATH = Path("public/data/fcup/courses.json")
OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)

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
    def normalize_whitespace(text: str) -> str:
        return re.sub(r"\s+", " ", text).strip()

    def extract_program(html: str) -> str:
        soup = BeautifulSoup(html, "html.parser")
        programH3 = soup.find(
            lambda t: t.name == "h3"
            and normalize_whitespace(t.get_text()).lower() == "program"
        )
        if not programH3:
            return ""
        blocks = []
        for sib in programH3.next_siblings:
            name = getattr(sib, "name", None)
            if name is not None:
                if name in {"h1", "h2", "h3", "h4", "h5", "h6"}:
                    break
                if name in {"script", "style", "noscript"}:
                    continue
                text = normalize_whitespace(sib.get_text(" "))
            else:
                text = normalize_whitespace(str(sib))
            if text:
                blocks.append(text)
        return "\n".join(blocks)

    session = requests.Session()
    session.headers.update({"User-Agent": "CourseScraper/Minimal"})

    result = {}
    for slug, meta in COURSES.items():
        url = meta["url"]
        try:
            resp = session.get(url, timeout=15)
            if resp.status_code >= 400:
                program = ""
            else:
                program = extract_program(resp.text)
        except Exception:
            program = ""
        result[slug] = {"name": meta["name"], "url": url, "content": program}

    OUTPUT_PATH.write_text(
        json.dumps(result, ensure_ascii=False, indent=2, sort_keys=True) + "\n",
        encoding="utf-8",
    )
    print(f"Wrote {len(result)} courses to {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
