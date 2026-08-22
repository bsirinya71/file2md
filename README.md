# FILE2MD — Document to Structured Markdown Converter

**FILE2MD** คือเครื่องมือแปลงเอกสาร (PDF / Word / Images) ให้อยู่ในรูปแบบ **Structured Markdown** และ **Abstract Syntax Tree (AST)** ที่ได้รับการปรับแต่งโครงสร้าง ข้อความ และรูปภาพสำหรับนำไปใช้งานต่อกับ Large Language Models (LLMs) โดยเฉพาะ

---

## Features Highlight

* **AST-Based Document Extraction:** แปลงเอกสารให้อยู่ในรูปแบบ AST Nodes (Headings, Paragraphs, Tables, Lists, Images)
* **Split-Screen Live Editor & Preview:** แก้ไขโค้ด Markdown ฝั่งซ้าย และดูผลลัพธ์การ Render สดแบบ Real-time ฝั่งขวา
* **Image Manager & Categorization:** ตรวจจับ คัดแยกประเภทรูปภาพ (`Content`, `Important`, `Decorative`, `Duplicates`) พร้อมระบบกรองรูปซ้ำ
* **Skipped Image Review & Restore:** ทบทวนและกดกู้คืนรูปภาพตกแต่ง (Decorative Images) กลับเข้าสู่ Markdown Stream ได้ตลอดเวลา
* **On-Demand Gemini Vision AI:** สั่งให้ Gemini Vision AI ช่วยวิเคราะห์และสร้างคำอธิบายรายละเอียดรูปภาพ กราฟ หรือตารางแบบรายรูป
* **LLM Token Optimization Dashboard:** สรุปสถิติและเปรียบเทียบเปอร์เซ็นต์การประหยัด Token ระหว่าง Standard Markdown และ LLM-Optimized Markdown
* **Flexible Export Engine:** ดาวน์โหลดไฟล์ `.md` และแพ็กเกจ Assets ZIP (`.zip`) ที่กรองเฉพาะรูปภาพที่ถูกใช้งานจริงในเอกสาร

---

## Tech Stack

### **Frontend**
* **Framework:** React 18 + TypeScript + Vite
* **Styling:** Tailwind CSS
* **Icons & UI Utilities:** Lucide React, clsx, tailwind-merge
* **State & Data Fetching:** Custom Hooks + Fetch API / Axios

### **Backend**
* **Framework:** Python 3.10+ / FastAPI
* **AI Provider:** Google Gemini API (Vision Analysis)
* **Document Processing:** PyMuPDF, pdfplumber, python-docx
* **Server:** Uvicorn

---

## Project Structure

```text
file2md/
├── backend/
│   ├── app/
│   │   ├── controllers/      # Route Controllers (Export, AI, Extract)
│   │   ├── extractors/       # Document Parsing Logic (PDF, DOCX)
│   │   ├── routes/v1/        # FastAPI Endpoint Handlers
│   │   ├── schemas/          # Pydantic Schemas & AST Data Models
│   │   └── services/         # Core Services (Markdown Gen, Image Manager, Gemini AI)
│   ├── main.py               # FastAPI Entrypoint
│   └── requirements.txt
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── document/     # AST Inspector & Document Views
    │   │   ├── export/       # Token Savings Bar & Export Workspace
    │   │   ├── image/        # Image Manager, AI Analysis & Skipped Panel
    │   │   ├── markdown/     # Split Editor & Live Preview Panel
    │   │   └── upload/       # Drag & Drop File Uploader & Stepper
    │   ├── hooks/            # Custom React Hooks (useImageManager, useMarkdownOptimize)
    │   ├── services/         # API Service Integration Layer
    │   └── types/            # TypeScript Interface Definitions
    ├── vite.config.ts
    └── package.json
```

---

## Prerequisites (สิ่งที่ต้องเตรียมก่อนติดตั้ง)

* **Node.js:** เวอร์ชัน 18.x ขึ้นไป
* **Python:** เวอร์ชัน 3.10 ขึ้นไป
* **Google Gemini API Key:** สำหรับใช้งานฟีเจอร์ AI Vision Analysis

---

## Quick Start & Project Setup

### **Frontend (React)**

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install Node.js dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file in the `frontend/` directory:
   ```env
   VITE_API_BASE_URL=http://localhost:8000/api/v1
   ```

4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   *(The app will be running at `http://localhost:5173`)*

---

### **Backend (FastAPI)**

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a Virtual Environment:
   * **Windows:**
     ```bash
     python -m venv venv
     venv\Scripts\activate
     ```
   * **macOS / Linux:**
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```

3. Install required Python packages:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure Environment Variables:
   Create a `.env` file in the `backend/` directory:
   ```env
   API_V1_PREFIX=/api/v1
   GEMINI_API_KEY=your_google_gemini_api_key_here
   GEMINI_MODEL=gemini-2.5-flash
   ```

5. Start the FastAPI development server with Uvicorn:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
   *(The server will be running at `http://localhost:8000`)*
