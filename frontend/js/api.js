const API = {
    baseUrl: 'http://localhost:5000/api',

    async getWeather(city, gender = 'male') {
        try {
            const url = `${this.baseUrl}/weather?city=${encodeURIComponent(city)}&gender=${gender}`;
            const response = await fetch(url);
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || '获取天气数据失败');
            }

            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.message || '获取天气数据失败');
            }

            return data.data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    async getDemo(gender = 'male') {
        try {
            const url = `${this.baseUrl}/demo?gender=${gender}`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error('获取演示数据失败');
            }

            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.message || '获取演示数据失败');
            }

            return data.data;
        } catch (error) {
            console.error('API Error:', error);
            return this.getLocalDemo(gender);
        }
    },

    getLocalDemo(gender = 'male') {
        const isMale = gender === 'male';
        
        return {
            city_info: {
                name: '北京',
                adm1: '北京市',
                adm2: '北京市'
            },
            weather_info: {
                temp: '22',
                feelsLike: '23',
                text: '多云',
                windDir: '东北风',
                windScale: '3',
                humidity: '45',
                vis: '15',
                pressure: '1013'
            },
            weather_indices: [],
            scene_params: {
                sky: {
                    color: '#A0A0A0',
                    gradient: ['#A0A0A0', '#C0C0C0'],
                    cloud_density: 80,
                    sun_visible: false,
                    moon_visible: false
                },
                weather_effects: {
                    rain: { active: false, intensity: 0, speed: 5 },
                    snow: { active: false, intensity: 0, speed: 3 },
                    fog: { active: false, density: 0 }
                },
                wind: {
                    direction: 0,
                    strength: 3,
                    tree_sway_angle: 9
                },
                character: {
                    gender: gender,
                    clothing: isMale ? ['jacket', 'long_sleeve', 'pants'] : ['cardigan', 'blouse', 'skirt'],
                    umbrella: { active: false, color: '#4A90D9' },
                    posture: 'standing'
                },
                environment: {
                    temperature_feel: '舒适',
                    time_of_day: 'day'
                }
            },
            travel_advice: '温度适宜，是出行的好天气。风力适中，户外活动舒适。'
        };
    },

    async healthCheck() {
        try {
            const url = `${this.baseUrl}/health`;
            const response = await fetch(url);
            const data = await response.json();
            return data.success;
        } catch (error) {
            console.error('Health check failed:', error);
            return false;
        }
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = API;
}
