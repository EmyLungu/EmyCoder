from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from fastapi.templating import Jinja2Templates
from pathlib import Path

from app.model.model import predict_pipeline
from app.model.model import __version__ as model_version

BASE_DIR = Path(__file__).resolve().parent

app = FastAPI()
app.mount(
    "/static",
    StaticFiles(directory=str(BASE_DIR / "static")),
    name="static",
)
templates = Jinja2Templates(directory=str(BASE_DIR / "templates"))


class TextIn(BaseModel):
    text: str


class PredictionOut(BaseModel):
    language: str


@app.get('/')
def home(request: Request):
    return templates.TemplateResponse(request, 'home.html',
                                      {'model_version': model_version})


@app.post('/predict', response_model=PredictionOut)
def predict(payload: TextIn):
    language = predict_pipeline(payload.text)

    return {
            'language': language
            }
