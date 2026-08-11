from pathlib import Path
from typing import Tuple
import puremagic

from app.core.config import settings
from app.core.exceptions import AppException


def validate_file_extension(filename: str) -> str:
    """
    Validate extension against whitelist.
    """
    ext = Path(filename).suffix.lower()
    if not ext or ext not in settings.ALLOWED_EXTENSIONS:
        raise AppException(
            code="UNSUPPORTED_FILE_TYPE",
            message=f"นามสกุลไฟล์ '{ext}' ไม่ได้รับอนุญาต รองรับเฉพาะ: {', '.join(sorted(settings.ALLOWED_EXTENSIONS))}"
        )
    return ext


def detect_mime_type_from_bytes(head_bytes: bytes) -> str:
    """
    Detect real MIME type using Magic Bytes Inspection.
    """
    try:
        matches = puremagic.magic_string(head_bytes)
        if matches:
            return matches[0].mime_type
    except Exception:
        pass
    return "application/octet-stream"


def validate_magic_bytes(head_bytes: bytes, filename: str) -> str:
    """
    Ensure the actual byte content matches allowed MIME types.
    """
    detected_mime = detect_mime_type_from_bytes(head_bytes)
    ext = Path(filename).suffix.lower()

    # Mappings for strict validation fallback
    mime_extension_map = {
        ".pdf": ["application/pdf"],
        ".docx": ["application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/zip"],
        ".pptx": ["application/vnd.openxmlformats-officedocument.presentationml.presentation", "application/zip"],
        ".png": ["image/png"],
        ".jpg": ["image/jpeg"],
        ".jpeg": ["image/jpeg"],
        ".webp": ["image/webp"]
    }

    allowed_mimes_for_ext = mime_extension_map.get(ext, [])
    
    if detected_mime not in settings.ALLOWED_MIME_TYPES and detected_mime not in allowed_mimes_for_ext:
        raise AppException(
            code="INVALID_FILE_CONTENT",
            message=f"เนื้อหาภายในไฟล์ไม่ถูกต้องตรงตามประเภทไฟล์ที่ระบุ (Detected: {detected_mime})"
        )
    return detected_mime