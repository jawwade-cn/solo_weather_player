import requests
from config import config
from typing import Dict, Optional

class WeatherService:
    def __init__(self):
        self.api_key = config.WEATHER_API_KEY
        self.base_url = config.WEATHER_API_BASE_URL

    def get_city_location(self, city_name: str) -> Optional[Dict]:
        url = f"{self.base_url}/city/lookup"
        params = {
            'location': city_name,
            'key': self.api_key
        }
        try:
            response = requests.get(url, params=params, timeout=10)
            data = response.json()
            if data.get('code') == '200' and data.get('location'):
                return data['location'][0]
        except Exception as e:
            print(f"Error getting city location: {e}")
        return None

    def get_current_weather(self, location_id: str) -> Optional[Dict]:
        url = f"{self.base_url}/weather/now"
        params = {
            'location': location_id,
            'key': self.api_key
        }
        try:
            response = requests.get(url, params=params, timeout=10)
            data = response.json()
            if data.get('code') == '200':
                return data.get('now')
        except Exception as e:
            print(f"Error getting current weather: {e}")
        return None

    def get_weather_indices(self, location_id: str) -> Optional[Dict]:
        url = f"{self.base_url}/indices/1d"
        params = {
            'location': location_id,
            'key': self.api_key,
            'type': '1,2,3,8,9,10,11,12,13,14,15,16'
        }
        try:
            response = requests.get(url, params=params, timeout=10)
            data = response.json()
            if data.get('code') == '200':
                return data.get('daily')
        except Exception as e:
            print(f"Error getting weather indices: {e}")
        return None

    def get_complete_weather(self, city_name: str) -> Optional[Dict]:
        location = self.get_city_location(city_name)
        if not location:
            return None

        current_weather = self.get_current_weather(location['id'])
        indices = self.get_weather_indices(location['id'])

        if not current_weather:
            return None

        return {
            'city': {
                'name': location.get('name', city_name),
                'adm1': location.get('adm1', ''),
                'adm2': location.get('adm2', '')
            },
            'weather': current_weather,
            'indices': indices
        }

weather_service = WeatherService()
