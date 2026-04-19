from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles

from app.src.configs import BASE_DIR, VERSION, templates

from app.src.routes.lang_predict_router import router as lang_predict_router
from app.src.routes.run_router import router as run_router

app = FastAPI()
app.mount(
    "/static",
    StaticFiles(directory=str(BASE_DIR / "static")),
    name="static",
)


app.include_router(lang_predict_router)
app.include_router(run_router)


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
