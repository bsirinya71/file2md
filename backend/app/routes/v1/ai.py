from fastapi import APIRouter
from app.controllers.ai_controller import ai_controller
from app.schemas.ai import ImageAnalysisRequest, ImageAnalysisResponse
from app.schemas.response import APIResponse

router = APIRouter()


@router.post("/ai/analyze-image", response_model=APIResponse[ImageAnalysisResponse])
async def analyze_image(request: ImageAnalysisRequest):
    return await ai_controller.analyze_image(request)