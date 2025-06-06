import os
from dotenv import load_dotenv
from alembic.config import Config
from alembic import command
import sys

def main():
    """
    Runs database migrations programmatically using Supabase Pooler credentials.
    """
    if not os.path.exists('alembic.ini'):
        print("ERROR: This script must be run from the 'backend' directory.", file=sys.stderr)
        sys.exit(1)

    print("Attempting to load .env file for Supabase Pooler...")
    load_dotenv()

    # Fetch individual components for the pooler connection
    user = os.getenv("POSTGRES_USER")
    password = os.getenv("POSTGRES_PASSWORD")
    host = os.getenv("POSTGRES_SERVER")
    port = os.getenv("POSTGRES_PORT")
    dbname = os.getenv("POSTGRES_DB")

    # Check if all components are present
    if not all([user, password, host, port, dbname]):
        print("\nCRITICAL ERROR: One or more database connection variables (POSTGRES_USER, POSTGRES_PASSWORD, etc.) are missing from your .env file.", file=sys.stderr)
        sys.exit(1)

    # Construct the database URL for SQLAlchemy using the psycopg2 driver
    db_url = f"postgresql+psycopg2://{user}:{password}@{host}:{port}/{dbname}"

    print("Successfully loaded credentials. Preparing to migrate...")
    print(f"Connecting to: postgresql+psycopg2://{user}:[PASSWORD_HIDDEN]@{host}:{port}/{dbname}")


    try:
        alembic_cfg = Config("alembic.ini")
        alembic_cfg.set_main_option("sqlalchemy.url", db_url)

        print("\nRunning 'alembic upgrade head'...\n")
        command.upgrade(alembic_cfg, "head")
        print("\nSUCCESS: Database migration completed successfully.")

    except Exception as e:
        print(f"\nERROR: An error occurred during migration: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main() 