import os
from pathlib import Path
from dotenv import load_dotenv
import mlflow
from easyocr_wrapper import EasyOCRWrapper

WRAPPER = Path(__file__).resolve().parent / "easyocr_wrapper.py"

if __name__ == "__main__":
    load_dotenv()

    mlflow.set_tracking_uri(os.getenv("MLFLOW_URI"))
    mlflow.set_experiment("EasyOCR-Standard")

    with mlflow.start_run(run_name="EasyOCR-Standard") as run:
        conda_env = {
            "channels": ["conda-forge"],
            "dependencies": [
                "python=3.14.4",
                "pip",
                {"pip": ["mlflow", "easyocr"]},
            ],
            "name": "ocr_env",
        }

        mlflow.pyfunc.log_model(
            artifact_path="easyocr_model",
            python_model=EasyOCRWrapper(),
            conda_env=conda_env,
            code_paths=[WRAPPER],
            registered_model_name="EasyOCR-Standard",
        )

        print(f"Model saved in run: {run.info.run_id}")
