"""
Configuration loader for environment variables.
"""

from pydantic import BaseSettings

class Settings(BaseSettings):
    ENV: str = "development"
    DATABASE_URL: str = "sqlite:///./dev.db"  # replace with PostgreSQL later
    SECRET_KEY: str = "dev-secret-key"        # replace with secure key
    COINBASE_API_KEY: str = ""
    COINBASE_API_SECRET: str = ""

    class Config:
        env_file = "secrets/.env.local"

settings = Settings()
