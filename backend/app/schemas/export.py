from enum import Enum
from typing import Optional
from pydantic import BaseModel


class ExportFormat(str, Enum):
    MARKDOWN_ONLY = "markdown"
    ZIP_BUNDLE = "bundle"


class ExportRequest(BaseModel):
    session_id: str
    include_ai_descriptions: bool = True
    custom_filename: Optional[str] = None