from fastapi.responses import FileResponse
from app.core.exceptions import AppException
from app.services.image_service import image_service


class ImageController:
    async def get_original_image(self, session_id: str, image_id: str) -> FileResponse:
        file_path, mime_type = image_service.get_image_file_path(session_id, image_id)
        if not file_path or not file_path.exists():
            raise AppException(
                code="IMAGE_NOT_FOUND",
                message=f"ไม่พบไฟล์รูปภาพ ID: {image_id} ใน Session: {session_id}",
                status_code=404
            )
        return FileResponse(path=file_path, media_type=mime_type)

    async def get_preview_image(self, session_id: str, image_id: str) -> FileResponse:
        preview_path, mime_type = image_service.get_or_create_preview_path(session_id, image_id)
        if not preview_path or not preview_path.exists():
            raise AppException(
                code="IMAGE_NOT_FOUND",
                message=f"ไม่พบไฟล์ Preview รูปภาพ ID: {image_id}",
                status_code=404
            )
        return FileResponse(path=preview_path, media_type=mime_type)


image_controller = ImageController()