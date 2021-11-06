from MQTTManager.app import webapp
from .menu import MAIN_FRAME
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from markupsafe import escape
from fastapi import Request, HTTPException
from fastapi.responses import HTMLResponse, RedirectResponse

SIDE_BAR = MAIN_FRAME["side-bar"]

templates = Jinja2Templates(directory="MQTTManager/routers/templates")

webapp.mount(
    "/static",
    StaticFiles(directory="MQTTManager/routers/templates/static"),
    name="static",
)
