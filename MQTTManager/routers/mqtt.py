from .baseimports import *


@webapp.get("/mqtt/{page}")
async def mqtt(request: Request, page: str):
    global MAIN_FRAME
    if page not in MAIN_FRAME["side-bar"]["mqtt"]:
        raise HTTPException(status_code=404, detail="Not Found")
    return templates.TemplateResponse(
        "/mqtt/" + page + ".htm",
        {
            "request": request,
            "SIDE_BAR": SIDE_BAR,
            "path": "/mqtt/" + page,
            "pTitle": "MQTT - " + page,
        },
    )


@webapp.get("/mqtt/security/{page}")
async def mqtt(request: Request, page: str):
    global MAIN_FRAME
    basePath = "/mqtt/security/"
    if page not in MAIN_FRAME["side-bar"]["mqtt"]:
        raise HTTPException(status_code=404, detail="Not Found")
    return templates.TemplateResponse(
        basePath + page + ".htm",
        {
            "request": request,
            "SIDE_BAR": SIDE_BAR,
            "path": basePath + page,
            "pTitle": "MQTT - " + page,
        },
    )
