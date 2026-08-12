import os
from pathlib import Path
from fastapi import BackgroundTasks
from fastapi.responses import FileResponse

from app.schemas.export import ExportRequest
from app.services.export_service import export_service


def cleanup_temp_file(file_path: Path):
    """
    Background Task สำหรับลบไฟล์ชั่วคราวและโฟลเดอร์หลังจากจัดส่งให้ Client แล้ว
    """
    try:
        if file_path.exists():
            parent_dir = file_path.parent
            os.remove(file_path)
            if parent_dir.exists() and "tmp" in parent_dir.name.lower():
                os.rmdir(parent_dir)
    except Exception:
        pass


class ExportController:
    async def export_markdown(self, request: ExportRequest, background_tasks: BackgroundTasks) -> FileResponse:
        file_path, filename = await export_service.create_markdown_file(request)
        background_tasks.add_task(cleanup_temp_file, file_path)
        
        return FileResponse(
            path=file_path,
            filename=filename,
            media_type="text/markdown",
            headers={"Content-Disposition": f'attachment; filename="{filename}"'}
        )

    async def export_bundle(self, request: ExportRequest, background_tasks: BackgroundTasks) -> FileResponse:
        zip_path, zip_filename = await export_service.create_zip_bundle(request)
        background_tasks.add_task(cleanup_temp_file, zip_path)

        return FileResponse(
            path=zip_path,
            filename=zip_filename,
            media_type="application/zip",
            headers={"Content-Disposition": f'attachment; filename="{zip_filename}"'}
        )


export_controller = ExportController()