from fastapi import APIRouter
from app.controllers.extract_controller import extract_controller
from app.schemas.extraction import ExtractionRequest, ExtractionResult
from app.schemas.response import APIResponse

router = APIRouter()


@router.post("/extract", response_model=APIResponse[ExtractionResult])
async def extract_document(request: ExtractionRequest):
    return await extract_controller.extract_document(request)