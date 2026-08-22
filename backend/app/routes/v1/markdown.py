from fastapi import APIRouter, Query
from app.controllers.markdown_controller import markdown_controller
from app.schemas.extraction import ExtractionRequest
from app.schemas.markdown_ast import (
    DocumentAST,
    LLMMarkdownGenerationResult,
    MarkdownGenerationResult,
)
from app.schemas.response import APIResponse

router = APIRouter()


@router.post("/markdown/ast", response_model=APIResponse[DocumentAST])
async def generate_ast(request: ExtractionRequest):
    return await markdown_controller.generate_ast(request)


@router.post("/markdown/generate", response_model=APIResponse[MarkdownGenerationResult])
async def generate_standard_markdown(request: ExtractionRequest):
    return await markdown_controller.generate_standard_markdown(request)


@router.post("/markdown/generate-llm", response_model=APIResponse[LLMMarkdownGenerationResult])
async def generate_llm_markdown(
    request: ExtractionRequest,
    remove_decorative: bool = Query(True, description="ลบรูปภาพประดับตกแต่งเพื่อประหยัด Token")
):
    return await markdown_controller.generate_llm_markdown(request, remove_decorative)

@router.post("/markdown/optimize")
async def optimize_markdown(request: ExtractionRequest):
    # 1. ดึง Standard Markdown
    std_res = await markdown_controller.generate_standard_markdown(request)
    
    # 2. ดึง LLM-Optimized Markdown
    llm_res = await markdown_controller.generate_llm_markdown(request, remove_decorative=True)
    
    # ดึงข้อความ markdown จาก response object (รองรับทั้ง APIResponse wrapper หรือ dict)
    std_data = std_res.data if hasattr(std_res, 'data') and std_res.data else std_res
    llm_data = llm_res.data if hasattr(llm_res, 'data') and llm_res.data else llm_res

    std_text = getattr(std_data, 'markdown', '') if hasattr(std_data, 'markdown') else std_data.get('markdown', '')
    llm_text = getattr(llm_data, 'markdown', '') if hasattr(llm_data, 'markdown') else llm_data.get('markdown', '')

    # 3. คำนวณ Token Savings (ประมาณการ 1 Token ~ 4 ตัวอักษร)
    std_tokens = max(1, len(std_text) // 4)
    opt_tokens = max(1, len(llm_text) // 4)
    saved_tokens = max(0, std_tokens - opt_tokens)
    savings_pct = (saved_tokens / std_tokens * 100) if std_tokens > 0 else 0.0

    return {
        "success": True,
        "data": {
            "session_id": request.session_id,
            "standard_markdown": std_text,
            "optimized_markdown": llm_text,
            "token_stats": {
                "standard_tokens": std_tokens,
                "optimized_tokens": opt_tokens,
                "saved_tokens": saved_tokens,
                "savings_percentage": round(savings_pct, 1)
            }
        }
    }