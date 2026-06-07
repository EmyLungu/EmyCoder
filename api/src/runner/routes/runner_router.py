import time

from fastapi import APIRouter, Depends

from docker.errors import ContainerError

from classifier.services.classifier_service import get_lang_classifier
from runner.services.runner_service import run_container
from runner.schemas.runner import RunIn, RunOut

router = APIRouter(prefix="/run", tags=["Runner"])


@router.post("/run-snippet", response_model=RunOut)
def run_snippet(payload: RunIn, service=Depends(get_lang_classifier)):
    start_time = time.perf_counter()

    lang = service.predict_pipeline(service.best_model, payload.snippet)[0]
    model = service.best_model.strip(".joblib")

    output = ""
    status = "error"

    try:
        output = run_container(payload.snippet, lang)
        status = "success"

    except ContainerError as e:
        error_output = e.stderr.decode("utf-8")
        output = error_output if error_output else "Execution timed out!"
        status = "error"

    except Exception as e:
        print(f"[RUN SNIPPET - SYSTEM ERORR]: {e}")
        output = "Execution failed!"
        status = "system_failure"

    finally:
        latency = (time.perf_counter() - start_time) * 1000

    return {
        "output": output,
        "language": lang,
        "model": model,
        "status": status,
        "latency": latency,
    }
