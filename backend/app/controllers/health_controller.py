from app.schemas.response import APIResponse
from app.services.health_service import health_service


class HealthController:
    async def get_health(self) -> APIResponse:
        data = await health_service.check_health()
        return APIResponse.ok(data=data)


health_controller = HealthController()