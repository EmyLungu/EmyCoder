from sklearn.preprocessing import StandardScaler
from sklearn.base import BaseEstimator, TransformerMixin
from scipy.sparse import csr_matrix, hstack
import pandas as pd


class MetaFeatureExtractor(BaseEstimator, TransformerMixin):
    def __init__(self, vectorizer):
        self.vectorizer = vectorizer
        self.scaler = StandardScaler(with_mean=False)

    def fit(self, X, y=None):
        X_meta = self.extract_meta_features(pd.Series(X))
        self.scaler.fit(X_meta.values)
        return self

    def extract_meta_features(self, text_series) -> pd.DataFrame:
        features = pd.DataFrame()
        features["semicolon_density"] = (
            text_series.str.count(";") / text_series.str.len()
        )
        features["brace_ratio"] = (
            text_series.str.count("{") + text_series.str.count("}")
        ) / text_series.str.len()
        features["pointer_marker"] = text_series.str.contains(r"\w+\*").astype(
            int
        )
        features["python_marker"] = text_series.str.contains(
            r"\bdef\b|\belif\b"
        ).astype(int)
        features["cpp_marker"] = text_series.str.contains(
            r"std::|template<|public:|private:"
        ).astype(int)
        features["js_marker"] = text_series.str.contains(
            r"\blet\b|\bfunction\b|=>"
        ).astype(int)

        # C++
        features["has_class"] = text_series.str.contains(r"\bclass\b").astype(
            int
        )
        features["has_namespace"] = text_series.str.contains(
            r"\bnamespace\b"
        ).astype(int)
        features["has_template"] = text_series.str.contains(
            r"\btemplate\b"
        ).astype(int)
        features["has_using"] = text_series.str.contains(r"\busing\b").astype(
            int
        )
        features["has_cpp_keywords"] = text_series.str.contains(
            r"\bnew\b|\bdelete\b|\bcout\b|\bcin\b|\bpublic:\b|\bprivate:\b|"
            "\bprotected:\b|\bvirtual\b|\boverride\b|\bconstexpr\b|\bauto\b|"
            "\bnullptr\b"
        ).astype(int)
        features["scope_resolution"] = text_series.str.count("::") / (
            text_series.str.len() + 1
        )

        # C specific (but not in C++)
        features["has_c_keywords"] = text_series.str.contains(
            r"\bprintf\b|\bscanf\b|\bmalloc\b|\bfree\b"
        ).astype(int)

        # Python specific
        features["has_python_decorator"] = text_series.str.contains(
            r"@\w+"
        ).astype(int)
        features["has_self"] = text_series.str.contains(r"\bself\b").astype(
            int
        )
        features["has_import_from"] = text_series.str.contains(
            r"\bfrom\s+\S+\s+import\b"
        ).astype(int)

        # JavaScript specific
        features["has_arrow_func"] = text_series.str.contains(r"=>").astype(
            int
        )
        features["has_let_const"] = text_series.str.contains(
            r"\blet\b|\bconst\b"
        ).astype(int)
        features["has_console"] = text_series.str.contains(
            r"\bconsole\."
        ).astype(int)

        # Preprocessor directives (C/C++)
        features["preprocessor_count"] = text_series.str.count(r"^\s*#")

        # Comment styles
        features["cpp_comment_density"] = text_series.str.count(r"//") / (
            text_series.str.len() + 1
        )
        features["c_comment_density"] = text_series.str.count(r"/\*.*?\*/") / (
            text_series.str.len() + 1
        )
        features["python_comment_density"] = text_series.str.count(r"#") / (
            text_series.str.len() + 1
        )
        return features.fillna(0)

    def transform(self, X):
        X_text = self.vectorizer.transform(X)

        X_meta = self.extract_meta_features(pd.Series(X))
        X_meta_scaled = self.scaler.transform(X_meta.values)

        return hstack([X_text, csr_matrix(X_meta_scaled)])
