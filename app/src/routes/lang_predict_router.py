from fastapi import APIRouter, Request, Depends

from app.src.configs import templates, VERSION, get_model_service

from app.src.data_types import (
    PredictModelIn,
    PredictModelOut,
    PredictAllIn,
    PredictAllOut,
)

router = APIRouter()


@router.get("/lang-predict")
def lang_model(request: Request, service=Depends(get_model_service)):
    return templates.TemplateResponse(
        request,
        "lang-predict.html",
        {"version": VERSION, "models": service.models.keys()},
    )


@router.post("/predict", response_model=PredictModelOut)
def predict(payload: PredictModelIn, service=Depends(get_model_service)):
    model_name = service.best_model
    if payload.selected_model in service.models:
        model_name = payload.selected_model

    language = service.predict_pipeline(model_name, payload.snippet)

    return {"language": language}


@router.post("/predict-all", response_model=PredictAllOut)
def predict_all(payload: PredictAllIn, service=Depends(get_model_service)):
    results = []
    for model_name in service.models.keys():
        language = service.predict_pipeline(model_name, payload.snippet)
        results.append({"model_name": model_name, "language": language})

    return {"predictions": results}
