import os
import shutil
import tempfile
import zipfile
from pathlib import Path
from typing import Tuple

from app.core.config import settings
from app.core.exceptions import AppException
from app.schemas.export import ExportRequest
from app.schemas.markdown_ast import ImageASTBlock
from app.services.document_service import document_service
from app.services.image_service import image_service
from app.services.markdown_ast_service import markdown_ast_service
from app.services.markdown_generator_service import markdown_generator_service


class ExportService:
    async def create_markdown_file(self, request: ExportRequest) -> Tuple[Path, str]:
        """
        สร้างไฟล์ .md ชั่วคราวและคืนค่า (file_path, filename)
        """
        extraction_result = await document_service.process_document(session_id=request.session_id)
        ast = markdown_ast_service.build_ast(extraction_result)

        # ปรับแก้ Image Asset Path ให้ใช้ Relative Path 'images/filename' สำหรับ Export
        for block in ast.blocks:
            if isinstance(block, ImageASTBlock):
                # ค้นหาไฟล์รูปภาพเดิมเพื่อดึงชื่อไฟล์จริง
                matching_files = list(Path(settings.TEMP_IMAGE_DIR).glob(f"{request.session_id}/{block.image_id}.*"))
                if matching_files:
                    filename = matching_files[0].name
                    block.asset_path = f"images/{filename}"

        result = markdown_generator_service.generate_standard_markdown(ast)

        # สร้างไฟล์ Markdown ชั่วคราว
        clean_title = request.custom_filename or extraction_result.title or "document"
        filename = f"{clean_title}.md"
        
        temp_dir = Path(tempfile.mkdtemp())
        file_path = temp_dir / filename

        with open(file_path, "w", encoding="utf-8") as f:
            f.write(result.markdown)

        return file_path, filename

    async def create_zip_bundle(self, request: ExportRequest) -> Tuple[Path, str]:
        """
        แพ็กไฟล์ document.md และโฟลเดอร์ images/ รวมกันเป็นไฟล์ .zip
        """
        extraction_result = await document_service.process_document(session_id=request.session_id)
        ast = markdown_ast_service.build_ast(extraction_result)

        session_image_dir = image_service.get_session_image_dir(request.session_id)

        # ปรับแก้ Image Asset Path ให้ใช้ Relative Path 'images/filename' สำหรับ ZIP Bundle
        for block in ast.blocks:
            if isinstance(block, ImageASTBlock):
                matching_files = list(session_image_dir.glob(f"{block.image_id}.*"))
                if matching_files:
                    img_filename = matching_files[0].name
                    block.asset_path = f"images/{img_filename}"

        result = markdown_generator_service.generate_standard_markdown(ast)

        clean_title = request.custom_filename or extraction_result.title or "bundle"
        zip_filename = f"{clean_title}_bundle.zip"
        
        temp_dir = Path(tempfile.mkdtemp())
        zip_path = temp_dir / zip_filename

        with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zip_file:
            # 1. เขียนไฟล์ Markdown หลักลง Zip
            zip_file.writestr("document.md", result.markdown)

            # 2. บันทึกรูปภาพใน Session ทั้งหมดลงโฟลเดอร์ images/ ใน Zip
            if session_image_dir.exists():
                for img_file in session_image_dir.glob("*"):
                    if img_file.is_file() and not img_file.name.endswith(".tmp"):
                        zip_file.write(img_file, arcname=f"images/{img_file.name}")

        return zip_path, zip_filename


export_service = ExportService()