from pydantic import BaseModel


class CodeExtractorOut(BaseModel):
    snippet: str
