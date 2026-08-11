from fastapi import APIRouter
from app.controllers.image_controller import image_controller

router = APIRouter()


@router.get("/images/{session_id}/{image_id}/original")
async def get_original_image(session_id: str, image_id: str):
    return await image_controller.get_original_image(session_id, image_id)


@router.get("/images/{session_id}/{image_id}/preview")
async def get_preview_image(session_id: str, image_id: str):
    return await image_controller.get_preview_image(session_id, image_id)