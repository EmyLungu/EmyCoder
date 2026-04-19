from fastapi import APIRouter, Request

from app.src.configs import templates, models, VERSION
from app.src.model.model import predict_pipeline

from app.src.data_types import (
    PredictModelIn,
    PredictModelOut,
    PredictAllIn,
    PredictAllOut,
)

router = APIRouter()


@router.get("/lang-predict")
def lang_model(request: Request):
    return templates.TemplateResponse(
        request,
        "lang-predict.html",
        {"version": VERSION, "models": models.keys()},
    )


@router.post("/predict", response_model=PredictModelOut)
def predict(payload: PredictModelIn):
    model_name = "sgdc-pipeline-4"
    if payload.selected_model in models.keys():
        model_name = payload.selected_model

    model = models[model_name]
    language = predict_pipeline(model, model_name, payload.snippet)

    return {"language": language}


@router.post("/predict-all", response_model=PredictAllOut)
def predict_all(payload: PredictAllIn):
    results = []
    for model_name, model in models.items():
        language = predict_pipeline(model, model_name, payload.snippet)
        results.append({"model_name": model_name, "language": language})

    return {"predictions": results}
