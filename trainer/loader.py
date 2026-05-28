import os
from pathlib import Path
from dotenv import load_dotenv
import pandas as pd
from pymongo import MongoClient

BASE_DIR = Path(__file__).resolve().parent
DATASETS_DIR = BASE_DIR / "datasets/"


load_dotenv()
MONGODB_URL = os.getenv("MONGODB_URL")

client = MongoClient(MONGODB_URL)
db = client["ml_database"]
collection = db["code_snippets"]


def export_to_parquet(dataset_name: str, size: int = 0) -> None:
    data = list(
        collection.find({}, {"Content": 1, "Language": 1, "_id": 0}).limit(
            size
        )
    )

    df = pd.DataFrame(data)
    df.to_parquet(
        DATASETS_DIR / (dataset_name + ".parquet"),
        engine="pyarrow",
        compression="snappy",
        index=False,
    )

    print(f"Exported {len(df)} rows to {dataset_name}")


def read_df(dataset_name) -> pd.DataFrame:
    return pd.read_parquet(DATASETS_DIR / (dataset_name + ".parquet"))


if __name__ == "__main__":
    export_to_parquet("dataset-v3")
