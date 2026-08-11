from app.extractors.base import BaseExtractor
from app.extractors.docx_extractor import DOCXExtractor
from app.extractors.dummy_extractor import DummyExtractor
from app.extractors.image_extractor import ImageExtractor
from app.extractors.pdf_extractor import PDFExtractor
from app.schemas.extraction import DocumentType


class ExtractorFactory:
    """
    Factory Class สำหรับคืนค่า Extractor ตามประเภทของเอกสาร
    """
    _extractors = {
        DocumentType.PDF: PDFExtractor(),
        DocumentType.DOCX: DOCXExtractor(),
        DocumentType.IMAGE: ImageExtractor(),
    }

    @classmethod
    def get_extractor(cls, doc_type: DocumentType) -> BaseExtractor:
        return cls._extractors.get(doc_type, DummyExtractor())


extractor_factory = ExtractorFactory()