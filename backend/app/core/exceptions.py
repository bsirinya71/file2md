from typing import Optional
from fastapi import Request, status
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from app.schemas.response import APIResponse


class AppException(Exception):
    def __init__(
        self,
        code: str,
        message: str,
        status_code: int = status.HTTP_400_BAD_REQUEST
    ):
        self.code = code
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)


async def app_exception_handler(request: Request, exc: AppException) -> JSONResponse:
    response = APIResponse.fail(code=exc.code, message=exc.message)
    return JSONResponse(
        status_code=exc.status_code,
        content=jsonable_encoder(response)
    )


async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    # Format FastApi Pydantic validation errors nicely
    errors = exc.errors()
    first_error = errors[0] if errors else {}
    field = ".".join(str(loc) for loc in first_error.get("loc", []))
    msg = first_error.get("msg", "Validation error")
    
    response = APIResponse.fail(
        code="VALIDATION_ERROR",
        message=f"Field '{field}': {msg}"
    )
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content=jsonable_encoder(response)
    )


async def generic_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    # Do not expose internal details in Production
    response = APIResponse.fail(
        code="INTERNAL_SERVER_ERROR",
        message="เกิดข้อผิดพลาดภายในระบบ กรุณาลองใหม่อีกครั้ง"
    )
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content=jsonable_encoder(response)
    )