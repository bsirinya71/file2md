from fastapi import APIRouter
from app.routes.v1 import ai, export, extract, health, images, markdown, upload

api_router = APIRouter()
api_router.include_router(health.router, tags=["Health"])
api_router.include_router(upload.router, tags=["Upload"])
api_router.include_router(extract.router, tags=["Extract"])
api_router.include_router(images.router, tags=["Images"])
api_router.include_router(markdown.router, tags=["Markdown"])
api_router.include_router(ai.router, tags=["AI"])
api_router.include_router(export.router, tags=["Export"])