import re


def clean_extracted_text(text: str) -> str:
    """
    Clean and normalize raw extracted text from documents.
    """
    if not text:
        return ""

    # Replace zero-width spaces and non-breaking spaces
    cleaned = text.replace("\xa0", " ").replace("\u200b", "")

    # Normalize multiple whitespaces within lines while preserving newlines
    lines = [re.sub(r"[ \t]+", " ", line).strip() for line in cleaned.splitlines()]

    # Rejoin lines
    result = "\n".join(lines).strip()
    return result