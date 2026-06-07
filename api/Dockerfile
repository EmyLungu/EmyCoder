FROM python:3.14-slim


WORKDIR /code

COPY ./api/requirements.txt /code/requirements.txt

RUN pip install --no-cache-dir torch torchvision --index-url https://download.pytorch.org/whl/cpu

RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

ENV PYTHONPATH=/code/app/src

CMD ["fastapi", "dev", "app/src/main.py", "--host", "0.0.0.0", "--port", "80"]


# UV setup
# COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/
#
# WORKDIR /code
#
# COPY ./pyproject.toml uv.lock ./
#
# RUN uv pip install --no-cache-dir torch torchvision --index-url https://download.pytorch.org/whl/cpu
# RUN uv sync --frozen --no-cache
#
# CMD ["fastapi", "dev", "app/src/main.py", "--host", "0.0.0.0", "--port", "80"]


### pip         2.43GB          537MB           [+] Building 129.0s
### uv          8.71GB         3.02GB           [+] Building 230.0s
