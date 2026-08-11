from abc import ABC, abstractmethod
from pathlib import Path
from app.schemas.extraction import ExtractionResult


class BaseExtractor(ABC):
    """
    Abstract Base Class สำหรับ Extractor ทุกประเภทในระบบ
    """

    @abstractmethod
    async def extract(self, file_path: Path, session_id: str) -> ExtractionResult:
        """
        สกัดเนื้อหา โครงสร้าง และรูปภาพจากไฟล์เอกสาร
        """
        pass