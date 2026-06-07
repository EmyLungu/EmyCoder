from fastapi import APIRouter, UploadFile, File

from extractor.schemas.extractor import CodeExtractorOut
from extractor.services.extractor_service import extract

router = APIRouter()


@router.post("/code-extractor", response_model=CodeExtractorOut)
async def predict(file: UploadFile = File(...)):
    file_bytes = await file.read()

    response = extract(file_bytes)

    return {"snippet": response}
