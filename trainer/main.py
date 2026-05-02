import os
from dotenv import load_dotenv
import numpy as np

import mlflow

from trainer import Trainer, BASE_DIR as TRAINER_BASE_DIR
from meta_features import MetaFeatureExtractor

meta_feature_extractor_path = (
    f"{MetaFeatureExtractor.__module__}.{MetaFeatureExtractor.__name__}"
)

CONFFUSION_MATRIX = TRAINER_BASE_DIR / "confusion_matrix.png"


if __name__ == "__main__":
    load_dotenv()

    params = {
        "seed": 42,
        "classes": np.array(["py", "c", "cpp", "js"], dtype=str),
        "hash_features": 2**20,
    }

    mlflow.set_tracking_uri(os.getenv("MLFLOW_URI"))
    mlflow.set_experiment("Language Classifier")

    with mlflow.start_run(run_name="SGDC"):
        mlflow.log_params(params)

        trainer = Trainer("dataset-v2", params)
        trainer.run()

        accuracy, report = trainer.test()

        mlflow.log_metric("accuracy", accuracy)

        for label, metrics in report.items():
            if isinstance(metrics, dict):
                mlflow.log_metric(f"{label}_f1", metrics['f1-score'])

        mlflow.log_metric("Sample size", len(trainer))
        mlflow.log_metric("Training time", trainer.duration)

        mlflow.sklearn.log_model(
            sk_model=trainer.pipeline,
            name="SGDC",
            serialization_format="skops",
            skops_trusted_types=[meta_feature_extractor_path],
        )
        mlflow.log_artifact(CONFFUSION_MATRIX)
        mlflow.log_artifact(__file__)

    CONFFUSION_MATRIX.unlink(missing_ok=True)
