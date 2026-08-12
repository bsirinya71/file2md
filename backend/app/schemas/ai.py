from typing import Optional
from pydantic import BaseModel


class ImageAnalysisRequest(BaseModel):
    session_id: str
    image_id: str
    custom_prompt: Optional[str] = None


class ImageAnalysisData(BaseModel):
    session_id: str
    image_id: str
    provider_used: str
    ai_description: str


class ImageAnalysisResponse(BaseModel):
    session_id: str
    image_id: str
    ai_description: str