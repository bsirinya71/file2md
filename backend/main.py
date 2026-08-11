from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.converter_route import router as converter_router

app = FastAPI(
    title="File to Markdown API",
    description="Clean & Scalable File to Markdown Converter Engine",
    version="2.0.0"
)

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routers
app.include_router(converter_router)

@app.get("/")
async def root():
    return {
        "status": "online",
        "message": "Welcome to File2MD API",
        "docs": "/docs"
    }