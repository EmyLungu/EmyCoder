from fastapi import APIRouter, Depends

import os
import time
import tempfile
from docker.errors import ContainerError

from configs import CONFIGS, MAX_OUTPUT_SIZE, get_model_service
from configs import client

from data_types import RunIn, RunOut

router = APIRouter(prefix="/run", tags=["Code snippet running"])


@router.post("/run-snippet", response_model=RunOut)
def run_snippet(payload: RunIn, service=Depends(get_model_service)):
    start_time = time.perf_counter()

    lang = service.predict_pipeline(service.best_model, payload.snippet)[0]
    model = service.best_model.strip(".joblib")

    conf = CONFIGS.get(lang)

    output = ""
    status = "error"

    try:
        with tempfile.TemporaryDirectory() as tmp_dir:
            os.chmod(tmp_dir, 0o755)
            file_path = os.path.join(tmp_dir, conf["filename"])

            with open(file_path, "w") as f:
                f.write(payload.snippet)

            os.chmod(file_path, 0o644)
            volumes = {tmp_dir: {"bind": "/mnt/code", "mode": "ro"}}

            result = client.containers.run(
                image=conf["image"],
                command=(
                    ["timeout", "5s"] + conf["command"]
                    if lang != "cpp"
                    else conf["command"]
                ),
                volumes=volumes,
                working_dir="/mnt/code",
                remove=True,
                network_disabled=True,
                mem_limit="256m",
                stdout=True,
                stderr=True,
                user="1000:1000",
                security_opt=["no-new-privileges"],
                cpu_quota=50000,
                pids_limit=20,
                cap_drop=["ALL"],
                # runtime="runsc"
            )

            container_output = result.decode("utf-8")

        if len(output) > MAX_OUTPUT_SIZE:
            output = output[:MAX_OUTPUT_SIZE] + "\n[Output truncated...]"

        output = container_output
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
