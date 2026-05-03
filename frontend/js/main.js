class WeatherApp {
    constructor() {
        this.renderer = null;
        this.currentData = null;
        this.apiConnected = false;

        this.init();
    }

    async init() {
        try {
            this.renderer = new SceneRenderer('scene-canvas');
            this.renderer.start();
        } catch (error) {
            console.error('Failed to initialize renderer:', error);
            Utils.showError('场景渲染器初始化失败');
        }

        this.setupEventListeners();
        await this.checkApiConnection();
        await this.loadDemoData();
    }

    async checkApiConnection() {
        try {
            this.apiConnected = await API.healthCheck();
            console.log('API connected:', this.apiConnected);
        } catch (error) {
            console.log('API not available, using demo mode');
            this.apiConnected = false;
        }
    }

    setupEventListeners() {
        const searchBtn = document.getElementById('search-btn');
        const demoBtn = document.getElementById('demo-btn');
        const cityInput = document.getElementById('city-input');

        if (searchBtn) {
            searchBtn.addEventListener('click', () => this.searchWeather());
        }

        if (demoBtn) {
            demoBtn.addEventListener('click', () => this.loadDemoData());
        }

        if (cityInput) {
            cityInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.searchWeather();
                }
            });
        }
    }

    async searchWeather() {
        const cityInput = document.getElementById('city-input');
        const genderSelect = document.getElementById('gender-select');

        const city = cityInput?.value?.trim() || '';
        const gender = genderSelect?.value || 'male';

        if (!city) {
            Utils.showError('请输入城市名称');
            return;
        }

        Utils.showLoading();

        try {
            let data;
            
            if (this.apiConnected) {
                try {
                    data = await API.getWeather(city, gender);
                } catch (error) {
                    console.log('API call failed, using demo data');
                    data = API.getLocalDemo(gender);
                    Utils.showError('天气API暂时不可用，已切换到演示模式');
                }
            } else {
                data = API.getLocalDemo(gender);
            }

            this.updateUI(data);
            this.updateScene(data);
            this.currentData = data;

        } catch (error) {
            console.error('Search error:', error);
            Utils.showError(error.message || '获取天气数据失败');
        } finally {
            Utils.hideLoading();
        }
    }

    async loadDemoData() {
        const genderSelect = document.getElementById('gender-select');
        const gender = genderSelect?.value || 'male';

        Utils.showLoading();

        try {
            let data;

            if (this.apiConnected) {
                try {
                    data = await API.getDemo(gender);
                } catch (error) {
                    data = API.getLocalDemo(gender);
                }
            } else {
                data = API.getLocalDemo(gender);
            }

            this.updateUI(data);
            this.updateScene(data);
            this.currentData = data;

        } catch (error) {
            console.error('Demo load error:', error);
            Utils.showError('加载演示数据失败');
        } finally {
            Utils.hideLoading();
        }
    }

    updateUI(data) {
        const cityNameEl = document.getElementById('city-name');
        const weatherTextEl = document.getElementById('weather-text');
        const temperatureEl = document.getElementById('temperature');
        const humidityEl = document.getElementById('humidity');
        const windDirectionEl = document.getElementById('wind-direction');
        const visibilityEl = document.getElementById('visibility');
        const travelAdviceEl = document.getElementById('travel-advice');
        const paramsGridEl = document.getElementById('params-grid');

        const cityInfo = data.city_info || {};
        const weatherInfo = data.weather_info || {};
        const sceneParams = data.scene_params || {};

        if (cityNameEl) {
            const cityParts = [cityInfo.adm1, cityInfo.adm2, cityInfo.name].filter(Boolean);
            cityNameEl.textContent = cityParts.join(' - ') || cityInfo.name || '未知城市';
        }

        if (weatherTextEl) {
            weatherTextEl.textContent = weatherInfo.text || '未知';
        }

        if (temperatureEl) {
            temperatureEl.textContent = weatherInfo.temp || '--';
        }

        if (humidityEl) {
            humidityEl.textContent = `${weatherInfo.humidity || '--'}%`;
        }

        if (windDirectionEl) {
            const windDir = weatherInfo.windDir || '';
            const windScale = weatherInfo.windScale || '';
            windDirectionEl.textContent = windDir ? `${windDir} ${windScale ? windScale + '级' : ''}` : '--';
        }

        if (visibilityEl) {
            visibilityEl.textContent = `${weatherInfo.vis || '--'}km`;
        }

        if (travelAdviceEl) {
            travelAdviceEl.textContent = data.travel_advice || '暂无出行建议';
        }

        if (paramsGridEl) {
            this.updateParamsGrid(paramsGridEl, sceneParams);
        }
    }

    updateParamsGrid(gridEl, sceneParams) {
        const items = [];

        if (sceneParams.sky) {
            items.push({
                label: '天空颜色',
                value: sceneParams.sky.color || '--'
            });
            items.push({
                label: '云密度',
                value: `${sceneParams.sky.cloud_density || 0}%`
            });
        }

        if (sceneParams.wind) {
            items.push({
                label: '风力强度',
                value: `${sceneParams.wind.strength || 0}级`
            });
            items.push({
                label: '树木摆动',
                value: `${sceneParams.wind.tree_sway_angle || 0}°`
            });
        }

        if (sceneParams.weather_effects) {
            const effects = sceneParams.weather_effects;
            if (effects.rain?.active) {
                items.push({
                    label: '降雨强度',
                    value: `${effects.rain.intensity || 0}%`
                });
            }
            if (effects.snow?.active) {
                items.push({
                    label: '降雪强度',
                    value: `${effects.snow.intensity || 0}%`
                });
            }
            if (effects.fog?.active) {
                items.push({
                    label: '雾气浓度',
                    value: `${effects.fog.density || 0}%`
                });
            }
        }

        if (sceneParams.character) {
            items.push({
                label: '人物性别',
                value: sceneParams.character.gender === 'male' ? '男性' : '女性'
            });
            items.push({
                label: '是否带伞',
                value: sceneParams.character.umbrella?.active ? '是' : '否'
            });
        }

        if (sceneParams.environment) {
            const timeMap = {
                'day': '白天',
                'night': '夜晚',
                'dawn': '黎明',
                'dusk': '黄昏'
            };
            items.push({
                label: '时间段',
                value: timeMap[sceneParams.environment.time_of_day] || '白天'
            });
            items.push({
                label: '体感温度',
                value: sceneParams.environment.temperature_feel || '--'
            });
        }

        gridEl.innerHTML = items.map(item => `
            <div class="param-item">
                <div class="param-label">${item.label}</div>
                <div class="param-value">${item.value}</div>
            </div>
        `).join('');
    }

    updateScene(data) {
        if (this.renderer && data.scene_params) {
            this.renderer.setSceneParams(data.scene_params);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const app = new WeatherApp();
});
