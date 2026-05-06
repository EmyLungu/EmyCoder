from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles

from app.src.configs import BASE_DIR, VERSION, templates, lifespan

from app.src.routes.lang_predict_router import router as lang_predict_router
from app.src.routes.run_router import router as run_router
from app.src.routes.code_extractor_router import (
    router as code_extractor_router,
)
from app.src.routes.chat import router as chat_router

app = FastAPI(lifespan=lifespan)
app.mount(
    "/static",
    StaticFiles(directory=str(BASE_DIR / "static")),
    name="static",
)


app.include_router(lang_predict_router)
app.include_router(run_router)
app.include_router(code_extractor_router)
app.include_router(chat_router)


@app.get("/")
def home(request: Request):
    return templates.TemplateResponse(
        request,
        "home.html",
        {"version": VERSION},
    )


@app.middleware("http")
async def add_process_time_header(request, call_next):
    if request.headers.get("x-forwarded-proto") == "https":
        request.scope["scheme"] = "https"
    response = await call_next(request)
    return response
