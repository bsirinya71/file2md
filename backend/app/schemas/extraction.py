from enum import Enum
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class DocumentType(str, Enum):
    PDF = "pdf"
    DOCX = "docx"
    PPTX = "pptx"
    IMAGE = "image"
    UNKNOWN = "unknown"


class BlockType(str, Enum):
    HEADING = "heading"
    PARAGRAPH = "paragraph"
    LIST_ITEM = "list_item"
    TABLE = "table"
    CODE = "code"
    IMAGE = "image"


class ImageCategory(str, Enum):
    DECORATIVE = "decorative"
    CONTENT = "content"
    IMPORTANT = "important"
    UNKNOWN = "unknown"


class ImageClassificationResult(BaseModel):
    category: ImageCategory
    confidence: float
    score: float
    reasons: List[str] = Field(default_factory=list)


class ImageUrlRef(BaseModel):
    url: str


class ExtractedImageInfo(BaseModel):
    image_id: str
    filename: str
    mime_type: str
    hash_sha256: str
    width: Optional[int] = None
    height: Optional[int] = None
    size_bytes: Optional[int] = None
    saved_path: Optional[str] = None
    page_number: Optional[int] = None
    is_duplicate: bool = False
    duplicate_of: Optional[str] = None
    occurrence_count: int = 1
    preview: Optional[ImageUrlRef] = None
    asset: Optional[ImageUrlRef] = None
    classification: Optional[ImageClassificationResult] = None


class ExtractedBlock(BaseModel):
    block_type: BlockType
    text: Optional[str] = None
    level: Optional[int] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)
    image_info: Optional[ExtractedImageInfo] = None


class ExtractionResult(BaseModel):
    session_id: str
    document_type: DocumentType
    title: Optional[str] = None
    blocks: List[ExtractedBlock] = Field(default_factory=list)
    images: List[ExtractedImageInfo] = Field(default_factory=list)
    metadata: Dict[str, Any] = Field(default_factory=dict)


class ExtractionRequest(BaseModel):
    session_id: str