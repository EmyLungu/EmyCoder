import pandas as pd
import re
import os
from dotenv import load_dotenv

load_dotenv()
DATA_DIR = os.getenv('DATA_DIR')


def remove_comments(text: str, language: str) -> str:
    if language in ['c', 'cpp', 'js', 'rs']:
        pattern = r'(//.*?$)|(/\*.*?\*/)'
        return re.sub(pattern, '', text, flags=re.MULTILINE | re.DOTALL)

    elif language == 'py':
        pattern = r'(#.*?$)|(\'\'\'.*?\'\'\')|("""\s*.*?""")'
        return re.sub(pattern, '', text, flags=re.MULTILINE | re.DOTALL)

    text = text.replace(r'\n\s*\n', '\n')

    return text.strip()


def clean(df: pd.DataFrame) -> None:
    df.dropna(subset=['Content'], inplace=True)

    df['Content'] = df.apply(
        lambda row: remove_comments(row['Content'], row['Language']), axis=1
    )


if __name__ == '__main__':
    df = pd.read_csv('data2.csv')
    clean(df)
    df.to_csv(DATA_DIR + 'clean_data2.csv', index=False)
