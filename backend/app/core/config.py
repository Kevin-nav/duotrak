from pydantic import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "DuoTrak API"
    API_V1_STR: str = "/api/v1"

    # Database settings
    DATABASE_URL: str

    # Supabase JWT Secret for token verification
    JWT_SECRET: str
    
    # API Keys for external services (optional)
    OPENAI_API_KEY: str | None = None
    ANTHROPIC_API_KEY: str | None = None
    GOOGLE_API_KEY: str | None = None
    PERPLEXITY_API_KEY: str | None = None
    MISTRAL_API_KEY: str | None = None
    OPENROUTER_API_KEY: str | None = None
    RESEND_API_KEY: str | None = None

    class Config:
        case_sensitive = True
        # This will automatically look for a .env file in the same directory
        # as this config file or in the root project directory.
        env_file = ".env" 
        env_file_encoding = 'utf-8'

settings = Settings() 