from sqlalchemy import create_engine, Column, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "sqlite:///database/test.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class Association(Base):
    __tablename__ = "associations"
    question = Column(String, primary_key=True, index=True)
    filename = Column(String, index=True)

Base.metadata.create_all(bind=engine)