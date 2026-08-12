from enum import Enum
from typing import Any, Dict, List, Optional, Union
from pydantic import BaseModel, Field
from app.schemas.extraction import ImageClassificationResult


class ASTBlockType(str, Enum):
    HEADING = "heading"
    PARAGRAPH = "paragraph"
    LIST = "list"
    TABLE = "table"
    CODE = "code"
    IMAGE = "image"


class ASTBaseBlock(BaseModel):
    block_type: ASTBlockType
    metadata: Dict[str, Any] = Field(default_factory=dict)


class HeadingASTBlock(ASTBaseBlock):
    block_type: ASTBlockType = ASTBlockType.HEADING
    level: int
    text: str


class ParagraphASTBlock(ASTBaseBlock):
    block_type: ASTBlockType = ASTBlockType.PARAGRAPH
    text: str


class ListItemNode(BaseModel):
    text: str
    level: int = 1


class ListASTBlock(ASTBaseBlock):
    block_type: ASTBlockType = ASTBlockType.LIST
    ordered: bool = False
    items: List[ListItemNode] = Field(default_factory=list)


class TableASTBlock(ASTBaseBlock):
    block_type: ASTBlockType = ASTBlockType.TABLE
    headers: List[str] = Field(default_factory=list)
    rows: List[List[str]] = Field(default_factory=list)


class CodeASTBlock(ASTBaseBlock):
    block_type: ASTBlockType = ASTBlockType.CODE
    language: Optional[str] = None
    code: str


class ImageASTBlock(ASTBaseBlock):
    block_type: ASTBlockType = ASTBlockType.IMAGE
    image_id: str
    alt_text: Optional[str] = None
    asset_path: str
    preview_url: Optional[str] = None
    ai_description: Optional[str] = None
    classification: Optional[ImageClassificationResult] = None


ASTBlock = Union[
    HeadingASTBlock,
    ParagraphASTBlock,
    ListASTBlock,
    TableASTBlock,
    CodeASTBlock,
    ImageASTBlock,
]


class DocumentAST(BaseModel):
    session_id: str
    title: Optional[str] = None
    blocks: List[ASTBlock] = Field(default_factory=list)
    metadata: Dict[str, Any] = Field(default_factory=dict)


class MarkdownGenerationResult(BaseModel):
    session_id: str
    markdown: str
    block_count: int


class LLMMarkdownOptions(BaseModel):
    remove_decorative_images: bool = True
    include_image_tags: bool = True
    estimated_token_saving_percent: Optional[float] = None


class LLMMarkdownGenerationResult(BaseModel):
    session_id: str
    markdown: str
    block_count: int
    filtered_images_count: int
    options_used: LLMMarkdownOptions