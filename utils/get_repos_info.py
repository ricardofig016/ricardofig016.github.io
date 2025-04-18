import os
import requests
import base64

GITHUB_USERNAME = "ricardofig016"
REPO_CODES = ["kotlin-compiler", "shinsu-duel", "feedback-circle"]
REPOS_DIR_PATH = "public/data/repos"


def get_repo_readme(repo_code):
    url = f"https://api.github.com/repos/{GITHUB_USERNAME}/{repo_code}/readme"
    response = requests.get(url)

    if response.status_code != 200:
        print(f"Failed to fetch README for {repo_code}")
        return

    data = response.json()
    readme = base64.b64decode(data["content"]).decode("utf-8")

    repo_dir_path = os.path.join(REPOS_DIR_PATH, repo_code)
    os.makedirs(repo_dir_path, exist_ok=True)
    with open(os.path.join(repo_dir_path, "README.md"), "w", encoding="utf-8") as file:
        file.write(readme)


if __name__ == "__main__":
    os.makedirs(REPOS_DIR_PATH, exist_ok=True)
    for repo_code in REPO_CODES:
        get_repo_readme(repo_code)
