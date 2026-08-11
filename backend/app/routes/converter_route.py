from fastapi import APIRouter, UploadFile, File, Form
from app.controllers.converter_controller import ConverterController

router = APIRouter(
    prefix="/api/v1/converter",
    tags=["Converter Operations"]
)

@router.post("/convert")
async def convert_file(file: UploadFile = File(...)):
    """แกะข้อความและจัดหมวดหมู่แยกเป็น Blocks ดิบ (header, content, icon, footer)"""
    return await ConverterController.process_file_conversion(file=file)

@router.post("/download")
async def download_markdown(
    content: str = Form(...),
    filename: str = Form("document.md")
):
    """แปลงข้อความ Markdown เป็นไฟล์ .md สำหรับดาวน์โหลด"""
    return ConverterController.generate_download_response(
        content=content,
        filename=filename
    )