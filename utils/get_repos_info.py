import os
import requests
import base64
import json
from dotenv import load_dotenv


load_dotenv()

REPO_CODES = ["kotlin-compiler", "shinsu-duel", "feedback-circle"]
FEATURED_REPOS = ["kotlin-compiler", "shinsu-duel"]

REPOS_DIR_PATH = "public/data/repos"

GITHUB_USERNAME = "ricardofig016"
GITHUB_API_BASE_URL = f"https://api.github.com/repos/{GITHUB_USERNAME}"
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")


def get_request(url):
    headers = {
        "Accept": "application/vnd.github.v3+json",
        "Authorization": f"token {GITHUB_TOKEN}",
        "User-Agent": GITHUB_USERNAME,
    }
    response = requests.get(url, headers=headers)
    if response.status_code != 200:
        print(f"Failed to fetch data: {response.status_code} - {response.text}")
        return None
    return response.json()


def get_general_info(repo_code):
    url = f"{GITHUB_API_BASE_URL}/{repo_code}"
    data = get_request(url)
    if data is None:
        return None
    repo_info = {
        "description": data["description"],
        "stars": data["stargazers_count"],
        "forks": data["forks_count"],
        "issues": data["open_issues_count"],
        "url": data["html_url"],
    }
    return repo_info


def get_languages(repo_code):
    url = f"{GITHUB_API_BASE_URL}/{repo_code}/languages"
    return get_request(url)


def get_readme(repo_code):
    url = f"{GITHUB_API_BASE_URL}/{repo_code}/readme"
    data = get_request(url)
    if data is None:
        return None
    readme = base64.b64decode(data["content"]).decode("utf-8")
    return readme


def get_name(readme):
    for line in readme.splitlines():
        line = line.strip()
        if line.startswith("# "):
            return line[2:].strip()
    return "Untitled"


if __name__ == "__main__":
    os.makedirs(REPOS_DIR_PATH, exist_ok=True)
    for repo_code in REPO_CODES:
        print(f"Fetching data for {repo_code}...")
        repo_data = {}
        repo_data["code"] = repo_code
        general_info = get_general_info(repo_code)
        for key, value in general_info.items():
            repo_data[key] = value
        repo_data["languages"] = get_languages(repo_code)
        repo_data["readme"] = get_readme(repo_code)
        repo_data["name"] = get_name(repo_data["readme"])
        repo_data["featured"] = repo_code in FEATURED_REPOS

        repo_file_name = f"{repo_code}.json"
        repo_file_path = os.path.join(REPOS_DIR_PATH, repo_file_name)
        with open(repo_file_path, "w", encoding="utf-8") as file:
            json.dump(repo_data, file, indent=4, sort_keys=True)
