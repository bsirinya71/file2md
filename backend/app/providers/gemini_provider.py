from pathlib import Path
from PIL import Image
from google import genai

from app.core.config import settings
from app.core.exceptions import AppException
from app.providers.ai_base import BaseAIProvider


class GeminiVisionProvider(BaseAIProvider):
    def __init__(self):
        if not settings.GEMINI_API_KEY:
            self.client = None
        else:
            self.client = genai.Client(api_key=settings.GEMINI_API_KEY)

    async def analyze_image(self, image_path: Path, prompt: str = None) -> str:
        if not self.client:
            raise AppException(
                code="AI_CONFIG_ERROR",
                message="ยังไม่ได้ตั้งค่า GEMINI_API_KEY ในระบบ"
            )

        if not image_path.exists():
            raise AppException(
                code="FILE_NOT_FOUND",
                message=f"ไม่พบไฟล์รูปภาพ: {image_path}"
            )

        default_prompt = (
            "Analyze this image extracted from a document. "
            "Provide a clear, concise, and informative description suitable for markdown context. "
            "Describe key visual elements, charts, tables, or diagram meanings if present."
        )
        final_prompt = prompt or default_prompt

        try:
            pil_img = Image.open(image_path)
            response = self.client.models.generate_content(
                model=settings.GEMINI_MODEL,
                contents=[pil_img, final_prompt]
            )
            
            if response and response.text:
                return response.text.strip()
            return "No description generated."
        except Exception as e:
            raise AppException(
                code="AI_ANALYSIS_FAILED",
                message=f"การวิเคราะห์รูปภาพด้วย Vision AI ล้มเหลว: {str(e)}"
            )