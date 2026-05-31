import os
from dotenv import load_dotenv
import numpy as np

import mlflow

from trainer import Trainer, BASE_DIR as TRAINER_BASE_DIR
from meta_features import MetaFeatureExtractor

META_FEATURES = TRAINER_BASE_DIR / "meta_features.py"
META_FEATURES_EXTRACTOR = (
    f"{MetaFeatureExtractor.__module__}.{MetaFeatureExtractor.__name__}"
)


if __name__ == "__main__":
    load_dotenv()

    params = {
        "seed": 42,
        "classes": np.array(["py", "c", "cpp", "js"], dtype=str),
        "hash_features": 2**20,
        "loss": "log_loss"
    }

    mlflow.set_tracking_uri(os.getenv("MLFLOW_URI"))
    mlflow.set_experiment("Language Classifier")

    with mlflow.start_run(run_name="SGDC"):
        mlflow.log_params(params)

        trainer = Trainer("dataset-v2", params)
        trainer.run()

        trainer.test()

        mlflow.sklearn.log_model(
            sk_model=trainer.pipeline,
            registered_model_name="Language-Classifier-SGDC",
            name="SGDC",
            serialization_format="skops",
            skops_trusted_types=[META_FEATURES_EXTRACTOR],
            code_paths=[str(META_FEATURES)],
        )
        mlflow.log_artifact(__file__)
