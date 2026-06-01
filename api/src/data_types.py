from pydantic import BaseModel
from typing import List


class ModelListOut(BaseModel):
    models: list[str]


class PredictModelIn(BaseModel):
    snippet: str
    model: str


class PredictModelOut(BaseModel):
    model_name: str
    language: str
    is_confidence: bool
    confidence: float
    confidences: dict[str, float]


class PredictAllIn(BaseModel):
    snippet: str


class PredictAllOut(BaseModel):
    predictions: list[PredictModelOut]


class RunIn(BaseModel):
    snippet: str


class RunOut(BaseModel):
    output: str
    language: str
    model: str
    status: str


class CodeExtractorOut(BaseModel):
    snippet: str


class ChatIn(BaseModel):
    messages: List[str]
    snippet: str
    output: str


class ChatOut(BaseModel):
    message: str
