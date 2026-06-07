import re
import easyocr
from langchain_core.output_parsers import StrOutputParser

from core.llm import llm
from extractor.config import CODE_FIXER_PROMPT

reader = easyocr.Reader(["en"])


def extract(file_bytes):
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
    ocr_output = re.sub(r"[^\x00-\x7f]", r"", ocr_output)  # Non ASCII

    chain = CODE_FIXER_PROMPT | llm | StrOutputParser()

    response: str = chain.invoke({"ocr_output": ocr_output})
    response = response.replace("```", "")
