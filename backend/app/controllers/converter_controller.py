import os
import tempfile
from fastapi import UploadFile, HTTPException
from fastapi.responses import Response
from markitdown import MarkItDown
from app.services.ocr_service import OCRService
from app.utils.block_parser import parse_text_into_blocks

md_converter = MarkItDown()
IMAGE_EXTENSIONS = {'.png', '.jpg', '.jpeg', '.webp', '.bmp'}

class ConverterController:
    
    @staticmethod
    async def process_file_conversion(file: UploadFile) -> dict:
        if not file:
            raise HTTPException(status_code=400, detail="No file uploaded")

        file_extension = os.path.splitext(file.filename)[1].lower()

        try:
            content = await file.read()

            # 1. OCR หรือแกะข้อความดิบออกมาจากไฟล์
            if file_extension in IMAGE_EXTENSIONS:
                raw_text = OCRService.extract_text_from_image_bytes(content)
            else:
                with tempfile.NamedTemporaryFile(delete=False, suffix=file_extension) as temp_file:
                    temp_file.write(content)
                    temp_file_path = temp_file.name

                result = md_converter.convert(temp_file_path)
                raw_text = result.text_content

                if os.path.exists(temp_file_path):
                    os.remove(temp_file_path)

            # 2. จัดหมวดหมู่แยกข้อความออกเป็น Blocks ดิบ
            blocks = parse_text_into_blocks(raw_text)

            # 3. ส่งคืนผลลัพธ์โครงสร้างใหม่
            return {
                "success": True,
                "filename": file.filename,
                "blocks": blocks
            }

        except Exception as e:
            if 'temp_file_path' in locals() and os.path.exists(temp_file_path):
                os.remove(temp_file_path)
            
            raise HTTPException(
                status_code=500, 
                detail=f"Failed to process file: {str(e)}"
            )

    @staticmethod
    def generate_download_response(content: str, filename: str) -> Response:
        clean_filename = os.path.splitext(filename)[0] + ".md"
        return Response(
            content=content,
            media_type="text/markdown",
            headers={
                "Content-Disposition": f"attachment; filename={clean_filename}"
            }
        )