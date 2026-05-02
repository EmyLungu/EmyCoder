import os

from pathlib import Path
import pandas as pd

from dotenv import load_dotenv

import mlflow
from mlflow.tracking import MlflowClient

MODEL_DIR = Path(__file__).resolve(strict=True).parent

load_dotenv()


def load_models() -> (dict, str):
    models = {}
    best_model = None

    client = MlflowClient(os.getenv("MLFLOW_TRACKING_URI"))
    model_name = "Language-Classifier-SGDC"
    versions = client.search_model_versions(f"name='{model_name}'")

    for v in versions:
        uri = f"models:/{model_name}/{v.version}"

        try:
            model = mlflow.sklearn.load_model(uri)
            models[f"{model_name}-{v.version}"] = model
        except Exception as e:
            print(f"Failed to load model: {uri} [{e}]")

    try:
        champion_version = client.get_model_version_by_alias(
            model_name, "champion"
        )
        best_model = f"{model_name}-{champion_version.version}"
    except Exception as e:
        print(f"Could not resolve '@champion' alias: {e}")
        best_model = models.keys()[0]

    return (models, best_model)


def predict_pipeline(model: dict, model_name: str, text: str) -> str:
    if model_name == "model-0.1.0":
        df = pd.DataFrame({"Content": [text]})
        return model.predict(df)[0]

    return model.predict([text])[0]
