from pydantic import BaseModel


class FileUploadData(BaseModel):
    session_id: str
    original_filename: str
    sanitized_filename: str
    saved_path: str
    file_size: int
    mime_type: str


class FileUploadResponse(BaseModel):
    session_id: str
    filename: str
    size: int
    mime_type: str