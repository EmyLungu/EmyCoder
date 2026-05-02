import time
import random
from pathlib import Path
import joblib
import pandas as pd

from sklearn.feature_extraction.text import HashingVectorizer
from sklearn.linear_model import SGDClassifier
from sklearn.pipeline import make_pipeline
from sklearn.utils.class_weight import compute_class_weight
from sklearn.metrics import accuracy_score, confusion_matrix
import matplotlib.pyplot as plt
from sklearn.metrics import ConfusionMatrixDisplay, classification_report

from meta_features import MetaFeatureExtractor

BASE_DIR = Path(__file__).resolve().parent


class Trainer:
    def __init__(self, dataset: str, params: dict) -> None:
        """Initializes the trainer and its pipeline"""

        self.params = params
        self.seed = self.params["seed"]

        self.df_iter = (
            pd.read_parquet(
                BASE_DIR / f"datasets/{dataset}.parquet",
                columns=["Content", "Language"],
            )
            .sample(frac=1, random_state=self.seed)
            .reset_index(drop=True)
        )

        self.all_classes = self.params["classes"]
        self.df_iter = self.df_iter[
            self.df_iter["Language"].isin(self.all_classes)
        ]

        self.all_labels = self.df_iter["Language"].values

        self.build_pipeline()

    def build_pipeline(self):
        """Builds the pipeline with the given parameters in the constructor"""

        weights = compute_class_weight(
            class_weight="balanced",
            classes=self.all_classes,
            y=self.all_labels,
        )
        weight_dict = dict(zip(self.all_classes, weights))

        vectorizer = HashingVectorizer(
            n_features=self.params["hash_features"],
            analyzer="word",
            ngram_range=(1, 4),
            alternate_sign=False,
            lowercase=False,
        )

        self.model = SGDClassifier(
            loss="hinge",
            penalty="l2",
            eta0=0.01,
            learning_rate="adaptive",
            alpha=1e-5,
            validation_fraction=0.1,
            n_iter_no_change=5,
            random_state=self.seed,
            class_weight=weight_dict,
            # early_stopping=True
        )

        self.pipeline = make_pipeline(
            MetaFeatureExtractor(vectorizer), self.model
        )

    def get_windows(self, content: str, window_size=30, stride=15):
        """
        Transform the content (of a file) into a
        list of snippets of given size
        """

        lines = content.splitlines()

        snippets = []
        for i in range(0, len(lines) - window_size + 1, stride):
            window = lines[i:i + window_size]

            if len("".join(window).strip()) > 50:
                snippets.append("\n".join(window))
        return snippets

    def run(self, chunksize: int = 50_000, test_size: float = 0.2) -> None:
        X_train, y_train = [], []
        self.X_test, self.y_test = [], []

        get_windows = self.get_windows

        sample_size = 1000
        sample_texts = []
        sample_langs = []

        print("Training started")
        start_time = time.perf_counter()

        for i, row in self.df_iter.iterrows():
            if len(sample_texts) >= sample_size:
                break
            windows = get_windows(row["Content"])
            if windows:
                sample_texts.append(windows[0])
                sample_langs.append(row["Language"])

        self.pipeline[0].fit(sample_texts, sample_langs)

        train_size = 0

        random.seed(self.seed)

        # Training loop
        for i, row in self.df_iter.iterrows():
            content = row["Content"]
            lang = row["Language"]

            windows = get_windows(content)

            if random.random() > test_size:
                for s in windows:
                    X_train.append(s)
                    y_train.append(lang)

                    if len(X_train) >= chunksize:
                        X_batch = self.pipeline[0].transform((X_train))
                        self.pipeline[1].partial_fit(
                            X_batch, y_train, classes=self.all_classes
                        )

                        train_size += len(y_train)
                        X_train.clear()
                        y_train.clear()
            else:
                self.X_test.extend(windows)
                self.y_test.extend([lang] * len(windows))

            if i % 10_000 == 0:
                print(f"Train step = {i}")

        # Partial fit on the rest of the training set
        if X_train:
            X_batch = self.pipeline[0].transform((X_train))
            self.pipeline[1].partial_fit(
                X_batch, y_train, classes=self.all_classes
            )
            train_size += len(y_train)
            X_train.clear()
            y_train.clear()

        self.duration = time.perf_counter() - start_time
        minutes = int(self.duration // 60)
        seconds = int(self.duration % 60)
        print(f"Elapsed time: {minutes}min {seconds}s")

    def test(self) -> (float, dict):
        """Prints some statistics and returns the accuracy score"""

        preds = self.pipeline.predict(self.X_test)
        accuracy = accuracy_score(self.y_test, preds)

        print(f"accuracy: {accuracy}")

        cm = confusion_matrix(self.y_test, preds)
        print(cm)
        disp = ConfusionMatrixDisplay(
            confusion_matrix=cm, display_labels=self.model.classes_
        )
        disp.plot(cmap="Blues", values_format="d")
        plt.savefig(BASE_DIR / "confusion_matrix.png")
        plt.close()

        report = classification_report(self.y_test, preds, output_dict=True)

        return accuracy, report

    def save_to_file(self, filename: str) -> None:
        """Saves the pipeline to disk"""

        joblib.dump(
            self.pipeline,
            BASE_DIR / f"models/{filename}.joblib",
            compress=True,
        )

        print(f"Pipeline saved to `models/{filename}.joblib`")

    def __len__(self) -> int:
        return len(self.df_iter)
