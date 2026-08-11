import easyocr
import numpy as np
from PIL import Image
import io

class OCRService:
    _reader = None

    @classmethod
    def get_reader(cls):
        """Lazy load EasyOCR reader เพื่อประหยัด Memory ตอนเริ่ม Server"""
        if cls._reader is None:
            # โหลด Model ภาษาไทย (th) และ อังกฤษ (en)
            cls._reader = easyocr.Reader(['th', 'en'], gpu=False)
        return cls._reader

    @classmethod
    def extract_text_from_image_bytes(cls, image_bytes: bytes) -> str:
        """รับไฟล์ Bytes ของรูปภาพแล้วส่งคืนค่าเป็น Text/Markdown"""
        reader = cls.get_reader()
        
        # แปลง Bytes เป็น PIL Image และ Numpy Array
        image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        image_np = np.array(image)

        # ทำ OCR (detail=0 เพื่อเอาเฉพาะข้อความที่อ่านได้)
        results = reader.readtext(image_np, detail=0)

        if not results:
            return ""

        # นำข้อความที่อ่านได้มารวมเป็น Paragraph
        extracted_text = "\n\n".join(results)
        return extracted_text