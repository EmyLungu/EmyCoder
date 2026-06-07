from classifier.models.classifier import LangClassifier, lang_classifier_model


def get_lang_classifier() -> LangClassifier:
    """
    Returns the globally initialized Language Classifier instance.
    Because it was loaded at lifespan startup,
    it contains all the in-memory ML models.
    """
    return lang_classifier_model
