from pydantic import BaseModel


class RunIn(BaseModel):
    snippet: str


class RunOut(BaseModel):
    output: str
    language: str
    model: str
    status: str
    latency: float
