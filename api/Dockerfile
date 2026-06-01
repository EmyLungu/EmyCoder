FROM python:3.14-slim


WORKDIR /code

RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

COPY ./requirements.txt /code/requirements.txt

RUN pip install --no-cache-dir torch torchvision --index-url https://download.pytorch.org/whl/cpu


RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt


CMD ["fastapi", "dev", "app/src/main.py", "--host", "0.0.0.0", "--port", "80"]
