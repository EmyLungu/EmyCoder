from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from classifier.models.classifier import lang_classifier_model
from core.config_loader import settings

from user.routes.user_router import router as user_router
from auth.routes.auth_router import router as auth_router
from classifier.routes.classifier_router import router as classifier_router
from runner.routes.runner_router import router as runner_router
from assistant.routes.assistant_router import router as assistant_router
from extractor.routes.extractor_router import router as extractor_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    lang_classifier_model.load_models()

    yield


app = FastAPI(lifespan=lifespan)

app.include_router(auth_router)
app.include_router(user_router)

app.include_router(classifier_router)
app.include_router(runner_router)
app.include_router(assistant_router)
app.include_router(extractor_router)

if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            str(origin).strip("/") for origin in settings.BACKEND_CORS_ORIGINS
        ],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )


@app.middleware("http")
async def add_process_time_header(request, call_next):
    if request.headers.get("x-forwarded-proto") == "https":
        request.scope["scheme"] = "https"
    response = await call_next(request)
    return response
