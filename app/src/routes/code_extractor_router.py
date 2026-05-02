import easyocr

from fastapi import APIRouter, UploadFile, File
from app.src.data_types import CodeExtractorOut

router = APIRouter()

reader = easyocr.Reader(['en'])


@router.post("/code-extractor", response_model=CodeExtractorOut)
async def predict(file: UploadFile = File(...)):
    file_bytes = await file.read()
    results = reader.readtext(file_bytes)

    output = []
    for bbox, text, confidence in results:
        output.append(text)

    return {"snippet": "\n".join(output)}
