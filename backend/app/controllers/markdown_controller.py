from app.schemas.extraction import ExtractionRequest
from app.schemas.markdown_ast import DocumentAST, MarkdownGenerationResult
from app.schemas.response import APIResponse
from app.services.document_service import document_service
from app.services.markdown_ast_service import markdown_ast_service
from app.services.markdown_generator_service import markdown_generator_service


class MarkdownController:
    async def generate_ast(self, request: ExtractionRequest) -> APIResponse[DocumentAST]:
        extraction_result = await document_service.process_document(session_id=request.session_id)
        ast = markdown_ast_service.build_ast(extraction_result)
        return APIResponse.ok(data=ast)

    async def generate_standard_markdown(self, request: ExtractionRequest) -> APIResponse[MarkdownGenerationResult]:
        extraction_result = await document_service.process_document(session_id=request.session_id)
        ast = markdown_ast_service.build_ast(extraction_result)
        result = markdown_generator_service.generate_standard_markdown(ast)
        return APIResponse.ok(data=result)


markdown_controller = MarkdownController()