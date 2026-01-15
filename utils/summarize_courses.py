"""Normalize FCUP course descriptions using an OpenAI LLM.

The script reads public/data/education/fcup/courses.json, sends each course description
through an LLM, and stores the structured list of topics under a new
"topics" field per course. Set OPENAI_API_KEY in your environment before
running this script.
"""

from __future__ import annotations

import json
import os
import re
from pathlib import Path
from typing import Dict, List, Any

from dotenv import load_dotenv
from openai import OpenAI

# Path setup
ROOT_DIR = Path(__file__).resolve().parents[1]
COURSES_PATH = ROOT_DIR / "public" / "data" / "education" / "fcup" / "courses.json"

# Courses that should be ignored by the normalization pass
EXCLUDED_CODES = {}

# Optional allow-list. Populate with repo codes (e.g., {"databases"}) to
# run the script only for those entries. Leave empty to process everything
# except the excluded ones.
INCLUDE_ONLY: set[str] = set()

load_dotenv()

# Model selection can be overridden via OPENAI_MODEL env var
MODEL_NAME = os.environ.get("OPENAI_MODEL", "gpt-5-nano")

PROMPT_TEMPLATE = """
    You are helping standardize university course descriptions.
    Given the course name and raw content below, extract only the core
    academic topics (concepts, algorithms, techniques) as a concise ordered list.

    Ignore logistical or administrative information such as workload,
    evaluation rules, bibliographies, teaching methods, software/tooling
    requirements, or grading policies. Remove numbering/bullet prefixes and
    deduplicate overlapping ideas.

    Return ONLY JSON that satisfies the provided schema. Do not include
    code fences or commentary—respond with the JSON object itself.

    Each topic string should be 1-8 words and capture distinct
    subjects or techniques mentioned. Avoid redundant wording.

    Course name: {name}
    Raw description:
    {content}
    """

TEXT_FORMAT = {
    "format": {
        "type": "json_schema",
        "name": "CourseTopics",
        "schema": {
            "type": "object",
            "properties": {
                "topics": {
                    "type": "array",
                    "items": {"type": "string"},
                    "minItems": 1,
                }
            },
            "required": ["topics"],
            "additionalProperties": False,
        },
        "strict": True,
    }
}


def load_courses() -> Dict[str, Any]:
    with COURSES_PATH.open("r", encoding="utf-8") as fh:
        return json.load(fh)


def save_courses(data: Dict[str, Any]) -> None:
    with COURSES_PATH.open("w", encoding="utf-8") as fh:
        json.dump(data, fh, indent=2, ensure_ascii=False)


CODE_FENCE = re.compile(r"^```(?:json)?\s*(.*?)\s*```$", re.DOTALL)


def extract_text(response) -> str:
    """Flatten the text output from the OpenAI responses API."""
    # responses API exposes a convenience property for plain text
    output_text = getattr(response, "output_text", None)
    if isinstance(output_text, str) and output_text.strip():
        return output_text.strip()

    chunks: List[str] = []
    for item in getattr(response, "output", []) or []:  # type: ignore[attr-defined]
        for content in getattr(item, "content", []) or []:
            if getattr(content, "type", None) == "text":
                chunks.append(getattr(content, "text", ""))
    return "".join(chunks).strip()


def parse_topics_payload(text: str) -> List[str]:
    cleaned = text.strip()
    match = CODE_FENCE.match(cleaned)
    if match:
        cleaned = match.group(1).strip()

    # Fallback: grab the first JSON object if extra text surrounds it
    if not cleaned.startswith("{"):
        start = cleaned.find("{")
        end = cleaned.rfind("}")
        if start != -1 and end != -1 and end > start:
            cleaned = cleaned[start : end + 1].strip()
    if not cleaned.startswith("{") and '"topics"' in cleaned:
        cleaned = "{\n" + cleaned + "\n}"

    payload = json.loads(cleaned)
    topics = payload.get("topics")
    if not isinstance(topics, list):
        raise ValueError("LLM output did not contain a 'topics' list")
    return [str(topic).strip() for topic in topics if str(topic).strip()]


def normalize_course(client: OpenAI, course: Dict[str, Any]) -> List[str]:
    prompt = PROMPT_TEMPLATE.format(
        name=course.get("name", ""), content=course.get("content", "")
    )
    response = client.responses.create(
        model=MODEL_NAME,
        input=[
            {
                "role": "system",
                "content": "You generate concise topic lists as strict JSON.",
            },
            {"role": "user", "content": prompt},
        ],
        text=TEXT_FORMAT,
    )
    text = extract_text(response)
    return parse_topics_payload(text)


def main() -> None:
    if not os.getenv("OPENAI_API_KEY"):
        raise RuntimeError("OPENAI_API_KEY environment variable is required")

    courses = load_courses()
    client = OpenAI()

    for code, course in courses.items():
        if INCLUDE_ONLY and code not in INCLUDE_ONLY:
            print(f"Skipping (not in include list): {code}")
            continue
        if code in EXCLUDED_CODES:
            print(f"Skipping excluded course: {code}")
            continue
        print(f"Processing {code}...")
        try:
            course["topics"] = normalize_course(client, course)
        except Exception as exc:  # keeping error handling minimal per requirements
            print(f"  Error while processing {code}: {exc}")
        save_courses(courses)

    print("Done! Updated courses.json with structured topics.")


if __name__ == "__main__":
    main()
