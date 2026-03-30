import pickle
from pathlib import Path
import pandas as pd

__version__ = '0.1.0'

BASE_DIR = Path(__file__).resolve(strict=True).parent


def extract_meta_features(text_series):
    features = pd.DataFrame()
    features['semicolon_density'] = \
        text_series.str.count(';') / text_series.str.len()

    features['brace_ratio'] = \
        (text_series.str.count('{') +
            text_series.str.count('}')) / text_series.str.len()

    features['pointer_marker'] = \
        text_series.str.contains(r'\w+\*').astype(int)

    features['python_marker'] = \
        text_series.str.contains(r'def |elif |import ').astype(int)
    return features.fillna(0)


import __main__
__main__.extract_meta_features = extract_meta_features

with open(f"{BASE_DIR}/model-0.1.0.pkl", 'rb') as file:
    model = pickle.load(file)


def predict_pipeline(text: str) -> str:
    df = pd.DataFrame({'Content': [text]})
    return model.predict(df)[0]
