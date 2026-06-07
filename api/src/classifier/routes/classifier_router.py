from fastapi import APIRouter, Depends

from classifier.services.classifier_service import get_lang_classifier
from classifier.schemas.classifier import (
    ModelList,
    ClassifyIn,
    ClassifyOut,
    ClassifyAllIn,
    ClassifyAllOut,
)

router = APIRouter(prefix="/lang", tags=["Language Classifier"])


@router.get("/models", response_model=ModelList)
def get_models(service=Depends(get_lang_classifier)):
    return {"models": service.models.keys()}


@router.post("/predict", response_model=ClassifyOut)
def predict(payload: ClassifyIn, service=Depends(get_lang_classifier)):
    model_name = service.best_model
    if payload.model in service.models:
        model_name = payload.model

    prediction, is_conf, confidence, confidences, latency = (
        service.predict_pipeline(model_name, payload.snippet)
    )

    return {
        "model_name": model_name,
        "language": prediction,
        "is_confidence": is_conf,
        "confidence": confidence,
        "confidences": confidences,
        "latency": latency,
    }


@router.post("/predict-all", response_model=ClassifyAllOut)
def predict_all(payload: ClassifyAllIn, service=Depends(get_lang_classifier)):
    results = []
    for model_name in service.models.keys():
        prediction, is_conf, confidence, confidences, latency = (
            service.predict_pipeline(model_name, payload.snippet)
        )

        results.append(
            {
                "model_name": model_name,
                "language": prediction,
                "is_confidence": is_conf,
                "confidence": confidence,
                "confidences": confidences,
                "latency": latency,
            }
        )

    return {"predictions": results}
