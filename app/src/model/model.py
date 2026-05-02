import os
from pathlib import Path
from dotenv import load_dotenv

import mlflow
from mlflow.tracking import MlflowClient

MODEL_DIR = Path(__file__).resolve(strict=True).parent

load_dotenv()


class ModelService:
    def __init__(self) -> None:
        self.models = {}
        self.best_model = None

    def load_models(self) -> None:
        client = MlflowClient(os.getenv("MLFLOW_TRACKING_URI"))
        model_name = "Language-Classifier-SGDC"
        versions = client.search_model_versions(f"name='{model_name}'")

        for v in versions:
            uri = f"models:/{model_name}/{v.version}"

            try:
                model = mlflow.sklearn.load_model(uri)
                self.models[f"{model_name}-{v.version}"] = model
            except Exception as e:
                print(f"Failed to load model: {uri} [{e}]")

        try:
            champion_version = client.get_model_version_by_alias(
                model_name, "champion"
            )
            self.best_model = f"{model_name}-{champion_version.version}"
        except Exception as e:
            print(f"Could not resolve '@champion' alias: {e}")
            self.best_model = list(self.models.keys())[0]

    def predict_pipeline(self, model_name: str, snippet: str) -> str:
        model = self.models[model_name]

        return model.predict([snippet])[0]


model_service = ModelService()
