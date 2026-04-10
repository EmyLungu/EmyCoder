from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from fastapi.templating import Jinja2Templates
from pathlib import Path

from app.model.model import load_models, predict_pipeline
from app.model.model import __version__ as model_version

BASE_DIR = Path(__file__).resolve().parent

models = load_models()

app = FastAPI()
app.mount(
    "/static",
    StaticFiles(directory=str(BASE_DIR / "static")),
    name="static",
)
templates = Jinja2Templates(directory=str(BASE_DIR / "templates"))


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


@app.get("/")
def home(request: Request):
    return templates.TemplateResponse(
        request,
        "home.html",
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
