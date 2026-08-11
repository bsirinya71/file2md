import re

# ประกาศตัวแปร EMOJI_PATTERN ไว้ที่ด้านบนสุดของไฟล์
EMOJI_PATTERN = re.compile(
    r'^[\s\U0001F600-\U0001F64F\U0001F300-\U0001F5FF\U0001F680-\U0001F6FF\U0001F1E0-\U0001F1FF\u2702-\u27B0\u24C2-\U0001F251\U0001F900-\U0001F9FF\U0001FA70-\U0001FAFF\u2600-\u26FF]+$'
)

PAGE_NUMBER_PATTERN = re.compile(
    r'^(page|หน้า)\s*\d+(\s*(of|จาก)\s*\d+)?$', re.IGNORECASE
)

HEADER_FOOTER_LINE_PATTERN = re.compile(
    r'^\s*-\s*\d+\s*-\s*$'
)

def classify_text_segment(segment: str) -> str:
    """จำแนกประเภทข้อความว่าเป็น header, footer, icon หรือ content"""
    cleaned = segment.strip()
    
    if not cleaned:
        return "content"
    
    # 1. เช็กว่าเป็น Icon / Emoji หรือไม่
    if EMOJI_PATTERN.match(cleaned):
        return "icon"
    
    # 2. เช็กว่าเป็น Footer / Header (เลขหน้า) หรือไม่
    if PAGE_NUMBER_PATTERN.match(cleaned) or HEADER_FOOTER_LINE_PATTERN.match(cleaned):
        return "footer"
        
    # 3. เช็กว่าเป็น Header ข้อความกำกับ
    if cleaned.lower() in {"company confidential", "confidential", "draft", "เอกสารลับ"}:
        return "header"

    return "content"

def parse_text_into_blocks(text: str) -> list[dict]:
    """แปลงข้อความดิบให้กลายเป็น List ของ Blocks {type, text}"""
    if not text:
        return []

    lines = text.split("\n")
    blocks = []
    current_content_lines = []

    def flush_content_buffer():
        if current_content_lines:
            combined_text = "\n".join(current_content_lines).strip()
            if combined_text:
                blocks.append({
                    "type": "content",
                    "text": combined_text
                })
            current_content_lines.clear()

    for line in lines:
        stripped_line = line.rstrip()
        
        if not stripped_line.strip():
            flush_content_buffer()
            continue

        block_type = classify_text_segment(stripped_line)

        if block_type == "content":
            current_content_lines.append(stripped_line)
        else:
            flush_content_buffer()
            blocks.append({
                "type": block_type,
                "text": stripped_line.strip()
            })

    flush_content_buffer()
    return blocks