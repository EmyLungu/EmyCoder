import os
import time
from pathlib import Path
from dotenv import load_dotenv

import numpy as np
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

    def predict_pipeline(
        self, model_name: str, snippet: str
    ) -> tuple[str, float, dict[str, float], float]:
        start_time = time.perf_counter()

        model = self.models[model_name]

        prediction = model.predict([snippet])[0]

        if hasattr(model, "predict_proba"):
            probabilities = model.predict_proba([snippet])[0]
            confidence = max(probabilities)
            class_confidences = dict(zip(model.classes_, probabilities))
            is_confidence = True

        else:
            decision_scores = model.decision_function([snippet])[0]

            if isinstance(decision_scores, (int, float, np.float64)):
                confidence = float(abs(decision_scores))
                class_confidences = {"raw_decision_score": confidence}
            else:
                confidence = float(max(decision_scores))
                class_confidences = dict(zip(model.classes_, decision_scores))

            is_confidence = False

        latency = (time.perf_counter() - start_time) * 1000

        return (
            prediction,
            is_confidence,
            float(confidence),
            {str(k): float(v) for k, v in class_confidences.items()},
            latency
        )


model_service = ModelService()
