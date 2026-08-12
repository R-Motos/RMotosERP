from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session

from app.config import settings


def _get_connect_args():
    if settings.DATABASE_URL.startswith('sqlite'):
        return {'check_same_thread': False}
    return {}


engine = create_engine(settings.DATABASE_URL, connect_args=_get_connect_args())
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db() -> Session:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
