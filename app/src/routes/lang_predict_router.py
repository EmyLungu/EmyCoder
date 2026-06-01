from fastapi import APIRouter, Depends

from app.src.configs import get_model_service

from app.src.data_types import (
    ModelListOut,
    PredictModelIn,
    PredictModelOut,
    PredictAllIn,
    PredictAllOut,
)

router = APIRouter(prefix="/lang", tags=["Language Classifier"])


@router.get("/models", response_model=ModelListOut)
def get_models(service=Depends(get_model_service)):
    return {"models": service.models.keys()}


@router.post("/predict", response_model=PredictModelOut)
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


@router.post("/predict-all", response_model=PredictAllOut)
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
