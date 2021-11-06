# from jinja2 import Template
from .baseimports import *


@webapp.get("/")
async def root():
    # If not prompt login
    # If logged in go to dashboard
    return RedirectResponse("/dashboard")


@webapp.get("/dashboard")
async def dashboard(request: Request):
    global MAIN_FRAME
    page = "/dashboard"
    return templates.TemplateResponse(
        page[1:] + ".htm",
        {
            "request": request,
            "SIDE_BAR": SIDE_BAR,
            "path": page,
            "pTitle": page[1:].capitalize(),
        },
    )


@webapp.get("/profile")
async def dashboard(request: Request):
    global MAIN_FRAME
    page = "/profile"
    return templates.TemplateResponse(
        page[1:] + ".htm",
        {
            "request": request,
            "SIDE_BAR": SIDE_BAR,
            "path": page,
            "pTitle": page[1:].capitalize(),
        },
    )
