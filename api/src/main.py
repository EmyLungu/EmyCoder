from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from configs import lifespan
from core.config_loader import settings

from routes.lang_predict_router import router as lang_predict_router
from routes.run_router import router as run_router
from routes.code_extractor_router import (
    router as code_extractor_router,
)
from routes.chat import router as chat_router
from user.routes.user_router import router as user_router
from auth.routes.auth_router import router as auth_router

app = FastAPI(lifespan=lifespan)

app.include_router(auth_router)
app.include_router(user_router)

app.include_router(lang_predict_router)
app.include_router(run_router)
app.include_router(code_extractor_router)
app.include_router(chat_router)

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
