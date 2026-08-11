import re

def remove_emojis_and_icons(text: str) -> str:
    """ลบสัญลักษณ์ Emoji และ Icons ต่างๆ ออกจากข้อความ"""
    emoji_pattern = re.compile(
        "["
        "\U0001F600-\U0001F64F"  # emoticons
        "\U0001F300-\U0001F5FF"  # symbols & pictographs
        "\U0001F680-\U0001F6FF"  # transport & map symbols
        "\U0001F1E0-\U0001F1FF"  # flags (iOS)
        "\U00002702-\U000027B0"  # dingbats
        "\U000024C2-\U0001F251"  # symbols
        "\U0001F900-\U0001F9FF"  # supplemental symbols and pictographs
        "\U0001FA70-\U0001FAFF"  # symbols and pictographs extended-A
        "\U00002600-\U000026FF"  # miscellaneous symbols
        "]+", 
        flags=re.UNICODE
    )
    return emoji_pattern.sub('', text)


def optimize_markdown_for_llm(
    text: str, 
    strip_headers_footers: bool = False, 
    clean_whitespace: bool = False,
    remove_icons: bool = False,
    add_llm_prompt: bool = False
) -> str:
    """ทำความสะอาดและจัดฟอร์แมต Markdown สำหรับส่งให้ AI"""
    processed_text = text

    if remove_icons:
        processed_text = remove_emojis_and_icons(processed_text)

    if strip_headers_footers:
        processed_text = re.sub(r'(?i)^\s*(page|หน้า)\s*\d+(\s*(of|จาก)\s*\d+)?\s*$', '', processed_text, flags=re.MULTILINE)
        processed_text = re.sub(r'^\s*-\s*\d+\s*-\s*$', '', processed_text, flags=re.MULTILINE)

    if clean_whitespace:
        processed_text = re.sub(r'\n{3,}', '\n\n', processed_text)
        processed_text = "\n".join([line.rstrip() for line in processed_text.splitlines()])

    if add_llm_prompt:
        system_prompt = (
            "<!-- LLM DIRECTIVE: The following content is extracted from a document. "
            "Please analyze, summarize, or answer questions based strictly on this content. -->\n\n"
        )
        processed_text = system_prompt + processed_text

    return processed_text.strip()