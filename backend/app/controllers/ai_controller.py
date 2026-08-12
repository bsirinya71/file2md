from app.schemas.ai import ImageAnalysisRequest, ImageAnalysisResponse
from app.schemas.response import APIResponse
from app.services.ai_service import ai_service


class AIController:
    async def analyze_image(self, request: ImageAnalysisRequest) -> APIResponse[ImageAnalysisResponse]:
        data = await ai_service.analyze_image(request)
        
        response_data = ImageAnalysisResponse(
            session_id=data.session_id,
            image_id=data.image_id,
            ai_description=data.ai_description
        )
        return APIResponse.ok(data=response_data)


ai_controller = AIController()