from fastapi import APIRouter
from app.controllers.health_controller import health_controller
from app.schemas.response import APIResponse

router = APIRouter()


@router.get("/health", response_model=APIResponse)
async def get_health():
    return await health_controller.get_health()