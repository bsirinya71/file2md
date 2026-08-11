import re
import uuid
from pathlib import Path


def sanitize_filename(filename: str) -> str:
    """
    Sanitize filename to prevent Path Traversal and illegal character attacks.
    """
    if not filename:
        return f"file_{uuid.uuid4().hex[:8]}"

    # Extract base name to defeat path traversal (e.g. ../../etc/passwd -> passwd)
    clean_name = Path(filename).name
    
    # Remove control characters and unsafe special chars
    clean_name = re.sub(r"[^\w\s\.-]", "_", clean_name)
    clean_name = re.sub(r"\s+", "_", clean_name).strip("_")
    
    if not clean_name:
        return f"file_{uuid.uuid4().hex[:8]}"
        
    return clean_name


def generate_session_filename(filename: str) -> str:
    """
    Generate unique filename using UUID prefix to avoid conflicts in temporary storage.
    """
    sanitized = sanitize_filename(filename)
    unique_id = uuid.uuid4().hex
    return f"{unique_id}_{sanitized}"