from sqlalchemy.ext.declarative import declarative_base

# All ORM models will inherit from this class.
# It allows SQLAlchemy to map the models to database tables.
Base = declarative_base() 