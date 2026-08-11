from pathlib import Path
import puremagic
from app.schemas.extraction import DocumentType


class DocumentDetector:
    @staticmethod
    def detect_document_type(file_path: Path) -> DocumentType:
        """
        ตรวจหาประเภทของเอกสารจาก Extension และ Magic Bytes
        """
        ext = file_path.suffix.lower()

        if ext == ".pdf":
            return DocumentType.PDF
        elif ext == ".docx":
            return DocumentType.DOCX
        elif ext == ".pptx":
            return DocumentType.PPTX
        elif ext in [".png", ".jpg", ".jpeg", ".webp"]:
            return DocumentType.IMAGE

        # Fallback ด้วย Magic Bytes
        try:
            matches = puremagic.magic_file(str(file_path))
            if matches:
                mime = matches[0].mime_type
                if "pdf" in mime:
                    return DocumentType.PDF
                elif "wordprocessingml" in mime:
                    return DocumentType.DOCX
                elif "presentationml" in mime:
                    return DocumentType.PPTX
                elif "image" in mime:
                    return DocumentType.IMAGE
        except Exception:
            pass

        return DocumentType.UNKNOWN


document_detector = DocumentDetector()