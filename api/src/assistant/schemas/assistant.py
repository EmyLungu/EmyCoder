from pydantic import BaseModel


class ChatIn(BaseModel):
    messages: list[str]
    snippet: str
    output: str


class ChatOut(BaseModel):
    message: str
