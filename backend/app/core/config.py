from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import EmailStr, model_validator
from typing import Dict, Any, List

class Settings(BaseSettings):
    PROJECT_NAME: str = "DuoTrak API"
    API_V1_STR: str = "/api/v1"
    FRONTEND_URL: str = "http://localhost:3000"

    # CORS Origins. Stored as a string in .env, parsed into a list.
    BACKEND_CORS_ORIGINS: str = ""

    @property
    def CORS_ORIGINS(self) -> List[str]:
        if self.BACKEND_CORS_ORIGINS:
            return [origin.strip() for origin in self.BACKEND_CORS_ORIGINS.split(',') if origin.strip()]
        return []

    # Individual database components from .env file
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_SERVER: str
    POSTGRES_PORT: int = 5432
    POSTGRES_DB: str
    
    # This field will be constructed automatically
    DATABASE_URL: str | None = None

    @model_validator(mode='before')
    def assemble_db_connection(cls, v: Dict[str, Any]) -> Dict[str, Any]:
        if isinstance(v, dict) and not v.get("DATABASE_URL"):
            v['DATABASE_URL'] = (
                f"postgresql+asyncpg://{v.get('POSTGRES_USER')}:{v.get('POSTGRES_PASSWORD')}"
                f"@{v.get('POSTGRES_SERVER')}:{v.get('POSTGRES_PORT')}/{v.get('POSTGRES_DB')}"
            )
        return v

    # Supabase JWT Secret for token verification
    JWT_SECRET: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days
    ALGORITHM: str = "HS256"
    
    # API Keys for external services (optional)
    OPENAI_API_KEY: str | None = None
    ANTHROPIC_API_KEY: str | None = None
    GOOGLE_API_KEY: str | None = None
    PERPLEXITY_API_KEY: str | None = None
    MISTRAL_API_KEY: str | None = None
    OPENROUTER_API_KEY: str | None = None
    RESEND_API_KEY: str | None = None

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding='utf-8',
        # Special handling for comma-separated list
        env_nested_delimiter='__',
        extra='ignore'
    )

settings = Settings() 