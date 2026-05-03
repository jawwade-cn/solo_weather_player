class SceneRenderer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            throw new Error(`Canvas element with id "${canvasId}" not found`);
        }
        
        this.ctx = this.canvas.getContext('2d');
        this.width = 0;
        this.height = 0;
        this.groundY = 0;

        this.lastTime = 0;
        this.isRunning = false;
        this.animationId = null;

        this.sceneParams = null;
        this.cloudManager = null;
        this.treeManager = null;
        this.characterManager = null;
        this.rainSystem = null;
        this.snowSystem = null;
        this.fogSystem = null;

        this.windStrength = 0;

        this.init();
    }

    init() {
        this.resize();
        this.setupManagers();
        
        window.addEventListener('resize', () => {
            this.resize();
            this.setupManagers();
        });
    }

    resize() {
        const container = this.canvas.parentElement;
        this.width = container.clientWidth || 800;
        this.height = container.clientHeight || 500;
        this.groundY = this.height * 0.85;

        this.canvas.width = this.width;
        this.canvas.height = this.height;

        if (this.cloudManager) {
            this.cloudManager.resize(this.width, this.height);
        }
        if (this.treeManager) {
            this.treeManager.resize(this.width, this.height, this.groundY);
        }
        if (this.characterManager) {
            this.characterManager.resize(this.width, this.height, this.groundY);
        }
        if (this.rainSystem) {
            this.rainSystem.resize(this.width, this.height);
        }
        if (this.snowSystem) {
            this.snowSystem.resize(this.width, this.height);
        }
        if (this.fogSystem) {
            this.fogSystem.resize(this.width, this.height);
        }
    }

    setupManagers() {
        if (!this.cloudManager) {
            this.cloudManager = new CloudManager(this.width, this.height, 30);
        }
        if (!this.treeManager) {
            this.treeManager = new TreeManager(this.width, this.height, this.groundY);
        }
        if (!this.characterManager) {
            this.characterManager = new CharacterManager(this.width, this.height, this.groundY);
        }
        if (!this.rainSystem) {
            this.rainSystem = new RainSystem(this.width, this.height, 50, 5);
        }
        if (!this.snowSystem) {
            this.snowSystem = new SnowSystem(this.width, this.height, 50, 3);
        }
        if (!this.fogSystem) {
            this.fogSystem = new FogSystem(this.width, this.height, 50);
        }
    }

    setSceneParams(sceneParams) {
        this.sceneParams = sceneParams;

        if (sceneParams.sky?.cloud_density !== undefined) {
            this.cloudManager.updateDensity(sceneParams.sky.cloud_density);
        }

        if (sceneParams.wind?.strength !== undefined) {
            this.windStrength = sceneParams.wind.strength;
        }

        if (sceneParams.character) {
            this.characterManager.setConfig(sceneParams);
        }

        if (sceneParams.weather_effects?.rain) {
            this.rainSystem.setActive(sceneParams.weather_effects.rain.active);
            if (sceneParams.weather_effects.rain.intensity !== undefined) {
                this.rainSystem.setIntensity(sceneParams.weather_effects.rain.intensity);
            }
            if (sceneParams.weather_effects.rain.speed !== undefined) {
                this.rainSystem.speed = sceneParams.weather_effects.rain.speed;
            }
        }

        if (sceneParams.weather_effects?.snow) {
            this.snowSystem.setActive(sceneParams.weather_effects.snow.active);
            if (sceneParams.weather_effects.snow.intensity !== undefined) {
                this.snowSystem.setIntensity(sceneParams.weather_effects.snow.intensity);
            }
            if (sceneParams.weather_effects.snow.speed !== undefined) {
                this.snowSystem.speed = sceneParams.weather_effects.snow.speed;
            }
        }

        if (sceneParams.weather_effects?.fog) {
            this.fogSystem.setActive(sceneParams.weather_effects.fog.active);
            if (sceneParams.weather_effects.fog.density !== undefined) {
                this.fogSystem.setDensity(sceneParams.weather_effects.fog.density);
            }
        }
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.lastTime = performance.now();
        this.animate();
    }

    stop() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    animate() {
        if (!this.isRunning) return;

        const currentTime = performance.now();
        const deltaTime = (currentTime - this.lastTime) / 16.67;
        this.lastTime = currentTime;

        this.update(deltaTime);
        this.render();

        this.animationId = requestAnimationFrame(() => this.animate());
    }

    update(deltaTime) {
        this.cloudManager.update(this.windStrength, deltaTime);
        this.treeManager.update(this.windStrength, deltaTime);
        this.characterManager.update(this.windStrength, deltaTime);
        this.rainSystem.setWindStrength(this.windStrength);
        this.rainSystem.update(deltaTime);
        this.snowSystem.setWindStrength(this.windStrength);
        this.snowSystem.update(deltaTime);
        this.fogSystem.update(deltaTime);
    }

    render() {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.width, this.height);

        const skyColor = this.sceneParams?.sky?.color || '#87CEEB';
        const gradientColors = this.sceneParams?.sky?.gradient || ['#87CEEB', '#E0F6FF'];

        this.renderSky(ctx, skyColor, gradientColors);
        this.renderSunMoon(ctx);
        this.cloudManager.render(ctx, skyColor);
        this.renderGround(ctx);
        this.treeManager.render(ctx);
        this.characterManager.render(ctx);
        this.rainSystem.render(ctx);
        this.snowSystem.render(ctx);
        this.fogSystem.render(ctx);
    }

    renderSky(ctx, baseColor, gradientColors) {
        const gradient = ctx.createLinearGradient(0, 0, 0, this.height * 0.85);
        
        const isNight = this.sceneParams?.sky?.moon_visible;
        const timeOfDay = this.sceneParams?.environment?.time_of_day;

        if (isNight || timeOfDay === 'night') {
            gradient.addColorStop(0, '#1a1a2e');
            gradient.addColorStop(0.5, '#16213e');
            gradient.addColorStop(1, '#0f3460');
        } else if (timeOfDay === 'dawn' || timeOfDay === 'dusk') {
            gradient.addColorStop(0, '#FF6B6B');
            gradient.addColorStop(0.3, '#FFA07A');
            gradient.addColorStop(0.6, '#FFD93D');
            gradient.addColorStop(1, gradientColors[1] || '#E0F6FF');
        } else {
            gradient.addColorStop(0, gradientColors[0] || '#87CEEB');
            gradient.addColorStop(1, gradientColors[1] || '#E0F6FF');
        }

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.width, this.height * 0.85);

        if (isNight || timeOfDay === 'night') {
            this.renderStars(ctx);
        }
    }

    renderStars(ctx) {
        ctx.save();
        const time = Date.now() * 0.001;
        
        for (let i = 0; i < 50; i++) {
            const x = (Math.sin(i * 1.234 + time * 0.01) * 0.5 + 0.5) * this.width;
            const y = (Math.cos(i * 2.345 + time * 0.005) * 0.5 + 0.5) * this.height * 0.5;
            const size = 1 + Math.sin(time * 2 + i) * 0.5;
            const opacity = 0.3 + Math.sin(time * 3 + i * 0.5) * 0.3;

            ctx.globalAlpha = opacity;
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.restore();
    }

    renderSunMoon(ctx) {
        if (!this.sceneParams) return;

        const sky = this.sceneParams.sky;
        const isNight = sky?.moon_visible;
        const sunVisible = sky?.sun_visible;
        const timeOfDay = this.sceneParams.environment?.time_of_day;

        const centerX = this.width * 0.7;
        const centerY = this.height * 0.15;

        if (isNight || timeOfDay === 'night') {
            this.renderMoon(ctx, centerX, centerY);
        } else if (sunVisible) {
            this.renderSun(ctx, centerX, centerY, timeOfDay);
        }
    }

    renderSun(ctx, x, y, timeOfDay) {
        ctx.save();

        const time = Date.now() * 0.001;
        const radius = 40;

        const gradient = ctx.createRadialGradient(x, y, radius * 0.5, x, y, radius * 3);
        
        if (timeOfDay === 'dawn' || timeOfDay === 'dusk') {
            gradient.addColorStop(0, 'rgba(255, 200, 100, 0.8)');
            gradient.addColorStop(0.3, 'rgba(255, 150, 50, 0.4)');
            gradient.addColorStop(1, 'rgba(255, 100, 0, 0)');
        } else {
            gradient.addColorStop(0, 'rgba(255, 255, 200, 0.8)');
            gradient.addColorStop(0.3, 'rgba(255, 255, 150, 0.3)');
            gradient.addColorStop(1, 'rgba(255, 255, 100, 0)');
        }

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, radius * 3, 0, Math.PI * 2);
        ctx.fill();

        for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2 + time * 0.1;
            const rayLength = radius * 1.5 + Math.sin(time * 2 + i) * 10;
            
            ctx.strokeStyle = `rgba(255, 255, 200, ${0.3 + Math.sin(time + i) * 0.1})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(
                x + Math.cos(angle) * radius,
                y + Math.sin(angle) * radius
            );
            ctx.lineTo(
                x + Math.cos(angle) * rayLength,
                y + Math.sin(angle) * rayLength
            );
            ctx.stroke();
        }

        const sunGradient = ctx.createRadialGradient(x - 5, y - 5, 0, x, y, radius);
        sunGradient.addColorStop(0, '#FFFFE0');
        sunGradient.addColorStop(0.5, '#FFD700');
        sunGradient.addColorStop(1, '#FFA500');

        ctx.fillStyle = sunGradient;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    renderMoon(ctx, x, y) {
        ctx.save();

        const radius = 30;
        const time = Date.now() * 0.001;

        const glowGradient = ctx.createRadialGradient(x, y, radius, x, y, radius * 2);
        glowGradient.addColorStop(0, 'rgba(200, 220, 255, 0.3)');
        glowGradient.addColorStop(1, 'rgba(200, 220, 255, 0)');
        
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(x, y, radius * 2, 0, Math.PI * 2);
        ctx.fill();

        const moonGradient = ctx.createRadialGradient(x - 10, y - 10, 0, x, y, radius);
        moonGradient.addColorStop(0, '#F5F5F5');
        moonGradient.addColorStop(0.7, '#E0E0E0');
        moonGradient.addColorStop(1, '#BDBDBD');

        ctx.fillStyle = moonGradient;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = 0.2;
        ctx.fillStyle = '#9E9E9E';
        
        ctx.beginPath();
        ctx.arc(x - 8, y - 5, 5, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(x + 10, y + 8, 4, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(x, y + 12, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    renderGround(ctx) {
        const groundGradient = ctx.createLinearGradient(0, this.groundY, 0, this.height);
        groundGradient.addColorStop(0, '#4CAF50');
        groundGradient.addColorStop(0.3, '#388E3C');
        groundGradient.addColorStop(1, '#2E7D32');

        ctx.fillStyle = groundGradient;
        ctx.beginPath();
        
        const time = Date.now() * 0.001;
        ctx.moveTo(0, this.groundY);
        
        for (let x = 0; x <= this.width; x += 5) {
            const waveY = Math.sin(x * 0.02 + time * 0.5 + this.windStrength * 0.1) * 3;
            ctx.lineTo(x, this.groundY + waveY);
        }
        
        ctx.lineTo(this.width, this.height);
        ctx.lineTo(0, this.height);
        ctx.closePath();
        ctx.fill();

        this.renderGrass(ctx);
    }

    renderGrass(ctx) {
        ctx.save();
        const time = Date.now() * 0.001;
        
        for (let i = 0; i < 100; i++) {
            const x = (i / 100) * this.width;
            const height = Utils.random(5, 15);
            const sway = Math.sin(x * 0.05 + time * 2 + i) * (this.windStrength * 2);
            
            ctx.strokeStyle = `rgba(76, 175, 80, ${0.6 + Math.random() * 0.2})`;
            ctx.lineWidth = 1.5;
            ctx.lineCap = 'round';
            
            ctx.beginPath();
            ctx.moveTo(x, this.groundY);
            ctx.quadraticCurveTo(
                x + sway,
                this.groundY - height / 2,
                x + sway * 1.5,
                this.groundY - height
            );
            ctx.stroke();
        }
        
        ctx.restore();
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SceneRenderer };
}
