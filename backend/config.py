import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key')
    
    WEATHER_API_KEY = os.getenv('WEATHER_API_KEY', '')
    WEATHER_API_BASE_URL = os.getenv('WEATHER_API_BASE_URL', 'https://devapi.qweather.com/v7')
    
    AI_API_KEY = os.getenv('AI_API_KEY', '')
    AI_API_BASE_URL = os.getenv('AI_API_BASE_URL', 'https://api.openai.com/v1')
    AI_MODEL = os.getenv('AI_MODEL', 'gpt-3.5-turbo')

config = Config()
