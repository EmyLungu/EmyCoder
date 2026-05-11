import mlflow.pyfunc
import easyocr


class EasyOCRWrapper(mlflow.pyfunc.PythonModel):
    def load_context(self, context):
        self.reader = easyocr.Reader(['en'])

    def predict(self, context, model_input):
        results = self.reader.readtext(model_input)
        return [res[1] for res in results]
