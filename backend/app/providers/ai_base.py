from abc import ABC, abstractmethod
from pathlib import Path


class BaseAIProvider(ABC):
    """
    Abstract Base Class สำหรับ Vision AI Provider ทุกชนิด
    """

    @abstractmethod
    async def analyze_image(self, image_path: Path, prompt: str = None) -> str:
        """
        วิเคราะห์รูปภาพและส่งคืนคำอธิบายภาพ (Text Description)
        """
        pass