const WeatherPresets = {
    sunny: {
        name: '晴天',
        scene_params: {
            sky: {
                color: '#87CEEB',
                gradient: ['#4A90C9', '#B8D4E8'],
                cloud_density: 20,
                sun_visible: true,
                moon_visible: false
            },
            weather_effects: {
                rain: { active: false, intensity: 0, speed: 5 },
                snow: { active: false, intensity: 0, speed: 3 },
                fog: { active: false, density: 0 }
            },
            wind: {
                direction: 0,
                strength: 2,
                tree_sway_angle: 6
            },
            character: {
                gender: 'male',
                clothing: ['tshirt', 'shorts'],
                umbrella: { active: false, color: '#4A90D9' },
                posture: 'standing'
            },
            environment: {
                temperature_feel: '炎热',
                time_of_day: 'day'
            }
        },
        weather_info: {
            text: '晴',
            temp: '28',
            humidity: '35',
            windDir: '东北风',
            windScale: '2',
            vis: '20'
        },
        travel_advice: '天气晴朗，适合户外活动。注意防晒，多喝水。'
    },

    cloudy: {
        name: '多云',
        scene_params: {
            sky: {
                color: '#A0C4D8',
                gradient: ['#7A9AB8', '#C8D8E8'],
                cloud_density: 70,
                sun_visible: false,
                moon_visible: false
            },
            weather_effects: {
                rain: { active: false, intensity: 0, speed: 5 },
                snow: { active: false, intensity: 0, speed: 3 },
                fog: { active: false, density: 0 }
            },
            wind: {
                direction: 90,
                strength: 3,
                tree_sway_angle: 9
            },
            character: {
                gender: 'male',
                clothing: ['long_sleeve', 'pants'],
                umbrella: { active: false, color: '#4A90D9' },
                posture: 'standing'
            },
            environment: {
                temperature_feel: '舒适',
                time_of_day: 'day'
            }
        },
        weather_info: {
            text: '多云',
            temp: '22',
            humidity: '50',
            windDir: '东风',
            windScale: '3',
            vis: '15'
        },
        travel_advice: '多云天气，适合户外活动。气温适宜，舒适出行。'
    },

    rainy: {
        name: '雨天',
        scene_params: {
            sky: {
                color: '#6A7A88',
                gradient: ['#5A6A78', '#7A8A98'],
                cloud_density: 90,
                sun_visible: false,
                moon_visible: false
            },
            weather_effects: {
                rain: { active: true, intensity: 70, speed: 6 },
                snow: { active: false, intensity: 0, speed: 3 },
                fog: { active: false, density: 0 }
            },
            wind: {
                direction: 180,
                strength: 5,
                tree_sway_angle: 15
            },
            character: {
                gender: 'male',
                clothing: ['jacket', 'long_sleeve', 'pants'],
                umbrella: { active: true, color: '#4A90D9' },
                posture: 'standing'
            },
            environment: {
                temperature_feel: '凉爽',
                time_of_day: 'day'
            }
        },
        weather_info: {
            text: '中雨',
            temp: '18',
            humidity: '85',
            windDir: '南风',
            windScale: '5',
            vis: '8'
        },
        travel_advice: '记得带伞，注意避让积水路段。风雨较大，注意安全。'
    },

    snowy: {
        name: '雪天',
        scene_params: {
            sky: {
                color: '#B8C8D8',
                gradient: ['#A8B8C8', '#C8D8E8'],
                cloud_density: 80,
                sun_visible: false,
                moon_visible: false
            },
            weather_effects: {
                rain: { active: false, intensity: 0, speed: 5 },
                snow: { active: true, intensity: 60, speed: 3 },
                fog: { active: false, density: 0 }
            },
            wind: {
                direction: 270,
                strength: 4,
                tree_sway_angle: 12
            },
            character: {
                gender: 'male',
                clothing: ['heavy_jacket', 'scarf', 'gloves', 'hat', 'pants'],
                umbrella: { active: true, color: '#FF6B6B' },
                posture: 'standing'
            },
            environment: {
                temperature_feel: '寒冷',
                time_of_day: 'day'
            }
        },
        weather_info: {
            text: '大雪',
            temp: '-5',
            humidity: '70',
            windDir: '西风',
            windScale: '4',
            vis: '6'
        },
        travel_advice: '注意保暖，道路可能结冰，小心慢行。穿防滑鞋。'
    },

    foggy: {
        name: '大雾',
        scene_params: {
            sky: {
                color: '#C8D0D8',
                gradient: ['#B8C0C8', '#D8E0E8'],
                cloud_density: 60,
                sun_visible: false,
                moon_visible: false
            },
            weather_effects: {
                rain: { active: false, intensity: 0, speed: 5 },
                snow: { active: false, intensity: 0, speed: 3 },
                fog: { active: true, density: 80 }
            },
            wind: {
                direction: 0,
                strength: 1,
                tree_sway_angle: 3
            },
            character: {
                gender: 'male',
                clothing: ['jacket', 'pants'],
                umbrella: { active: false, color: '#4A90D9' },
                posture: 'standing'
            },
            environment: {
                temperature_feel: '微凉',
                time_of_day: 'day'
            }
        },
        weather_info: {
            text: '大雾',
            temp: '15',
            humidity: '90',
            windDir: '无风',
            windScale: '1',
            vis: '2'
        },
        travel_advice: '能见度较低，出行注意安全。驾车请开启雾灯。'
    },

    windy: {
        name: '大风',
        scene_params: {
            sky: {
                color: '#8BB8E8',
                gradient: ['#6A98C8', '#A8D0F8'],
                cloud_density: 40,
                sun_visible: true,
                moon_visible: false
            },
            weather_effects: {
                rain: { active: false, intensity: 0, speed: 5 },
                snow: { active: false, intensity: 0, speed: 3 },
                fog: { active: false, density: 0 }
            },
            wind: {
                direction: 0,
                strength: 8,
                tree_sway_angle: 24
            },
            character: {
                gender: 'male',
                clothing: ['jacket', 'long_sleeve', 'pants'],
                umbrella: { active: false, color: '#4A90D9' },
                posture: 'walking'
            },
            environment: {
                temperature_feel: '凉爽',
                time_of_day: 'day'
            }
        },
        weather_info: {
            text: '大风',
            temp: '16',
            humidity: '40',
            windDir: '北风',
            windScale: '8',
            vis: '18'
        },
        travel_advice: '风力较大，注意安全。避免在广告牌或大树下停留。'
    },

    stormy: {
        name: '暴风雨',
        scene_params: {
            sky: {
                color: '#4A5568',
                gradient: ['#2D3748', '#4A5568'],
                cloud_density: 95,
                sun_visible: false,
                moon_visible: false
            },
            weather_effects: {
                rain: { active: true, intensity: 90, speed: 8 },
                snow: { active: false, intensity: 0, speed: 3 },
                fog: { active: false, density: 0 }
            },
            wind: {
                direction: 225,
                strength: 10,
                tree_sway_angle: 30
            },
            character: {
                gender: 'male',
                clothing: ['heavy_jacket', 'pants'],
                umbrella: { active: true, color: '#FFD700' },
                posture: 'walking'
            },
            environment: {
                temperature_feel: '阴冷',
                time_of_day: 'day'
            }
        },
        weather_info: {
            text: '暴雨',
            temp: '14',
            humidity: '95',
            windDir: '西南风',
            windScale: '10',
            vis: '3'
        },
        travel_advice: '暴风雨天气，请尽量待在室内。如需外出，务必注意安全。'
    },

    night: {
        name: '夜晚',
        scene_params: {
            sky: {
                color: '#1A1A3E',
                gradient: ['#0A0A23', '#3D3D6A'],
                cloud_density: 10,
                sun_visible: false,
                moon_visible: true
            },
            weather_effects: {
                rain: { active: false, intensity: 0, speed: 5 },
                snow: { active: false, intensity: 0, speed: 3 },
                fog: { active: false, density: 0 }
            },
            wind: {
                direction: 0,
                strength: 1,
                tree_sway_angle: 3
            },
            character: {
                gender: 'male',
                clothing: ['jacket', 'pants'],
                umbrella: { active: false, color: '#4A90D9' },
                posture: 'standing'
            },
            environment: {
                temperature_feel: '凉爽',
                time_of_day: 'night'
            }
        },
        weather_info: {
            text: '晴',
            temp: '12',
            humidity: '55',
            windDir: '微风',
            windScale: '1',
            vis: '10'
        },
        travel_advice: '夜晚天气凉爽，适合散步。注意保暖，注意交通安全。'
    }
};

