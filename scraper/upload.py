import os
from dotenv import load_dotenv
import hashlib
from pymongo import MongoClient
from pymongo.errors import BulkWriteError
import numpy as np
import pandas as pd

load_dotenv()
MONGODB_URL = os.getenv('MONGODB_URL')

client = MongoClient(MONGODB_URL)
db = client['ml_database']
collection = db['code_snippets']


def get_file_hash(content) -> str:
    return hashlib.sha256(content.encode('utf-8')).hexdigest()


def batch_upload(df: pd.DataFrame) -> None:
    if df.empty:
        return

    df['file_hash'] = df['Content'].apply(get_file_hash)
    df['random_val'] = np.random.rand(len(df))

    data = df.to_dict(orient='records')

    try:
        result = collection.insert_many(data, ordered=False)
        print(f"Successfully inserted {len(result.inserted_ids)} new files.")

    except BulkWriteError as bwe:
        inserted = bwe.details.get('nInserted', 0)
        duplicates = len(data) - inserted
        print(f"Batch processed: {inserted} new,\
                {duplicates} duplicates skipped.")
