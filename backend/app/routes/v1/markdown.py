from fastapi import APIRouter
from app.controllers.markdown_controller import markdown_controller
from app.schemas.extraction import ExtractionRequest
from app.schemas.markdown_ast import DocumentAST, MarkdownGenerationResult
from app.schemas.response import APIResponse

router = APIRouter()


@router.post("/markdown/ast", response_model=APIResponse[DocumentAST])
async def generate_ast(request: ExtractionRequest):
    return await markdown_controller.generate_ast(request)


@router.post("/markdown/generate", response_model=APIResponse[MarkdownGenerationResult])
async def generate_standard_markdown(request: ExtractionRequest):
    return await markdown_controller.generate_standard_markdown(request)