from fastapi import APIRouter, Request, Depends

from app.src.configs import templates, VERSION, get_model_service

from app.src.data_types import (
    ModelListOut,
    PredictModelIn,
    PredictModelOut,
    PredictAllIn,
    PredictAllOut,
)

router = APIRouter()


@router.get("/lang/lang-predict")
def lang_model(request: Request, service=Depends(get_model_service)):
    return templates.TemplateResponse(
        request,
        "lang-predict.html",
        {"version": VERSION, "models": service.models.keys()},
    )


@router.get("/lang/models", response_model=ModelListOut)
def get_models(service=Depends(get_model_service)):
    return {"models": service.models.keys()}


@router.post("/lang/predict", response_model=PredictModelOut)
def predict(payload: PredictModelIn, service=Depends(get_model_service)):
    model_name = service.best_model
    if payload.model in service.models:
        model_name = payload.model

    prediction, is_conf, confidence, confidences = service.predict_pipeline(
        model_name, payload.snippet
    )

    return {
        "model_name": model_name,
        "language": prediction,
        "is_confidence": is_conf,
        "confidence": confidence,
        "confidences": confidences,
    }


@router.post("/lang/predict-all", response_model=PredictAllOut)
def predict_all(payload: PredictAllIn, service=Depends(get_model_service)):
    results = []
    for model_name in service.models.keys():
        prediction, is_conf, confidence, confidences = (
            service.predict_pipeline(model_name, payload.snippet)
        )

        results.append(
            {
                "model_name": model_name,
                "language": prediction,
                "is_confidence": is_conf,
                "confidence": confidence,
                "confidences": confidences,
            }
        )

    return {"predictions": results}
