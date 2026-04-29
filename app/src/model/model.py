import __main__
import re
import pickle
import joblib
from pathlib import Path
import pandas as pd

from app.src.model.features import extract_meta_features, MetaFeatureExtractor

__main__.extract_meta_features = extract_meta_features
__main__.MetaFeatureExtractor = MetaFeatureExtractor

MODEL_DIR = Path(__file__).resolve(strict=True).parent


def load_models() -> (dict, str):
    models = {}

    models_dir = Path(f"{MODEL_DIR}/models/")

    best_model = "sgdc-pipeline-4.joblib"
    current_best = -1

    for file_path in models_dir.iterdir():
        if file_path.is_file():
            ext = file_path.suffix.lower()

            if ext == ".pkl":
                with open(file_path, "rb") as file:
                    models[file_path.stem] = pickle.load(file)
            if ext == ".joblib":
                models[file_path.stem] = joblib.load(file_path)

        pattern = r".+-(\d+)"
        current = int(re.search(pattern, file_path.stem).group(1))
        current_best = max(current_best, current)

    best_model = f"sgdc-pipeline-{current_best}.joblib"
    return (models, best_model)


def predict_pipeline(model: dict, model_name: str, text: str) -> str:
    if model_name == "model-0.1.0":
        df = pd.DataFrame({"Content": [text]})
        return model.predict(df)[0]

    return model.predict([text])[0]
