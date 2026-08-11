from typing import List, Tuple
from app.schemas.extraction import (
    ExtractedImageInfo,
    ImageCategory,
    ImageClassificationResult,
)


class ImageClassifierService:
    """
    Scoring Engine สำหรับประเมินความสำคัญของรูปภาพ
    คะแนนเต็ม 100:
    - >= 70: Important
    - 30 - 69: Content
    - < 30: Decorative
    """

    def classify(self, image_info: ExtractedImageInfo) -> ImageClassificationResult:
        if not image_info.width or not image_info.height:
            return ImageClassificationResult(
                category=ImageCategory.UNKNOWN,
                confidence=0.5,
                score=50.0,
                reasons=["ไม่สามารถอ่านมิติขนาดรูปภาพได้"]
            )

        score = 50.0  # Base Score
        reasons: List[str] = []

        w, h = image_info.width, image_info.height
        area = w * h
        aspect_ratio = max(w / h, h / w) if min(w, h) > 0 else 1.0
        bytes_per_pixel = (image_info.size_bytes or 0) / max(area, 1)

        # 1. Dimension Factor (-40 ถึง +25)
        if w < 50 or h < 50 or area < 2500:
            score -= 35
            reasons.append(f"ขนาดรูปภาพเล็กมาก ({w}x{h} px)")
        elif w < 120 or h < 120 or area < 14400:
            score -= 15
            reasons.append(f"ขนาดรูปภาพค่อนข้างเล็ก ({w}x{h} px)")
        elif area >= 150000:
            score += 20
            reasons.append(f"รูปภาพมีขนาดใหญ่ครอบคลุมเนื้อหา ({w}x{h} px)")

        # 2. Aspect Ratio Extreme Factor (-25 ถึง +5)
        if aspect_ratio > 8.0:
            score -= 25
            reasons.append(f"อัตราส่วนความกว้าง/สูง ผิดปกติอย่างมาก (Aspect ratio: {aspect_ratio:.1f})")
        elif aspect_ratio > 4.0:
            score -= 10
            reasons.append(f"รูปภาพมีลักษณะเป็นแถบยาว (Aspect ratio: {aspect_ratio:.1f})")

        # 3. Duplicate Frequency Factor (-30 ถึง 0)
        if image_info.occurrence_count >= 3:
            score -= 30
            reasons.append(f"รูปภาพปรากฏซ้ำในเอกสารมากถึง {image_info.occurrence_count} ครั้ง (คาดว่าเป็น Header/Logo/Icon)")
        elif image_info.occurrence_count == 2:
            score -= 15
            reasons.append("รูปภาพปรากฏซ้ำในเอกสาร 2 ครั้ง")

        # 4. Data Density / Detail Factor (-15 ถึง +15)
        if bytes_per_pixel < 0.05 and area > 10000:
            score -= 15
            reasons.append("ความหนาแน่นของข้อมูลต่ำ คาดว่าเป็นพื้นหลังเรียบหรือสีสี่เหลี่ยม")
        elif bytes_per_pixel > 0.3:
            score += 10
            reasons.append("รูปภาพมีความหนาแน่นข้อมูลสูง มีรายละเอียดซับซ้อน")

        # Bound score between 0 and 100
        final_score = max(0.0, min(100.0, score))

        # Assign Category & Confidence
        if final_score >= 70.0:
            category = ImageCategory.IMPORTANT
            confidence = min(0.99, round(final_score / 100.0, 2))
        elif final_score >= 30.0:
            category = ImageCategory.CONTENT
            confidence = 0.85
        else:
            category = ImageCategory.DECORATIVE
            confidence = round(1.0 - (final_score / 100.0), 2)

        return ImageClassificationResult(
            category=category,
            confidence=confidence,
            score=round(final_score, 1),
            reasons=reasons
        )


image_classifier = ImageClassifierService()