import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()
MONGODB_URL = os.getenv('MONGODB_URL')


def setup_mongodb():
    client = MongoClient(MONGODB_URL)
    db = client["ml_database"]

    if "code_snippets" not in db.list_collection_names():
        db.create_collection(
            "code_snippets",
            storageEngine={
                "wiredTiger": {
                    "configString": "block_compressor=zlib"
                }
            }
        )
        print("Collection 'code_snippets' created with Zlib.")

    collection = db["code_snippets"]
    collection.create_index("file_hash", unique=True)
    collection.create_index("random_val")
    print("Indexes created. Collision protection is ACTIVE.")


if __name__ == '__main__':
    setup_mongodb()
