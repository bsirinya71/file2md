from app.core.config import settings
from app.core.exceptions import AppException
from app.providers.ai_base import BaseAIProvider
from app.providers.gemini_provider import GeminiVisionProvider
from app.schemas.ai import ImageAnalysisData, ImageAnalysisRequest
from app.services.image_service import image_service


class AIService:
    def __init__(self):
        self._providers = {
            "gemini": GeminiVisionProvider(),
        }

    def _get_provider(self) -> BaseAIProvider:
        provider = self._providers.get(settings.AI_PROVIDER.lower())
        if not provider:
            raise AppException(
                code="UNSUPPORTED_AI_PROVIDER",
                message=f"ไม่รองรับ AI Provider: {settings.AI_PROVIDER}"
            )
        return provider

    async def analyze_image(self, request: ImageAnalysisRequest) -> ImageAnalysisData:
        # 1. Locate original image file path
        file_path, _ = image_service.get_image_file_path(request.session_id, request.image_id)
        if not file_path or not file_path.exists():
            raise AppException(
                code="IMAGE_NOT_FOUND",
                message=f"ไม่พบรูปภาพ ID '{request.image_id}' ใน Session '{request.session_id}'",
                status_code=404
            )

        # 2. Get AI Provider
        provider = self._get_provider()

        # 3. Perform Vision AI Analysis
        ai_description = await provider.analyze_image(
            image_path=file_path,
            prompt=request.custom_prompt
        )

        # 4. Save AI Description into Image Registry
        image_service.update_ai_description(
            session_id=request.session_id,
            image_id=request.image_id,
            ai_description=ai_description
        )

        return ImageAnalysisData(
            session_id=request.session_id,
            image_id=request.image_id,
            provider_used=settings.AI_PROVIDER,
            ai_description=ai_description
        )


ai_service = AIService()