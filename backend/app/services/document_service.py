from pathlib import Path
from app.core.config import settings
from app.core.exceptions import AppException
from app.extractors.factory import extractor_factory
from app.schemas.extraction import ExtractionResult
from app.utils.document_detector import document_detector


class DocumentService:
    def __init__(self):
        self.upload_dir = Path(settings.TEMP_UPLOAD_DIR)

    async def process_document(self, session_id: str) -> ExtractionResult:
        # หาไฟล์อัปโหลดใน temp_uploads ตาม session_id
        matching_files = list(self.upload_dir.glob(f"{session_id}.*"))
        if not matching_files:
            raise AppException(
                code="SESSION_NOT_FOUND",
                message=f"ไม่พบไฟล์สำหรับ Session ID: {session_id}"
            )

        file_path = matching_files[0]

        # 1. Detect Document Type
        doc_type = document_detector.detect_document_type(file_path)

        # 2. Get Appropriate Extractor
        extractor = extractor_factory.get_extractor(doc_type)

        # 3. Perform Extraction
        return await extractor.extract(file_path=file_path, session_id=session_id)


document_service = DocumentService()