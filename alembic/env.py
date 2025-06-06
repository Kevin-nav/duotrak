import os
from logging.config import fileConfig

from dotenv import load_dotenv
from sqlalchemy import engine_from_config
from sqlalchemy.pool import NullPool

from alembic import context

# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config

# Interpret the config file for Python logging.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Load environment variables from .env file
# This will find the .env file in the root of the 'backend' directory
# Make sure your .env file is in C:\Users\MORO\Project\duotrak\duotrak-frontend\backend\.env
load_dotenv()

# add your model's MetaData object here
# for 'autogenerate' support
from app.db.base import Base  # Import your Base
target_metadata = Base.metadata

# Get the database URL from environment variables
DATABASE_URL = os.getenv("DATABASE_URL")

# --- THIS IS THE CRITICAL PART ---
# If this fails, it means the .env file wasn't found or the variable isn't set.
if not DATABASE_URL:
    raise ValueError("CRITICAL ERROR: DATABASE_URL environment variable was not found in your .env file.")

# Set the URL in the Alembic config for other parts of the script to use
config.set_main_option('sqlalchemy.url', DATABASE_URL)

print(f"DEBUG: Alembic is attempting to connect with URL: {DATABASE_URL}")


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode."""
    connectable = engine_from_config(
        config.get_section(config.config_main_section, {}),
        prefix="sqlalchemy.",
        poolclass=NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection, target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()