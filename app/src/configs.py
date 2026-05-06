from fastapi import FastAPI
from fastapi.templating import Jinja2Templates
from contextlib import asynccontextmanager

from llama_cpp import Llama

import docker
from pathlib import Path

from app.src.model.model import model_service

VERSION = "0.1.8"
BASE_DIR = Path(__file__).resolve().parent.parent

MAX_OUTPUT_SIZE = 5000

CONFIGS = {
    "py": {
        "image": "python:3.14-slim",
        "filename": "solution.py",
        "command": ["python", "/mnt/code/solution.py"],
    },
    "js": {
        "image": "node:25-alpine",
        "filename": "solution.js",
        "command": ["node", "/mnt/code/solution.js"],
    },
    "cpp": {
        "image": "gcc:15.2.0",
        "filename": "solution.cpp",
        "command": [
            "sh",
            "-c",
            "g++ /mnt/code/solution.cpp -o /tmp/out && /tmp/out",
        ],
    },
}
CONFIGS["c"] = CONFIGS["cpp"]

client = docker.from_env()

templates = Jinja2Templates(directory=str(BASE_DIR / "templates"))


llm = Llama(
    model_path="./app/src/qwen2.5-coder-1.5b-instruct-q4_k_m.gguf",
    n_ctx=2048,
    n_threads=4,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    model_service.load_models()

    yield


def get_model_service():
    return model_service
