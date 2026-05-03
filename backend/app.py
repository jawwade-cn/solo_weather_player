import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from flask import Flask, request, jsonify
from flask_cors import CORS
from services.weather_service import weather_service
from services.ai_service import ai_service

app = Flask(__name__)
CORS(app)

@app.route('/api/weather', methods=['GET'])
def get_weather():
    city = request.args.get('city', '')
    gender = request.args.get('gender', 'male')

    if not city:
        return jsonify({
            'success': False,
            'message': '请提供城市名称'
        }), 400

    weather_data = weather_service.get_complete_weather(city)

    if not weather_data:
        return jsonify({
            'success': False,
            'message': f'无法获取城市 "{city}" 的天气信息，请检查城市名称是否正确'
        }), 404

    scene_params = ai_service.generate_scene_params(weather_data, gender)
    travel_advice = ai_service.generate_travel_advice(weather_data, scene_params)

    return jsonify({
        'success': True,
        'data': {
            'city_info': weather_data.get('city', {}),
            'weather_info': weather_data.get('weather', {}),
            'weather_indices': weather_data.get('indices', []),
            'scene_params': scene_params,
            'travel_advice': travel_advice
        }
    })

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'success': True,
        'message': '服务运行正常'
    })

@app.route('/api/demo', methods=['GET'])
def get_demo_data():
    gender = request.args.get('gender', 'male')
    demo_weather = {
        'city': {
            'name': '北京',
            'adm1': '北京市',
            'adm2': '北京市'
        },
        'weather': {
            'temp': '22',
            'feelsLike': '23',
            'text': '多云',
            'windDir': '东北风',
            'windScale': '3',
            'humidity': '45',
            'vis': '15',
            'pressure': '1013'
        },
        'indices': []
    }

    scene_params = ai_service._generate_default_scene_params(demo_weather, gender)
    travel_advice = ai_service._generate_default_travel_advice(demo_weather)

    return jsonify({
        'success': True,
        'data': {
            'city_info': demo_weather.get('city', {}),
            'weather_info': demo_weather.get('weather', {}),
            'weather_indices': demo_weather.get('indices', []),
            'scene_params': scene_params,
            'travel_advice': travel_advice
        }
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
