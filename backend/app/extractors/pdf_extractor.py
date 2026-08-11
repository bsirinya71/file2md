import fitz  # PyMuPDF
from pathlib import Path
from typing import List

from app.extractors.base import BaseExtractor
from app.schemas.extraction import (
    BlockType,
    DocumentType,
    ExtractedBlock,
    ExtractedImageInfo,
    ExtractionResult,
)
from app.services.image_service import image_service
from app.utils.text_cleaner import clean_extracted_text


class PDFExtractor(BaseExtractor):
    async def extract(self, file_path: Path, session_id: str) -> ExtractionResult:
        doc = fitz.open(file_path)
        total_pages = len(doc)
        blocks: List[ExtractedBlock] = []
        extracted_images: List[ExtractedImageInfo] = []

        image_service.clear_session_registry(session_id)

        try:
            # 1. Collect font sizes
            font_sizes = []
            for page in doc:
                page_text = page.get_text("dict")
                for block in page_text.get("blocks", []):
                    if block.get("type") == 0:
                        for line in block.get("lines", []):
                            for span in line.get("spans", []):
                                if span.get("text", "").strip():
                                    font_sizes.append(span.get("size", 10.0))

            base_font_size = sum(font_sizes) / len(font_sizes) if font_sizes else 10.0

            # 2. Extract content page by page
            for page_num in range(total_pages):
                page = doc[page_num]

                # A. Tables
                tables = page.find_tables()
                table_rects = []
                if tables:
                    for table in tables:
                        table_rects.append(table.bbox)
                        extracted_table_data = table.extract()
                        if extracted_table_data:
                            blocks.append(
                                ExtractedBlock(
                                    block_type=BlockType.TABLE,
                                    text=None,
                                    metadata={
                                        "page": page_num + 1,
                                        "rows": extracted_table_data,
                                    },
                                )
                            )

                # B. Embedded Images
                image_list = page.get_images(full=True)
                for img_index, img in enumerate(image_list, start=1):
                    xref = img[0]
                    base_image = doc.extract_image(xref)
                    image_bytes = base_image["image"]
                    image_ext = base_image["ext"]

                    image_info = image_service.save_image_bytes(
                        session_id=session_id,
                        image_bytes=image_bytes,
                        ext_or_format=image_ext,
                        page_number=page_num + 1,
                        index=img_index
                    )

                    if not image_info.is_duplicate:
                        extracted_images.append(image_info)

                    blocks.append(
                        ExtractedBlock(
                            block_type=BlockType.IMAGE,
                            text=None,
                            image_info=image_info,
                            metadata={"page": page_num + 1}
                        )
                    )

                # C. Text Blocks
                text_page = page.get_text("dict")
                for block in text_page.get("blocks", []):
                    if block.get("type") == 0:
                        bbox = block.get("bbox")
                        if self._is_inside_rects(bbox, table_rects):
                            continue

                        block_text = ""
                        max_span_size = 0.0

                        for line in block.get("lines", []):
                            line_text = ""
                            for span in line.get("spans", []):
                                text = span.get("text", "")
                                size = span.get("size", 10.0)
                                if size > max_span_size:
                                    max_span_size = size
                                line_text += text
                            block_text += line_text + "\n"

                        cleaned = clean_extracted_text(block_text)
                        if not cleaned:
                            continue

                        b_type, level = self._classify_text_block(cleaned, max_span_size, base_font_size)

                        blocks.append(
                            ExtractedBlock(
                                block_type=b_type,
                                text=cleaned,
                                level=level,
                                metadata={"page": page_num + 1, "font_size": round(max_span_size, 1)},
                            )
                        )
        finally:
            doc.close()

        return ExtractionResult(
            session_id=session_id,
            document_type=DocumentType.PDF,
            title=file_path.stem,
            blocks=blocks,
            images=extracted_images,
            metadata={"total_pages": total_pages, "unique_image_count": len(extracted_images)},
        )

    @staticmethod
    def _is_inside_rects(bbox: list, rects: list) -> bool:
        if not bbox or not rects:
            return False
        bx0, by0, bx1, by1 = bbox
        for rx0, ry0, rx1, ry1 in rects:
            if bx0 >= rx0 and by0 >= ry0 and bx1 <= rx1 and by1 <= ry1:
                return True
        return False

    @staticmethod
    def _classify_text_block(text: str, font_size: float, base_font_size: float):
        if font_size >= base_font_size * 1.6:
            return BlockType.HEADING, 1
        elif font_size >= base_font_size * 1.3:
            return BlockType.HEADING, 2
        elif font_size >= base_font_size * 1.15:
            return BlockType.HEADING, 3

        if text.startswith(("- ", "* ", "• ")) or (text[0].isdigit() and text[1:3] in [". ", ") "]):
            return BlockType.LIST_ITEM, None

        return BlockType.PARAGRAPH, None