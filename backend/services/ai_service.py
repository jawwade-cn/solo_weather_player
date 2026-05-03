import json
from openai import OpenAI
from config import config
from typing import Dict, Optional

class AIService:
    def __init__(self):
        self.client = OpenAI(
            api_key=config.AI_API_KEY,
            base_url=config.AI_API_BASE_URL
        )
        self.model = config.AI_MODEL

    def generate_scene_params(self, weather_data: Dict, user_gender: str = 'male') -> Optional[Dict]:
        weather = weather_data.get('weather', {})
        temp = int(weather.get('temp', 20))
        text = weather.get('text', '晴')
        wind_dir = weather.get('windDir', '无持续风向')
        wind_scale = int(weather.get('windScale', 0) if weather.get('windScale') != '微风' else 2)
        humidity = int(weather.get('humidity', 50))
        vis = int(weather.get('vis', 10))

        prompt = f"""
根据以下天气信息，生成一个JSON格式的场景渲染参数。
天气信息：
- 城市: {weather_data.get('city', {}).get('name', '未知')}
- 天气: {text}
- 温度: {temp}°C
- 风向: {wind_dir}
- 风力等级: {wind_scale}级
- 湿度: {humidity}%
- 能见度: {vis}km
- 用户性别: {user_gender}

请生成以下JSON结构的参数（所有数值请根据天气情况合理推断）：
{{
    "sky": {{
        "color": "天空颜色（十六进制，如#87CEEB）",
        "gradient": ["渐变颜色1", "渐变颜色2"],
        "cloud_density": 云的密度（0-100）,
        "sun_visible": true/false,
        "moon_visible": true/false
    }},
    "weather_effects": {{
        "rain": {{ "active": true/false, "intensity": 0-100, "speed": 0-10 }},
        "snow": {{ "active": true/false, "intensity": 0-100, "speed": 0-10 }},
        "fog": {{ "active": true/false, "density": 0-100 }}
    }},
    "wind": {{
        "direction": 风向角度（0-360，0为北，90为东）,
        "strength": 风力强度（0-10）,
        "tree_sway_angle": 树木摆动角度（度，如15）
    }},
    "character": {{
        "gender": "{user_gender}",
        "clothing": ["衣物类型列表，如['jacket', 'scarf']"],
        "umbrella": {{ "active": true/false, "color": "伞的颜色" }},
        "posture": "姿态描述（如'standing', 'walking'）"
    }},
    "environment": {{
        "temperature_feel": "体感温度描述",
        "time_of_day": "day/night/dawn/dusk"
    }}
}}

请只返回JSON数据，不要有其他解释或Markdown格式。
"""

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "你是一个专业的天气场景设计师，擅长根据天气数据生成逼真的场景渲染参数。请严格按照JSON格式输出。"},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=800
            )

            content = response.choices[0].message.content.strip()
            if content.startswith('```'):
                content = content.split('\n')[1:-1]
                content = '\n'.join(content)

            scene_params = json.loads(content)
            return scene_params

        except Exception as e:
            print(f"Error generating scene params: {e}")
            return self._generate_default_scene_params(weather_data, user_gender)

    def _generate_default_scene_params(self, weather_data: Dict, user_gender: str) -> Dict:
        weather = weather_data.get('weather', {})
        temp = int(weather.get('temp', 20))
        text = weather.get('text', '晴').lower()
        wind_scale = int(weather.get('windScale', 0) if weather.get('windScale') != '微风' else 2)

        is_rain = any(w in text for w in ['雨', '雷', '阵雨'])
        is_snow = any(w in text for w in ['雪', '冰'])
        is_cloudy = any(w in text for w in ['阴', '云', '多云'])
        is_fog = any(w in text for w in ['雾', '霾'])

        clothing = []
        if temp < 10:
            clothing.extend(['heavy_jacket', 'scarf', 'gloves', 'hat'])
        elif temp < 20:
            clothing.extend(['jacket', 'long_sleeve', 'pants'])
        else:
            clothing.extend(['tshirt', 'shorts'])

        return {
            "sky": {
                "color": "#87CEEB" if not is_cloudy else "#A0A0A0",
                "gradient": ["#87CEEB", "#E0F6FF"] if not is_cloudy else ["#A0A0A0", "#C0C0C0"],
                "cloud_density": 80 if is_cloudy else 20,
                "sun_visible": not is_cloudy and not is_rain and not is_snow,
                "moon_visible": False
            },
            "weather_effects": {
                "rain": {"active": is_rain, "intensity": 50 if is_rain else 0, "speed": 5},
                "snow": {"active": is_snow, "intensity": 50 if is_snow else 0, "speed": 3},
                "fog": {"active": is_fog, "density": 60 if is_fog else 0}
            },
            "wind": {
                "direction": 0,
                "strength": wind_scale,
                "tree_sway_angle": min(15, wind_scale * 3)
            },
            "character": {
                "gender": user_gender,
                "clothing": clothing,
                "umbrella": {"active": is_rain or is_snow, "color": "#4A90D9"},
                "posture": "standing"
            },
            "environment": {
                "temperature_feel": "寒冷" if temp < 10 else "舒适" if temp < 25 else "炎热",
                "time_of_day": "day"
            }
        }

    def generate_travel_advice(self, weather_data: Dict, scene_params: Dict) -> str:
        weather = weather_data.get('weather', {})
        city = weather_data.get('city', {}).get('name', '该城市')
        temp = weather.get('temp', 'N/A')
        text = weather.get('text', '晴')
        humidity = weather.get('humidity', 'N/A')
        wind_dir = weather.get('windDir', 'N/A')
        wind_scale = weather.get('windScale', 'N/A')

        prompt = f"""
根据以下天气信息，用中文给出简洁实用的出行建议（150字以内）：

城市: {city}
天气: {text}
温度: {temp}°C
湿度: {humidity}%
风向: {wind_dir}
风力: {wind_scale}级

请结合天气情况，给出关于穿衣、出行、是否带伞等方面的实用建议。
"""

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "你是一个专业的气象顾问，擅长根据天气情况给出实用的出行建议。请用简洁友好的中文回答。"},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=200
            )

            return response.choices[0].message.content.strip()

        except Exception as e:
            print(f"Error generating travel advice: {e}")
            return self._generate_default_travel_advice(weather_data)

    def _generate_default_travel_advice(self, weather_data: Dict) -> str:
        weather = weather_data.get('weather', {})
        temp = int(weather.get('temp', 20))
        text = weather.get('text', '晴')

        advice = []

        if '雨' in text or '雷' in text:
            advice.append("记得带伞，注意避让积水路段。")
        if '雪' in text:
            advice.append("注意保暖，道路可能结冰，小心慢行。")
        if '雾' in text or '霾' in text:
            advice.append("能见度较低，出行注意安全。")

        if temp < 10:
            advice.append("天气寒冷，请注意添衣保暖。")
        elif temp > 30:
            advice.append("天气炎热，注意防暑降温，多喝水。")
        elif 20 <= temp <= 25:
            advice.append("温度适宜，是出行的好天气。")

        if not advice:
            advice.append("天气良好，适合出行。")

        return " ".join(advice)

ai_service = AIService()
