from pathlib import Path
from app.extractors.base import BaseExtractor
from app.schemas.extraction import (
    BlockType,
    DocumentType,
    ExtractedBlock,
    ExtractionResult,
)
from app.services.image_service import image_service


class ImageExtractor(BaseExtractor):
    async def extract(self, file_path: Path, session_id: str) -> ExtractionResult:
        image_service.clear_session_registry(session_id)

        with open(file_path, "rb") as f:
            image_bytes = f.read()

        image_info = image_service.save_image_bytes(
            session_id=session_id,
            image_bytes=image_bytes,
            ext_or_format=file_path.suffix
        )

        blocks = [
            ExtractedBlock(
                block_type=BlockType.IMAGE,
                text=None,
                image_info=image_info
            )
        ]

        return ExtractionResult(
            session_id=session_id,
            document_type=DocumentType.IMAGE,
            title=file_path.stem,
            blocks=blocks,
            images=[image_info],
            metadata={"unique_image_count": 1}
        )