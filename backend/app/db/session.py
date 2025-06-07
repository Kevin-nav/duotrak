from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

# Create an async engine to connect to the database
# The pool_pre_ping helps in handling dropped connections.
engine = create_async_engine(
    settings.DATABASE_URL, 
    pool_pre_ping=True, 
    echo=True, 
    connect_args={"statement_cache_size": 0}
)

# Create a sessionmaker for creating new session objects
# expire_on_commit=False prevents attributes from being expired after commit.
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
) 