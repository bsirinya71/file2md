from fastapi import APIRouter, File, UploadFile
from app.controllers.upload_controller import upload_controller
from app.schemas.response import APIResponse
from app.schemas.upload import FileUploadResponse

router = APIRouter()


@router.post("/upload", response_model=APIResponse[FileUploadResponse])
async def upload_file(file: UploadFile = File(...)):
    return await upload_controller.upload_file(file)