class WeatherApp {
    constructor() {
        this.renderer = null;
        this.currentData = null;
        this.apiConnected = false;
        this.isDemoMode = false;
        this.manualSceneParams = null;

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
        const toggleControlsBtn = document.getElementById('toggle-controls-btn');
        const cityInput = document.getElementById('city-input');
        const applyControlsBtn = document.getElementById('apply-controls-btn');

        if (searchBtn) {
            searchBtn.addEventListener('click', () => this.searchWeather());
        }

        if (demoBtn) {
            demoBtn.addEventListener('click', () => {
                this.isDemoMode = true;
                this.loadDemoData();
                this.showControlsPanel();
            });
        }

        if (toggleControlsBtn) {
            toggleControlsBtn.addEventListener('click', () => this.toggleControlsPanel());
        }

        if (cityInput) {
            cityInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.searchWeather();
                }
            });
        }

        if (applyControlsBtn) {
            applyControlsBtn.addEventListener('click', () => this.applyManualControls());
        }

        this.setupTabListeners();
        this.setupControlListeners();
        this.setupPresetListeners();
    }

    setupTabListeners() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const tabId = btn.dataset.tab;
                const tabContents = document.querySelectorAll('.tab-content');
                tabContents.forEach(content => {
                    content.style.display = 'none';
                });

                const targetContent = document.getElementById(tabId);
                if (targetContent) {
                    targetContent.style.display = 'block';
                }
            });
        });
    }

    setupControlListeners() {
        const cloudDensitySlider = document.getElementById('control-cloud-density');
        const cloudDensityValue = document.getElementById('cloud-density-value');
        if (cloudDensitySlider && cloudDensityValue) {
            cloudDensitySlider.addEventListener('input', () => {
                cloudDensityValue.textContent = cloudDensitySlider.value;
            });
        }

        const timeOfDaySelect = document.getElementById('control-time-of-day');
        if (timeOfDaySelect) {
            timeOfDaySelect.addEventListener('change', () => {
                const value = timeOfDaySelect.value;
                const sunVisible = document.getElementById('control-sun-visible');
                const moonVisible = document.getElementById('control-moon-visible');
                
                if (value === 'night') {
                    if (sunVisible) sunVisible.checked = false;
                    if (moonVisible) moonVisible.checked = true;
                } else {
                    if (sunVisible) sunVisible.checked = true;
                    if (moonVisible) moonVisible.checked = false;
                }
            });
        }

        const rainActive = document.getElementById('control-rain-active');
        if (rainActive) {
            rainActive.addEventListener('change', () => {
                const intensityRow = document.getElementById('rain-intensity-row');
                const speedRow = document.getElementById('rain-speed-row');
                if (intensityRow) intensityRow.style.display = rainActive.checked ? 'flex' : 'none';
                if (speedRow) speedRow.style.display = rainActive.checked ? 'flex' : 'none';
            });
        }

        const rainIntensitySlider = document.getElementById('control-rain-intensity');
        const rainIntensityValue = document.getElementById('rain-intensity-value');
        if (rainIntensitySlider && rainIntensityValue) {
            rainIntensitySlider.addEventListener('input', () => {
                rainIntensityValue.textContent = rainIntensitySlider.value;
            });
        }

        const rainSpeedSlider = document.getElementById('control-rain-speed');
        const rainSpeedValue = document.getElementById('rain-speed-value');
        if (rainSpeedSlider && rainSpeedValue) {
            rainSpeedSlider.addEventListener('input', () => {
                rainSpeedValue.textContent = rainSpeedSlider.value;
            });
        }

        const snowActive = document.getElementById('control-snow-active');
        if (snowActive) {
            snowActive.addEventListener('change', () => {
                const intensityRow = document.getElementById('snow-intensity-row');
                const speedRow = document.getElementById('snow-speed-row');
                if (intensityRow) intensityRow.style.display = snowActive.checked ? 'flex' : 'none';
                if (speedRow) speedRow.style.display = snowActive.checked ? 'flex' : 'none';
            });
        }

        const snowIntensitySlider = document.getElementById('control-snow-intensity');
        const snowIntensityValue = document.getElementById('snow-intensity-value');
        if (snowIntensitySlider && snowIntensityValue) {
            snowIntensitySlider.addEventListener('input', () => {
                snowIntensityValue.textContent = snowIntensitySlider.value;
            });
        }

        const snowSpeedSlider = document.getElementById('control-snow-speed');
        const snowSpeedValue = document.getElementById('snow-speed-value');
        if (snowSpeedSlider && snowSpeedValue) {
            snowSpeedSlider.addEventListener('input', () => {
                snowSpeedValue.textContent = snowSpeedSlider.value;
            });
        }

        const fogActive = document.getElementById('control-fog-active');
        if (fogActive) {
            fogActive.addEventListener('change', () => {
                const densityRow = document.getElementById('fog-density-row');
                if (densityRow) densityRow.style.display = fogActive.checked ? 'flex' : 'none';
            });
        }

        const fogDensitySlider = document.getElementById('control-fog-density');
        const fogDensityValue = document.getElementById('fog-density-value');
        if (fogDensitySlider && fogDensityValue) {
            fogDensitySlider.addEventListener('input', () => {
                fogDensityValue.textContent = fogDensitySlider.value;
            });
        }

        const windStrengthSlider = document.getElementById('control-wind-strength');
        const windStrengthValue = document.getElementById('wind-strength-value');
        const treeSwaySlider = document.getElementById('control-tree-sway');
        const treeSwayValue = document.getElementById('tree-sway-value');
        
        if (windStrengthSlider && windStrengthValue && treeSwaySlider && treeSwayValue) {
            windStrengthSlider.addEventListener('input', () => {
                windStrengthValue.textContent = windStrengthSlider.value;
                const autoSway = parseInt(windStrengthSlider.value) * 3;
                treeSwaySlider.value = autoSway;
                treeSwayValue.textContent = autoSway;
            });
        }

        if (treeSwaySlider && treeSwayValue) {
            treeSwaySlider.addEventListener('input', () => {
                treeSwayValue.textContent = treeSwaySlider.value;
            });
        }

        const windDirectionSlider = document.getElementById('control-wind-direction');
        const windDirectionValue = document.getElementById('wind-direction-value');
        if (windDirectionSlider && windDirectionValue) {
            windDirectionSlider.addEventListener('input', () => {
                const value = parseInt(windDirectionSlider.value);
                const directions = ['北', '东北', '东', '东南', '南', '西南', '西', '西北'];
                const index = Math.round(value / 45) % 8;
                windDirectionValue.textContent = `${value}° (${directions[index]})`;
            });
        }

        const umbrellaActive = document.getElementById('control-umbrella-active');
        if (umbrellaActive) {
            umbrellaActive.addEventListener('change', () => {
                const colorRow = document.getElementById('umbrella-color-row');
                if (colorRow) colorRow.style.display = umbrellaActive.checked ? 'flex' : 'none';
            });
        }
    }

    setupPresetListeners() {
        const presetBtns = document.querySelectorAll('.preset-btn');
        presetBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const presetName = btn.dataset.preset;
                this.applyPreset(presetName);
            });
        });
    }

    applyPreset(presetName) {
        const preset = WeatherPresets[presetName];
        if (!preset) return;

        const sceneParams = Utils.deepClone(preset.scene_params);
        const characterGender = document.getElementById('gender-select')?.value || 'male';
        sceneParams.character.gender = characterGender;

        this.syncControlsFromParams(sceneParams);

        const data = {
            city_info: { name: '演示模式', adm1: '', adm2: '' },
            weather_info: preset.weather_info,
            scene_params: sceneParams,
            travel_advice: preset.travel_advice
        };

        this.updateUI(data);
        this.updateScene(data);
        this.currentData = data;
    }

    syncControlsFromParams(sceneParams) {
        if (sceneParams.sky) {
            const timeOfDay = document.getElementById('control-time-of-day');
            if (timeOfDay && sceneParams.environment?.time_of_day) {
                timeOfDay.value = sceneParams.environment.time_of_day;
            }

            const skyColor = document.getElementById('control-sky-color');
            if (skyColor && sceneParams.sky.color) {
                skyColor.value = sceneParams.sky.color;
            }

            const cloudDensity = document.getElementById('control-cloud-density');
            const cloudDensityValue = document.getElementById('cloud-density-value');
            if (cloudDensity && cloudDensityValue && sceneParams.sky.cloud_density !== undefined) {
                cloudDensity.value = sceneParams.sky.cloud_density;
                cloudDensityValue.textContent = sceneParams.sky.cloud_density;
            }

            const sunVisible = document.getElementById('control-sun-visible');
            if (sunVisible) sunVisible.checked = sceneParams.sky.sun_visible;

            const moonVisible = document.getElementById('control-moon-visible');
            if (moonVisible) moonVisible.checked = sceneParams.sky.moon_visible;
        }

        if (sceneParams.weather_effects) {
            const effects = sceneParams.weather_effects;

            const rainActive = document.getElementById('control-rain-active');
            if (rainActive) rainActive.checked = effects.rain?.active || false;

            const rainIntensity = document.getElementById('control-rain-intensity');
            const rainIntensityValue = document.getElementById('rain-intensity-value');
            if (rainIntensity && rainIntensityValue && effects.rain?.intensity !== undefined) {
                rainIntensity.value = effects.rain.intensity;
                rainIntensityValue.textContent = effects.rain.intensity;
            }

            const rainSpeed = document.getElementById('control-rain-speed');
            const rainSpeedValue = document.getElementById('rain-speed-value');
            if (rainSpeed && rainSpeedValue && effects.rain?.speed !== undefined) {
                rainSpeed.value = effects.rain.speed;
                rainSpeedValue.textContent = effects.rain.speed;
            }

            const rainIntensityRow = document.getElementById('rain-intensity-row');
            const rainSpeedRow = document.getElementById('rain-speed-row');
            if (rainIntensityRow) rainIntensityRow.style.display = effects.rain?.active ? 'flex' : 'none';
            if (rainSpeedRow) rainSpeedRow.style.display = effects.rain?.active ? 'flex' : 'none';

            const snowActive = document.getElementById('control-snow-active');
            if (snowActive) snowActive.checked = effects.snow?.active || false;

            const snowIntensity = document.getElementById('control-snow-intensity');
            const snowIntensityValue = document.getElementById('snow-intensity-value');
            if (snowIntensity && snowIntensityValue && effects.snow?.intensity !== undefined) {
                snowIntensity.value = effects.snow.intensity;
                snowIntensityValue.textContent = effects.snow.intensity;
            }

            const snowSpeed = document.getElementById('control-snow-speed');
            const snowSpeedValue = document.getElementById('snow-speed-value');
            if (snowSpeed && snowSpeedValue && effects.snow?.speed !== undefined) {
                snowSpeed.value = effects.snow.speed;
                snowSpeedValue.textContent = effects.snow.speed;
            }

            const snowIntensityRow = document.getElementById('snow-intensity-row');
            const snowSpeedRow = document.getElementById('snow-speed-row');
            if (snowIntensityRow) snowIntensityRow.style.display = effects.snow?.active ? 'flex' : 'none';
            if (snowSpeedRow) snowSpeedRow.style.display = effects.snow?.active ? 'flex' : 'none';

            const fogActive = document.getElementById('control-fog-active');
            if (fogActive) fogActive.checked = effects.fog?.active || false;

            const fogDensity = document.getElementById('control-fog-density');
            const fogDensityValue = document.getElementById('fog-density-value');
            if (fogDensity && fogDensityValue && effects.fog?.density !== undefined) {
                fogDensity.value = effects.fog.density;
                fogDensityValue.textContent = effects.fog.density;
            }

            const fogDensityRow = document.getElementById('fog-density-row');
            if (fogDensityRow) fogDensityRow.style.display = effects.fog?.active ? 'flex' : 'none';
        }

        if (sceneParams.wind) {
            const windStrength = document.getElementById('control-wind-strength');
            const windStrengthValue = document.getElementById('wind-strength-value');
            if (windStrength && windStrengthValue && sceneParams.wind.strength !== undefined) {
                windStrength.value = sceneParams.wind.strength;
                windStrengthValue.textContent = sceneParams.wind.strength;
            }

            const windDirection = document.getElementById('control-wind-direction');
            const windDirectionValue = document.getElementById('wind-direction-value');
            if (windDirection && windDirectionValue && sceneParams.wind.direction !== undefined) {
                windDirection.value = sceneParams.wind.direction;
                const directions = ['北', '东北', '东', '东南', '南', '西南', '西', '西北'];
                const index = Math.round(sceneParams.wind.direction / 45) % 8;
                windDirectionValue.textContent = `${sceneParams.wind.direction}° (${directions[index]})`;
            }

            const treeSway = document.getElementById('control-tree-sway');
            const treeSwayValue = document.getElementById('tree-sway-value');
            if (treeSway && treeSwayValue && sceneParams.wind.tree_sway_angle !== undefined) {
                treeSway.value = sceneParams.wind.tree_sway_angle;
                treeSwayValue.textContent = sceneParams.wind.tree_sway_angle;
            }
        }

        if (sceneParams.character) {
            const characterGender = document.getElementById('control-character-gender');
            if (characterGender) characterGender.value = sceneParams.character.gender;

            const umbrellaActive = document.getElementById('control-umbrella-active');
            if (umbrellaActive) umbrellaActive.checked = sceneParams.character.umbrella?.active || false;

            const umbrellaColor = document.getElementById('control-umbrella-color');
            if (umbrellaColor && sceneParams.character.umbrella?.color) {
                umbrellaColor.value = sceneParams.character.umbrella.color;
            }

            const posture = document.getElementById('control-posture');
            if (posture) posture.value = sceneParams.character.posture;

            const umbrellaColorRow = document.getElementById('umbrella-color-row');
            if (umbrellaColorRow) umbrellaColorRow.style.display = sceneParams.character.umbrella?.active ? 'flex' : 'none';

            const clothingChecks = document.querySelectorAll('.clothing-check');
            clothingChecks.forEach(check => {
                check.checked = sceneParams.character.clothing?.includes(check.value) || false;
            });
        }
    }

    applyManualControls() {
        const sceneParams = {
            sky: {
                color: document.getElementById('control-sky-color')?.value || '#87CEEB',
                gradient: [
                    document.getElementById('control-sky-color')?.value || '#87CEEB',
                    '#E0F6FF'
                ],
                cloud_density: parseInt(document.getElementById('control-cloud-density')?.value || 30),
                sun_visible: document.getElementById('control-sun-visible')?.checked || false,
                moon_visible: document.getElementById('control-moon-visible')?.checked || false
            },
            weather_effects: {
                rain: {
                    active: document.getElementById('control-rain-active')?.checked || false,
                    intensity: parseInt(document.getElementById('control-rain-intensity')?.value || 50),
                    speed: parseInt(document.getElementById('control-rain-speed')?.value || 5)
                },
                snow: {
                    active: document.getElementById('control-snow-active')?.checked || false,
                    intensity: parseInt(document.getElementById('control-snow-intensity')?.value || 50),
                    speed: parseInt(document.getElementById('control-snow-speed')?.value || 3)
                },
                fog: {
                    active: document.getElementById('control-fog-active')?.checked || false,
                    density: parseInt(document.getElementById('control-fog-density')?.value || 50)
                }
            },
            wind: {
                direction: parseInt(document.getElementById('control-wind-direction')?.value || 0),
                strength: parseInt(document.getElementById('control-wind-strength')?.value || 2),
                tree_sway_angle: parseInt(document.getElementById('control-tree-sway')?.value || 6)
            },
            character: {
                gender: document.getElementById('control-character-gender')?.value || 'male',
                clothing: this.getSelectedClothing(),
                umbrella: {
                    active: document.getElementById('control-umbrella-active')?.checked || false,
                    color: document.getElementById('control-umbrella-color')?.value || '#4A90D9'
                },
                posture: document.getElementById('control-posture')?.value || 'standing'
            },
            environment: {
                temperature_feel: this.getTemperatureFeel(),
                time_of_day: document.getElementById('control-time-of-day')?.value || 'day'
            }
        };

        this.manualSceneParams = sceneParams;

        const data = {
            city_info: { name: '手动调节', adm1: '', adm2: '' },
            weather_info: this.generateWeatherInfo(sceneParams),
            scene_params: sceneParams,
            travel_advice: this.generateTravelAdvice(sceneParams)
        };

        this.updateUI(data);
        this.updateScene(data);
        this.currentData = data;
    }

    getSelectedClothing() {
        const clothingChecks = document.querySelectorAll('.clothing-check:checked');
        return Array.from(clothingChecks).map(check => check.value);
    }

    getTemperatureFeel() {
        const timeOfDay = document.getElementById('control-time-of-day')?.value;
        const isSnowing = document.getElementById('control-snow-active')?.checked;
        const isRaining = document.getElementById('control-rain-active')?.checked;

        if (isSnowing) return '寒冷';
        if (timeOfDay === 'night') return '凉爽';
        if (isRaining) return '凉爽';
        return '舒适';
    }

    generateWeatherInfo(sceneParams) {
        let text = '晴';
        if (sceneParams.weather_effects.rain.active && sceneParams.weather_effects.snow.active) {
            text = '雨夹雪';
        } else if (sceneParams.weather_effects.rain.active) {
            const intensity = sceneParams.weather_effects.rain.intensity;
            if (intensity > 70) text = '暴雨';
            else if (intensity > 50) text = '中雨';
            else text = '小雨';
        } else if (sceneParams.weather_effects.snow.active) {
            const intensity = sceneParams.weather_effects.snow.intensity;
            if (intensity > 70) text = '暴雪';
            else if (intensity > 50) text = '大雪';
            else text = '小雪';
        } else if (sceneParams.weather_effects.fog.active) {
            text = '雾';
        } else if (sceneParams.wind.strength >= 6) {
            text = '大风';
        } else if (sceneParams.sky.cloud_density > 70) {
            text = '阴';
        } else if (sceneParams.sky.cloud_density > 30) {
            text = '多云';
        }

        const tempMap = {
            '寒冷': -5,
            '凉爽': 15,
            '舒适': 22,
            '炎热': 30
        };
        const temp = tempMap[sceneParams.environment.temperature_feel] || 22;

        const humidityMap = {
            '寒冷': 70,
            '凉爽': 60,
            '舒适': 50,
            '炎热': 35
        };
        const humidity = humidityMap[sceneParams.environment.temperature_feel] || 50;

        const directions = ['北', '东北', '东', '东南', '南', '西南', '西', '西北'];
        const windIndex = Math.round(sceneParams.wind.direction / 45) % 8;

        return {
            text: text,
            temp: temp.toString(),
            humidity: (sceneParams.weather_effects.rain.active || sceneParams.weather_effects.fog.active) 
                ? (humidity + 30).toString() 
                : humidity.toString(),
            windDir: sceneParams.wind.strength > 0 ? directions[windIndex] : '无风',
            windScale: sceneParams.wind.strength.toString(),
            vis: sceneParams.weather_effects.fog.active ? '3' : 
                 sceneParams.weather_effects.rain.active ? '8' : 
                 sceneParams.weather_effects.snow.active ? '6' : '20'
        };
    }

    generateTravelAdvice(sceneParams) {
        const advice = [];

        if (sceneParams.weather_effects.rain.active) {
            advice.push('记得带伞，注意避让积水路段。');
        }
        if (sceneParams.weather_effects.snow.active) {
            advice.push('注意保暖，道路可能结冰，小心慢行。');
        }
        if (sceneParams.weather_effects.fog.active) {
            advice.push('能见度较低，出行注意安全。');
        }
        if (sceneParams.wind.strength >= 6) {
            advice.push('风力较大，注意安全。避免在广告牌或大树下停留。');
        }

        if (sceneParams.environment.temperature_feel === '寒冷') {
            advice.push('天气寒冷，请注意添衣保暖。');
        } else if (sceneParams.environment.temperature_feel === '炎热') {
            advice.push('天气炎热，注意防暑降温，多喝水。');
        } else if (sceneParams.environment.temperature_feel === '舒适') {
            advice.push('温度适宜，是出行的好天气。');
        }

        if (advice.length === 0) {
            advice.push('天气良好，适合出行。');
        }

        return advice.join(' ');
    }

    showControlsPanel() {
        const controlsPanel = document.getElementById('demo-controls-panel');
        const toggleBtn = document.getElementById('toggle-controls-btn');
        
        if (controlsPanel) {
            controlsPanel.style.display = 'block';
        }
        if (toggleBtn) {
            toggleBtn.style.display = 'flex';
        }
    }

    toggleControlsPanel() {
        const controlsPanel = document.getElementById('demo-controls-panel');
        if (controlsPanel) {
            if (controlsPanel.style.display === 'none') {
                controlsPanel.style.display = 'block';
            } else {
                controlsPanel.style.display = 'none';
            }
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

            if (data.scene_params) {
                this.syncControlsFromParams(data.scene_params);
            }

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

            if (data.scene_params) {
                this.syncControlsFromParams(data.scene_params);
            }

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
