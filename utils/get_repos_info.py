import os
import requests
import base64
import json
from icecream import ic
from dotenv import load_dotenv


load_dotenv()

# "": {"featured": , "context": ""},
REPOS = {
    "kotlin-compiler": {"featured": True, "context": "University"},
    "shinsu-duel": {"featured": True, "context": "Personal"},
    "feedback-circle": {"featured": False, "context": "Internship"},
    "cart-algorithm-class-imbalance-evaluation": {
        "featured": True,
        "context": "University",
    },
    "ricardofig016.github.io": {"featured": True, "context": "Personal"},
    "java-robocode-robot": {"featured": False, "context": "University"},
}

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
        "github_url": data["html_url"],
        "website": data["homepage"],
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


def main():
    os.makedirs(REPOS_DIR_PATH, exist_ok=True)

    curr_id = 1
    for repo_code in list(REPOS.keys()):
        print(f"Fetching data for {repo_code}...")

        repo_data = {}
        repo_data["id"] = curr_id
        curr_id += 1
        repo_data["code"] = repo_code
        general_info = get_general_info(repo_code)
        for key, value in general_info.items():
            repo_data[key] = value
        repo_data["languages"] = get_languages(repo_code)
        repo_data["readme"] = get_readme(repo_code)
        repo_data["name"] = get_name(repo_data["readme"])
        repo_data["featured"] = REPOS[repo_code]["featured"]
        repo_data["context"] = REPOS[repo_code]["context"]

        repo_folder_path = os.path.join(REPOS_DIR_PATH, repo_code)
        os.makedirs(repo_folder_path, exist_ok=True)
        info_json_path = os.path.join(repo_folder_path, "info.json")
        with open(info_json_path, "w", encoding="utf-8") as file:
            json.dump(repo_data, file, indent=2, sort_keys=True)

    index_path = os.path.join(REPOS_DIR_PATH, "index.json")
    with open(index_path, "w", encoding="utf-8") as f:
        json.dump(list(REPOS.keys()), f, indent=2)


if __name__ == "__main__":
    main()
