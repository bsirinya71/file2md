from fastapi import APIRouter, BackgroundTasks
from app.controllers.export_controller import export_controller
from app.schemas.export import ExportRequest

router = APIRouter()


@router.post("/export/markdown")
async def export_markdown(request: ExportRequest, background_tasks: BackgroundTasks):
    return await export_controller.export_markdown(request, background_tasks)


@router.post("/export/bundle")
async def export_bundle(request: ExportRequest, background_tasks: BackgroundTasks):
    return await export_controller.export_bundle(request, background_tasks)