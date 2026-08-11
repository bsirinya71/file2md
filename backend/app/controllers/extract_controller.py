from app.schemas.extraction import ExtractionRequest, ExtractionResult
from app.schemas.response import APIResponse
from app.services.document_service import document_service


class ExtractController:
    async def extract_document(self, request: ExtractionRequest) -> APIResponse[ExtractionResult]:
        result = await document_service.process_document(session_id=request.session_id)
        return APIResponse.ok(data=result)


extract_controller = ExtractController()