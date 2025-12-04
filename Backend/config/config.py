import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SQLALCHEMY_DATABASE_URI = (
        f"postgresql://{os.getenv('DATA_BASE_USER')}:"
        f"{os.getenv('DATA_BASE_PASSWORD')}@"
        f"{os.getenv('DATA_BASE_URL')}"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = False

