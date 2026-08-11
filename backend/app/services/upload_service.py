import os
import shutil
import uuid
from pathlib import Path
from fastapi import UploadFile

from app.core.config import settings
from app.core.exceptions import AppException
from app.schemas.upload import FileUploadData
from app.utils.file_validation import validate_file_extension, validate_magic_bytes
from app.utils.filename_utils import generate_session_filename, sanitize_filename


class UploadService:
    def __init__(self):
        self.upload_dir = Path(settings.TEMP_UPLOAD_DIR)
        self.upload_dir.mkdir(parents=True, exist_ok=True)

    async def process_file_upload(self, file: UploadFile) -> FileUploadData:
        if not file.filename:
            raise AppException(code="EMPTY_FILENAME", message="ไม่พบชื่อไฟล์")

        # 1. Extension Validation
        sanitized_original = sanitize_filename(file.filename)
        ext = validate_file_extension(sanitized_original)

        # 2. Read Magic Header Bytes (First 2048 Bytes)
        head_bytes = await file.read(2048)
        if not head_bytes:
            raise AppException(code="EMPTY_FILE", message="ไฟล์ที่อัปโหลดไม่มีข้อมูล")

        # 3. Magic Bytes Inspection
        detected_mime = validate_magic_bytes(head_bytes, sanitized_original)

        # Reset pointer back to 0
        await file.seek(0)

        # 4. Stream File to Temp Disk & Check Size Limit
        session_id = uuid.uuid4().hex
        stored_filename = f"{session_id}{ext}"
        destination_path = self.upload_dir / stored_filename

        total_size = 0
        try:
            with open(destination_path, "wb") as buffer:
                while chunk := await file.read(1024 * 1024):  # Read 1MB chunk
                    total_size += len(chunk)
                    if total_size > settings.max_upload_size_bytes:
                        raise AppException(
                            code="FILE_TOO_LARGE",
                            message=f"ขนาดไฟล์เกินกำหนดสูงสุด ({settings.MAX_UPLOAD_SIZE_MB}MB)"
                        )
                    buffer.write(chunk)
        except Exception as e:
            if destination_path.exists():
                destination_path.unlink()
            if isinstance(e, AppException):
                raise e
            raise AppException(code="UPLOAD_FAILED", message=f"การบันทึกไฟล์ล้มเหลว: {str(e)}")
        finally:
            await file.close()

        return FileUploadData(
            session_id=session_id,
            original_filename=sanitized_original,
            sanitized_filename=stored_filename,
            saved_path=str(destination_path),
            file_size=total_size,
            mime_type=detected_mime
        )


upload_service = UploadService()