import os
import requests
import base64
import json
from icecream import ic
from dotenv import load_dotenv


load_dotenv()

# "": {"featured": , "image": "", "context": ""},
REPOS = {
    "kotlin-compiler": {
        "featured": True,
        "image": None,
        "context": "University",
    },
    "shinsu-duel": {
        "featured": True,
        "image": "2-big-card.png",
        "context": "Personal",
    },
    "ride-sharing-app": {
        "featured": True,
        "image": "2-create-ride.png",
        "context": "University",
    },
    "cart-algorithm-class-imbalance-evaluation": {
        "featured": True,
        "image": None,
        "context": "University",
    },
    "feedback-circle": {
        "featured": False,
        "image": None,
        "context": "Internship",
    },
    "ricardofig016.github.io": {
        "featured": False,
        "image": None,
        "context": "Personal",
    },
    "java-robocode-robot": {
        "featured": False,
        "image": None,
        "context": "University",
    },
}

REPOS_DIR_PATH = "public/data/repos"
IMAGES_DIR_PATH = "public/images/repos"

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


def get_images(repo_code):
    images_path = os.path.join(IMAGES_DIR_PATH, repo_code)
    os.makedirs(images_path, exist_ok=True)

    image_file_names = []
    for filename in os.listdir(images_path):
        if os.path.isfile(os.path.join(images_path, filename)):
            image_file_names.append(filename)

    return image_file_names


def save_readme(repo_code, file_path):
    repo_readme = get_readme(repo_code)
    with open(file_path, "w", encoding="utf-8") as file:
        file.write(repo_readme)
    return repo_readme


def save_basic_info(repo_code, curr_id, readme, file_path):
    repo_info = {}
    repo_info["id"] = curr_id
    repo_info["code"] = repo_code

    general_info = get_general_info(repo_code)
    for key, value in general_info.items():
        repo_info[key] = value

    repo_info["languages"] = get_languages(repo_code)
    repo_info["name"] = get_name(readme)
    repo_info["images"] = get_images(repo_code)

    repo_info["featured"] = REPOS[repo_code]["featured"]
    if (
        repo_info["featured"]
        and REPOS[repo_code]["image"]
        and REPOS[repo_code]["image"] in repo_info["images"]
    ):
        repo_info["image"] = REPOS[repo_code]["image"]
    else:
        repo_info["image"] = None

    repo_info["context"] = REPOS[repo_code]["context"]

    with open(file_path, "w", encoding="utf-8") as file:
        json.dump(repo_info, file, indent=2, sort_keys=True)

    return repo_info


def main():
    os.makedirs(REPOS_DIR_PATH, exist_ok=True)

    curr_id = 0
    for repo_code in list(REPOS.keys()):
        print(f"Fetching data for {repo_code}...")

        repo_folder_path = os.path.join(REPOS_DIR_PATH, repo_code)
        os.makedirs(repo_folder_path, exist_ok=True)

        # ReadMe
        readme_path = os.path.join(repo_folder_path, "README.md")
        readme = save_readme(repo_code, readme_path)

        # Basic Info
        info_json_path = os.path.join(repo_folder_path, "info.json")
        info = save_basic_info(repo_code, curr_id, readme, info_json_path)

        curr_id += 1

    # Index
    index_path = os.path.join(REPOS_DIR_PATH, "index.json")
    with open(index_path, "w", encoding="utf-8") as f:
        json.dump(list(REPOS.keys()), f, indent=2)


if __name__ == "__main__":
    main()
