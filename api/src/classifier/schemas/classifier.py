from pydantic import BaseModel


class ModelList(BaseModel):
    models: list[str]


class ClassifyIn(BaseModel):
    snippet: str
    model: str


class ClassifyOut(BaseModel):
    model_name: str
    language: str
    is_confidence: bool
    confidence: float
    confidences: dict[str, float]
    latency: float


class ClassifyAllIn(BaseModel):
    snippet: str


class ClassifyAllOut(BaseModel):
    predictions: list[ClassifyOut]
