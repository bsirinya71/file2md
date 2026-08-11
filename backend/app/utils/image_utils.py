import hashlib
import io
import mimetypes
from pathlib import Path
from typing import Optional, Tuple
from PIL import Image


def calculate_sha256(data: bytes) -> str:
    """
    Calculate SHA-256 hash of byte content.
    """
    return hashlib.sha256(data).hexdigest()


def get_image_dimensions(image_bytes: bytes) -> Tuple[Optional[int], Optional[int]]:
    """
    Get (width, height) of an image using Pillow.
    """
    try:
        with Image.open(io.BytesIO(image_bytes)) as img:
            return img.width, img.height
    except Exception:
        return None, None


def create_thumbnail(original_path: Path, thumbnail_path: Path, max_size: Tuple[int, int] = (300, 300)):
    """
    Generate thumbnail/preview image using Pillow while preserving aspect ratio.
    """
    try:
        with Image.open(original_path) as img:
            # Convert RGBA to RGB for JPEG/PNG saving compatibility
            if img.mode in ("RGBA", "P"):
                img = img.convert("RGB")
            
            img.thumbnail(max_size, Image.Resampling.LANCZOS)
            thumbnail_path.parent.mkdir(parents=True, exist_ok=True)
            img.save(thumbnail_path, format="JPEG", quality=85)
    except Exception as e:
        # Fallback: Copy original file if thumbnail generation fails
        import shutil
        shutil.copy(original_path, thumbnail_path)


def get_extension_from_image_format(image_ext_or_mime: str) -> str:
    clean_fmt = image_ext_or_mime.lower().strip(".")
    mapping = {
        "jpeg": ".jpg",
        "jpg": ".jpg",
        "png": ".png",
        "webp": ".webp",
        "gif": ".gif",
        "bmp": ".bmp",
        "image/jpeg": ".jpg",
        "image/png": ".png",
        "image/webp": ".webp",
    }
    if clean_fmt in mapping:
        return mapping[clean_fmt]
    ext = mimetypes.guess_extension(image_ext_or_mime)
    return ext if ext else ".png"


def get_mime_from_extension(ext: str) -> str:
    ext = ext.lower()
    if ext in [".jpg", ".jpeg"]:
        return "image/jpeg"
    elif ext == ".png":
        return "image/png"
    elif ext == ".webp":
        return "image/webp"
    return "application/octet-stream"