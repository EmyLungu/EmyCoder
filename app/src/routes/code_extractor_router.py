import easyocr
from fastapi import APIRouter, UploadFile, File

from app.src.data_types import CodeExtractorOut
from app.src.configs import llm

router = APIRouter()

reader = easyocr.Reader(["en"])


@router.post("/code-extractor", response_model=CodeExtractorOut)
async def predict(file: UploadFile = File(...)):
    file_bytes = await file.read()
    results = reader.readtext(file_bytes)

    ocr_output = " ".join([text for bbox, text, confidence in results])

    system_msg = (
        "You are a code OCR correction tool. "
        "Your task is to fix syntax errors and "
        "indentation in the provided text. \n"
        "CRITICAL RULES:\n"
        "1. Do NOT add imports that aren't in the input.\n"
        "2. Do NOT add explanations or markdown formatting.\n"
        "3. Keep the logic exactly as provided, "
        "only fix the characters and formatting.\n"
        "4. Fix the syntax errors, correct misread characters "
        "(like '5' instead of 's'), and ensure proper indentation. "
        "5. Return only the code."
    )
    # TODO: Add Example outputs:
    # example_user = "@router.get( /item' ) async def get_item(id:int): return { item_id :id}"
    # example_assistant = "@router.get('/item')\nasync def get_item(id: int):\n    return {'item_id': id}"

    prompt = (
        f"<|im_start|>system\n{system_msg}<|im_end|>\n"
        # f"<|im_start|>user\n{example_user}<|im_end|>\n"
        # f"<|im_start|>assistant\n{example_assistant}<|im_end|>\n"
        f"<|im_start|>user\n{ocr_output}<|im_end|>\n"
        f"<|im_start|>assistant\n"
    )

    output = llm(
        prompt, max_tokens=512, stop=["<|im_end|>"], echo=False, temperature=0
    )

    response = output["choices"][0]["text"]

    return {"snippet": response}
