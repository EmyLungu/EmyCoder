import requests
import random
import pandas as pd
import os
from dotenv import load_dotenv

from upload import batch_upload

load_dotenv()
TOKEN = os.getenv('GITHUB_TOKEN')
DATA_DIR = os.getenv('DATA_DIR')

session = requests.Session()
session.headers.update({'Authorization': f'token {TOKEN}'})


class Scraper():
    def __init__(self, send_limit: int = 1000) -> None:
        self.send_limit = send_limit

        self.data = []

    def scrape(self) -> None:
        repos = self.get_random_repos()

        repo_count: int = 0
        file_count: int = 0

        for repo in repos:
            dirs = ['']

            while dirs:
                curr_path = dirs.pop(0)
                contents: list = self.get_contents(repo, curr_path)

                for content in contents:
                    if content['type'] == 'dir':
                        dirs.append(content['path'])
                    elif content['type'] == 'file':
                        self.process_file(repo, content)
                        file_count += 1

            repo_count += 1
            print(f"Repositories scraped: {repo_count}")
            print(f"Total files  scraped: {file_count}\n")

        batch_upload(pd.DataFrame(self.data))

    def add_row(self, content: str, extenstion: str, repo: str) -> None:
        self.data.append({
            'Content': content,
            'Language': extenstion,
            'Repo': repo
        })

        if len(self.data) > self.send_limit:
            df = pd.DataFrame(self.data)
            batch_upload(df)

            self.data = []

    def get_random_repos(self) -> list:
        url = "https://api.github.com/repositories"
        random_id = random.randint(1, 500_000_000)
        response = session.get(url, params={'since': random_id})

        if response.status_code == 200:
            return [repo['full_name'] for repo in response.json()]
        else:
            print(f"Failed: {response.status_code}")

        return []

    def get_contents(self, repo: str, path: str = '') -> list:
        url = f"https://api.github.com/repos/{repo}/contents/{path}"
        response = session.get(url)

        if response.status_code == 200:
            return response.json()
        else:
            print(f"Failed: {response.status_code}")

        return []

    def process_file(self, repo: str, content) -> None:
        name = content['name']
        if '.' not in name:
            return

        extenstion = name.split('.')[-1].lower()

        if extenstion.lower() not in ['py', 'c', 'cpp', 'rs', 'js']:
            return

        raw_url = content.get('download_url')
        if not raw_url:
            return

        file_resp = session.get(raw_url)
        if file_resp.status_code == 200:
            self.add_row(file_resp.text, extenstion, raw_url)

    # def save(self, filename: str) -> None:
    #     self.df.to_csv(DATA_DIR + filename, index=False)
    #     print(f"Saved scraped data to file ({filename})")


if __name__ == '__main__':
    scraper = Scraper(send_limit=1000)

    scraper.scrape()
