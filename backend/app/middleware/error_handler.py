from fastapi import Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from fastapi.exceptions import HTTPException

from app.config import settings


async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={'code': status.HTTP_422_UNPROCESSABLE_ENTITY, 'message': 'Error de validacion', 'details': exc.errors()},
    )


async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={'code': exc.status_code, 'message': exc.detail},
    )


async def generic_exception_handler(request: Request, exc: Exception):
    if settings.ENV == 'development':
        message = str(exc)
    else:
        message = 'Error interno del servidor'
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={'code': status.HTTP_500_INTERNAL_SERVER_ERROR, 'message': message},
    )
