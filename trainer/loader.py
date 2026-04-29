import os
from dotenv import load_dotenv
import pandas as pd
from pymongo import MongoClient

load_dotenv()
MONGODB_URL = os.getenv('MONGODB_URL')

client = MongoClient(MONGODB_URL)
db = client['ml_database']
collection = db['code_snippets']


def export_to_parquet(filename: str = 'dataset.parquet') -> None:
    data = list(collection.find({}, {
        'Content': 1,
        'Language': 1,
        '_id': 0
    }))

    df = pd.DataFrame(data)
    df.to_parquet('trainer/data/' + filename,
                  engine='pyarrow', compression='snappy', index=False)

    print(f"Exported {len(df)} rows to {filename}")


if __name__ == '__main__':
    export_to_parquet('dataset-v3.parquet')
