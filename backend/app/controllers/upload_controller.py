from fastapi import UploadFile
from app.schemas.response import APIResponse
from app.schemas.upload import FileUploadResponse
from app.services.upload_service import upload_service


class UploadController:
    async def upload_file(self, file: UploadFile) -> APIResponse[FileUploadResponse]:
        upload_data = await upload_service.process_file_upload(file)
        
        response_data = FileUploadResponse(
            session_id=upload_data.session_id,
            filename=upload_data.original_filename,
            size=upload_data.file_size,
            mime_type=upload_data.mime_type
        )
        return APIResponse.ok(data=response_data)


upload_controller = UploadController()