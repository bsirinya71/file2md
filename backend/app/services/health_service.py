from app.core.config import settings


class HealthService:
    async def check_health(self) -> dict:
        """
        Check health status of backend components.
        """
        return {
            "status": "healthy",
            "environment": settings.ENV,
            "version": settings.VERSION
        }


health_service = HealthService()