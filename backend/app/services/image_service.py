import uuid
from pathlib import Path
from typing import Dict, Tuple

from app.core.config import settings
from app.schemas.extraction import ExtractedImageInfo, ImageUrlRef
from app.services.image_classifier import image_classifier
from app.utils.image_utils import (
    calculate_sha256,
    create_thumbnail,
    get_extension_from_image_format,
    get_image_dimensions,
    get_mime_from_extension,
)


class ImageService:
    def __init__(self):
        self.base_image_dir = Path(settings.TEMP_IMAGE_DIR)
        self.base_image_dir.mkdir(parents=True, exist_ok=True)
        self._session_hash_registry: Dict[str, Dict[str, ExtractedImageInfo]] = {}

    def get_session_image_dir(self, session_id: str) -> Path:
        session_dir = self.base_image_dir / session_id
        session_dir.mkdir(parents=True, exist_ok=True)
        return session_dir

    def get_session_preview_dir(self, session_id: str) -> Path:
        preview_dir = self.base_image_dir / session_id / "previews"
        preview_dir.mkdir(parents=True, exist_ok=True)
        return preview_dir

    def clear_session_registry(self, session_id: str):
        if session_id in self._session_hash_registry:
            del self._session_hash_registry[session_id]

    def get_image_file_path(self, session_id: str, image_id: str) -> Tuple[Path, str]:
        """
        Locate original image file on disk by session_id and image_id.
        """
        session_dir = self.get_session_image_dir(session_id)
        matching_files = list(session_dir.glob(f"{image_id}.*"))
        if not matching_files:
            return None, ""
        
        filepath = matching_files[0]
        mime_type = get_mime_from_extension(filepath.suffix)
        return filepath, mime_type

    def get_or_create_preview_path(self, session_id: str, image_id: str) -> Tuple[Path, str]:
        """
        Get existing thumbnail preview path or create a new one.
        """
        original_path, _ = self.get_image_file_path(session_id, image_id)
        if not original_path or not original_path.exists():
            return None, ""

        preview_dir = self.get_session_preview_dir(session_id)
        preview_path = preview_dir / f"{image_id}_preview.jpg"

        if not preview_path.exists():
            create_thumbnail(original_path, preview_path)

        return preview_path, "image/jpeg"

    def save_image_bytes(
        self,
        session_id: str,
        image_bytes: bytes,
        ext_or_format: str,
        page_number: int = None,
        index: int = 1
    ) -> ExtractedImageInfo:
        sha256_hash = calculate_sha256(image_bytes)
        
        if session_id not in self._session_hash_registry:
            self._session_hash_registry[session_id] = {}

        session_registry = self._session_hash_registry[session_id]

        # Duplicate Handling
        if sha256_hash in session_registry:
            existing_info = session_registry[sha256_hash]
            existing_info.occurrence_count += 1
            existing_info.classification = image_classifier.classify(existing_info)

            return ExtractedImageInfo(
                image_id=existing_info.image_id,
                filename=existing_info.filename,
                mime_type=existing_info.mime_type,
                hash_sha256=sha256_hash,
                width=existing_info.width,
                height=existing_info.height,
                size_bytes=existing_info.size_bytes,
                saved_path=existing_info.saved_path,
                page_number=page_number,
                is_duplicate=True,
                duplicate_of=existing_info.image_id,
                occurrence_count=existing_info.occurrence_count,
                preview=existing_info.preview,
                asset=existing_info.asset,
                classification=existing_info.classification
            )

        # Unique Image Handling
        session_dir = self.get_session_image_dir(session_id)
        ext = get_extension_from_image_format(ext_or_format)
        image_id = f"img_{uuid.uuid4().hex[:8]}"
        filename = f"{image_id}{ext}"
        saved_path = session_dir / filename

        with open(saved_path, "wb") as f:
            f.write(image_bytes)

        mime_type = get_mime_from_extension(ext)
        file_size = len(image_bytes)
        width, height = get_image_dimensions(image_bytes)

        # Build Standard API URLs
        preview_url = f"{settings.API_V1_STR}/images/{session_id}/{image_id}/preview"
        asset_url = f"{settings.API_V1_STR}/images/{session_id}/{image_id}/original"

        image_info = ExtractedImageInfo(
            image_id=image_id,
            filename=filename,
            mime_type=mime_type,
            hash_sha256=sha256_hash,
            width=width,
            height=height,
            size_bytes=file_size,
            saved_path=str(saved_path),
            page_number=page_number,
            is_duplicate=False,
            duplicate_of=None,
            occurrence_count=1,
            preview=ImageUrlRef(url=preview_url),
            asset=ImageUrlRef(url=asset_url)
        )

        image_info.classification = image_classifier.classify(image_info)
        session_registry[sha256_hash] = image_info
        return image_info

    def update_ai_description(self, session_id: str, image_id: str, ai_description: str) -> bool:
        """
        Attach AI Description to image info in session registry.
        """
        if session_id in self._session_hash_registry:
            for info in self._session_hash_registry[session_id].values():
                if info.image_id == image_id:
                    info.ai_description = ai_description
                    return True
        return False

image_service = ImageService()