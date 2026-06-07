import os
import tempfile

from runner.models.runner import docker_client
from runner.config import IMAGE_CONFIGS, MAX_OUTPUT_SIZE


def run_container(snippet: str, language: str) -> str:
    conf = IMAGE_CONFIGS.get(language)

    with tempfile.TemporaryDirectory() as tmp_dir:
        os.chmod(tmp_dir, 0o755)
        file_path = os.path.join(tmp_dir, conf["filename"])

        with open(file_path, "w") as f:
            f.write(snippet)

        os.chmod(file_path, 0o644)
        volumes = {tmp_dir: {"bind": "/mnt/code", "mode": "ro"}}

        result = docker_client.containers.run(
            image=conf["image"],
            command=(
                ["timeout", "5s"] + conf["command"]
                if language != "cpp"
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

    if len(container_output) > MAX_OUTPUT_SIZE:
        container_output = (
            container_output[:MAX_OUTPUT_SIZE] + "\n[Output truncated...]"
        )

    return container_output
