from pathlib import Path
from app.extractors.base import BaseExtractor
from app.schemas.extraction import DocumentType, ExtractionResult


class DummyExtractor(BaseExtractor):
    async def extract(self, file_path: Path, session_id: str) -> ExtractionResult:
        return ExtractionResult(
            session_id=session_id,
            document_type=DocumentType.UNKNOWN,
            metadata={"status": "Fallback / Unsupported Extractor"}
        )