import re
import easyocr
from fastapi import APIRouter, UploadFile, File
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser

from app.src.data_types import CodeExtractorOut
from app.src.configs import llm

router = APIRouter()

reader = easyocr.Reader(["en"])

CODE_FIXER_PROMPT = PromptTemplate.from_template(
    "<|im_start|>system\n"
    "Convert OCR text to clean code. No talk. No markdown. No objects.\n"
    "<|im_end|>\n"
    "<|im_start|>user\n"
    "OCR Text: {ocr_output}\n\n"
    "Fixed Code:\n"
    "<|im_end|>\n"
    "<|im_start|>assistant\n"
    # "<|im_start|>system\n"
    # "You are a code OCR correction tool. Output ONLY the code logic. "
    # "No talk, no backticks, no markdown. Stop immediately after the code."
    # "You are a code OCR correction tool. "
    # "Your task is to fix syntax errors and "
    # "indentation in the provided text. \n"
    # "CRITICAL RULES:\n"
    # "1. Do NOT add imports that aren't in the input.\n"
    # "2. Do NOT add explanations or markdown formatting.\n"
    # "3. Keep the logic exactly as provided, "
    # "only fix the characters and formatting.\n"
    # "4. Fix the syntax errors, correct misread characters "
    # "(like '5' instead of 's'), and ensure proper indentation. "
    # "<|im_end|>"
    # "<|im_start|>user"
    # "Correct this OCR text:"
    # "{ocr_output}<|im_end|>"
    # "<|im_start|>assistant"
)


@router.post("/code-extractor", response_model=CodeExtractorOut)
async def predict(file: UploadFile = File(...)):
    file_bytes = await file.read()

    # TODO: Served EasyOCR model
    # easyocr_uri = "models:/EasyOCR-Standard@champion"
    # model = mlflow.pyfunc.load_model(easyocr_uri)
    #
    # model.predict([file_bytes])[0]
    results = reader.readtext(file_bytes)
    results.sort(
        key=lambda x: x[0][0][1]  # Top-Left Corner of the Bounding Box
    )

    lines = []
    current_y = results[0][0][0][1]
    current_line = []

    for bbox, text, confidence in results:
        if abs(bbox[0][1] - current_y) > 10:
            lines.append(" ".join(current_line))
            current_line = [text]
            current_y = bbox[0][1]
        else:
            current_line.append(text)

    lines.append(" ".join(current_line))
    ocr_output = "\n".join(lines)
    ocr_output = re.sub(r'[^\x00-\x7f]', r'', ocr_output)  # Non ASCII

    chain = CODE_FIXER_PROMPT | llm | StrOutputParser()

    response: str = chain.invoke({"ocr_output": ocr_output})
    response = response.replace("```", "")

    return {"snippet": response}
