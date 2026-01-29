import os
import requests
import base64
import json
from icecream import ic
from dotenv import load_dotenv


load_dotenv()


PROJECTS_DIR_PATH = "public/data/projects"
PROJECTS_DATA_PATH = os.path.join(PROJECTS_DIR_PATH, "projects.json")

GITHUB_USERNAME = "ricardofig016"
GITHUB_API_BASE_URL = f"https://api.github.com/repos/{GITHUB_USERNAME}"
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")


def build_headers():
    if not GITHUB_TOKEN:
        raise RuntimeError("GITHUB_TOKEN is not set. Create a personal access token with 'repo' scope and set it in the .env file.")

    return {
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": GITHUB_USERNAME,
        "Authorization": f"token {GITHUB_TOKEN}",
    }


def validate_token_access():
    headers = build_headers()
    response = requests.get("https://api.github.com/user", headers=headers, timeout=30)
    if response.status_code == 401:
        raise RuntimeError("GitHub rejected the provided token (401 Bad credentials). Regenerate the PAT, ensure it has the 'repo' scope, and update .env.")
    if response.status_code != 200:
        raise RuntimeError(f"Failed to validate the GitHub token: {response.status_code} - {response.text}")


def get_request(url):
    headers = build_headers()
    response = requests.get(url, headers=headers)
    if response.status_code != 200:
        print(f"Failed to fetch data: {response.status_code} - {response.text}")
        if response.status_code == 404:
            print("GitHub returned 404. Double-check the project name and ensure your token has access to private repositories.")
        if response.status_code == 401:
            print("GitHub returned 401 Bad credentials. Regenerate the PAT, ensure it has the 'repo' scope, and update .env/.venv.")
        return None
    return response.json()


def get_general_info(project_code):
    url = f"{GITHUB_API_BASE_URL}/{project_code}"
    data = get_request(url)
    if data is None:
        return None

    project_info = {
        "description": data["description"],
        "stars": data["stargazers_count"],
        "forks": data["forks_count"],
        "watchers": data["watchers_count"],
        "issues": data["open_issues_count"],
        "github_url": data["html_url"],
        "website": data["homepage"],
        "private": data["private"],
        "created_at": data["created_at"],
        "updated_at": data["updated_at"],
        "license": data["license"]["name"] if data.get("license") else None,
        "size": data["size"],
        "archived": data["archived"],
    }
    return project_info


def get_readme(project_code):
    url = f"{GITHUB_API_BASE_URL}/{project_code}/readme"
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


def get_commit_count(project_code):
    url = f"{GITHUB_API_BASE_URL}/{project_code}/commits?per_page=1"
    headers = build_headers()
    response = requests.get(url, headers=headers)
    if response.status_code != 200:
        print(f"Failed to fetch commits: {response.status_code}")
        return None
    
    # GitHub returns the total count in the Link header for pagination
    link_header = response.headers.get("Link", "")
    if "last" in link_header:
        # Extract page number from last page link
        import re
        match = re.search(r'page=(\d+)>; rel="last"', link_header)
        if match:
            return int(match.group(1))
    
    # If no pagination, just count the returned commits
    return len(response.json())


def get_images(project_code):
    images_path = os.path.join(PROJECTS_DIR_PATH, project_code, "images")
    os.makedirs(images_path, exist_ok=True)

    image_file_names = []
    for filename in os.listdir(images_path):
        if os.path.isfile(os.path.join(images_path, filename)):
            image_file_names.append(filename)

    return image_file_names


def get_documents(project_code):
    documents_path = os.path.join(PROJECTS_DIR_PATH, project_code, "documents")
    os.makedirs(documents_path, exist_ok=True)

    document_file_names = []
    for filename in os.listdir(documents_path):
        if os.path.isfile(os.path.join(documents_path, filename)):
            document_file_names.append(filename)

    return document_file_names


def save_readme(project_code, file_path):
    project_readme = get_readme(project_code)
    if project_readme is None:
        raise RuntimeError(f"Unable to download README for {project_code}. Verify the repo exists and that your token includes private repo access.")
    with open(file_path, "w", encoding="utf-8") as file:
        file.write(project_readme)
    return project_readme


def save_basic_info(project_code, curr_id, projects_data, readme, file_path):
    project_info = {}
    project_info["id"] = curr_id
    project_info["code"] = project_code

    general_info = get_general_info(project_code)
    if general_info is None:
        raise RuntimeError(f"Unable to fetch general metadata for {project_code}. Previous API call failed; see the log output for details.")
    for key, value in general_info.items():
        project_info[key] = value

    project_info["name"] = get_name(readme)
    project_info["images"] = get_images(project_code)
    project_info["documents"] = get_documents(project_code)
    project_info["commit_count"] = get_commit_count(project_code)

    project_info["featured"] = projects_data[project_code]["featured"]
    if project_info["featured"] and projects_data[project_code]["image"] and projects_data[project_code]["image"] in project_info["images"]:
        project_info["image"] = projects_data[project_code]["image"]
    else:
        project_info["image"] = None

    project_info["context"] = projects_data[project_code]["context"]
    project_info["technologies"] = projects_data[project_code]["technologies"]

    with open(file_path, "w", encoding="utf-8") as file:
        json.dump(project_info, file, indent=2, sort_keys=True)

    return project_info


def main():
    os.makedirs(PROJECTS_DIR_PATH, exist_ok=True)

    validate_token_access()

    with open(PROJECTS_DATA_PATH, "r", encoding="utf-8") as f:
        projects_data = json.load(f)

    curr_id = 0
    for project_code in list(projects_data.keys()):
        print(f"Fetching data for {project_code}...")

        project_folder_path = os.path.join(PROJECTS_DIR_PATH, project_code)
        os.makedirs(project_folder_path, exist_ok=True)

        # ReadMe
        readme_path = os.path.join(project_folder_path, "README.md")
        readme = save_readme(project_code, readme_path)

        # Basic Info
        info_json_path = os.path.join(project_folder_path, "info.json")
        info = save_basic_info(project_code, curr_id, projects_data, readme, info_json_path)

        curr_id += 1

    # Index
    index_path = os.path.join(PROJECTS_DIR_PATH, "index.json")
    with open(index_path, "w", encoding="utf-8") as f:
        json.dump(list(projects_data.keys()), f, indent=2)


if __name__ == "__main__":
    main()
