from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from fastapi.templating import Jinja2Templates
from pathlib import Path

import os
import tempfile
import docker
from docker.errors import ContainerError

from app.model.model import load_models, predict_pipeline
from app.model.model import __version__ as model_version

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


MAX_OUTPUT_SIZE = 5000
BASE_DIR = Path(__file__).resolve().parent

models = load_models()

app = FastAPI()
app.mount(
    "/static",
    StaticFiles(directory=str(BASE_DIR / "static")),
    name="static",
)
templates = Jinja2Templates(directory=str(BASE_DIR / "templates"))

client = docker.from_env()


class PredictModelIn(BaseModel):
    snippet: str
    selected_model: str


class PredictModelOut(BaseModel):
    language: str


class PredictAllIn(BaseModel):
    snippet: str


class PredictionItem(BaseModel):
    model_name: str
    language: str


class PredictAllOut(BaseModel):
    predictions: list[PredictionItem]


class RunIn(BaseModel):
    snippet: str


class RunOut(BaseModel):
    output: str
    language: str


@app.get("/")
def home(request: Request):
    return templates.TemplateResponse(
        request,
        "home.html",
        {"model_version": model_version},
    )


@app.get("/run")
def run_page(request: Request):
    return templates.TemplateResponse(
        request,
        "run.html",
        {"model_version": model_version},
    )


@app.get("/lang-predict")
def lang_model(request: Request):
    return templates.TemplateResponse(
        request,
        "lang-predict.html",
        {"model_version": model_version, "models": models.keys()},
    )


@app.post("/predict", response_model=PredictModelOut)
def predict(payload: PredictModelIn):
    model_name = "sgdc-pipeline-4"
    if payload.selected_model in models.keys():
        model_name = payload.selected_model

    model = models[model_name]
    language = predict_pipeline(model, model_name, payload.snippet)

    return {"language": language}


@app.post("/predict-all", response_model=PredictAllOut)
def predict_all(payload: PredictAllIn):
    results = []
    for model_name, model in models.items():
        language = predict_pipeline(model, model_name, payload.snippet)
        results.append({"model_name": model_name, "language": language})

    return {"predictions": results}


@app.post("/run-snippet", response_model=RunOut)
def run_snippet(payload: RunIn):
    p = PredictModelIn(
        snippet=payload.snippet, selected_model="sgdc-pipeline-4"
    )
    lang = predict(p).get("language")
    conf = CONFIGS.get(lang)

    try:
        with tempfile.TemporaryDirectory() as tmp_dir:
            os.chmod(tmp_dir, 0o755)
            file_path = os.path.join(tmp_dir, conf["filename"])

            with open(file_path, "w") as f:
                f.write(payload.snippet)

            os.chmod(file_path, 0o644)
            volumes = {tmp_dir: {"bind": "/mnt/code", "mode": "ro"}}

            result = client.containers.run(
                image=conf["image"],
                # command=[
                #     "timeout",
                #     "5s",
                #     "python",
                #     "/mnt/code/user_snippet.py",
                # ],
                command=(
                    ["timeout", "5s"] + conf["command"]
                    if lang != "cpp"
                    else conf["command"]
                ),
                volumes=volumes,
                working_dir="/mnt/code",
                remove=True,
                network_disabled=True,
                mem_limit="256m",
                stdout=True,
                stderr=True,
                user="1000:1000",
                security_opt=["no-new-privileges"],
                cpu_quota=50000,
                pids_limit=20,
                cap_drop=["ALL"],
                # runtime="runsc"
            )

            output = result.decode("utf-8")

        if len(output) > MAX_OUTPUT_SIZE:
            output = output[:MAX_OUTPUT_SIZE] + "\n[Output truncated...]"
        return {"output": output, "language": lang}

    except ContainerError as e:
        error_output = e.stderr.decode("utf-8")
        return {
            "output": error_output if error_output else "Execution timed out!",
            "language": lang,
        }

    except Exception as e:
        print(f"[RUN SNIPPET - SYSTEM ERORR]: {e}")
        return {"output": "Execution failed!", "language": lang}


@app.middleware("http")
async def add_process_time_header(request, call_next):
    if request.headers.get("x-forwarded-proto") == "https":
        request.scope["scheme"] = "https"
    response = await call_next(request)
    return response
