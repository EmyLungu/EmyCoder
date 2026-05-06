from pydantic import BaseModel
from typing import List


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


class CodeExtractorOut(BaseModel):
    snippet: str


class ChatIn(BaseModel):
    messages: List[str]
    snippet: str
    output: str


class ChatOut(BaseModel):
    message: str
