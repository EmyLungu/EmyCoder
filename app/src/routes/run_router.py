from fastapi import APIRouter, Request, Depends

import os
import tempfile
from docker.errors import ContainerError

from app.src.configs import CONFIGS, MAX_OUTPUT_SIZE, get_model_service
from app.src.configs import templates, VERSION, client

from app.src.data_types import RunIn, RunOut

router = APIRouter()


@router.get("/run")
def run_page(request: Request):
    return templates.TemplateResponse(
        request,
        "run.html",
        {"version": VERSION},
    )


@router.post("/run-snippet", response_model=RunOut)
def run_snippet(payload: RunIn, service=Depends(get_model_service)):
    lang = service.predict_pipeline(service.best_model, payload.snippet)
    lang_output = f"{lang} - {service.best_model.strip(".joblib")}"

    conf = CONFIGS.get(lang)

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

            output = result.decode("utf-8")

        if len(output) > MAX_OUTPUT_SIZE:
            output = output[:MAX_OUTPUT_SIZE] + "\n[Output truncated...]"
        return {"output": output, "language": lang_output}

    except ContainerError as e:
        error_output = e.stderr.decode("utf-8")
        return {
            "output": error_output if error_output else "Execution timed out!",
            "language": lang_output,
        }

    except Exception as e:
        print(f"[RUN SNIPPET - SYSTEM ERORR]: {e}")
        return {"output": "Execution failed!", "language": lang_output}
