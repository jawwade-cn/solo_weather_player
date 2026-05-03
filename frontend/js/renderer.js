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
        this.horizonY = 0;

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
        this.time = 0;

        this.mountains = [];
        this.hills = [];
        this.distantTrees = [];
        this.road = null;
        this.skyParticles = [];

        this.init();
    }

    init() {
        this.resize();
        this.setupManagers();
        this.generateLandscape();
        
        window.addEventListener('resize', () => {
            this.resize();
            this.generateLandscape();
        });
    }

    resize() {
        const container = this.canvas.parentElement;
        this.width = container.clientWidth || 800;
        this.height = container.clientHeight || 500;
        this.horizonY = this.height * 0.55;
        this.groundY = this.height * 0.88;

        this.canvas.width = this.width;
        this.canvas.height = this.height;

        if (this.cloudManager) {
            this.cloudManager.resize(this.width, this.horizonY);
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
            this.cloudManager = new CloudManager(this.width, this.horizonY, 30);
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

    generateLandscape() {
        this.mountains = [];
        this.hills = [];
        this.distantTrees = [];
        this.skyParticles = [];

        for (let i = 0; i < 3; i++) {
            this.mountains.push({
                x: this.width * (i * 0.4 - 0.1),
                baseY: this.horizonY,
                height: this.height * (0.15 + i * 0.05),
                width: this.width * (0.4 + i * 0.1),
                layer: i
            });
        }

        for (let i = 0; i < 5; i++) {
            this.hills.push({
                x: this.width * (i * 0.3 - 0.1),
                baseY: this.horizonY + this.height * 0.05,
                height: this.height * (0.08 + Math.random() * 0.04),
                width: this.width * (0.25 + Math.random() * 0.1)
            });
        }

        const treeCount = Math.floor(this.width / 40);
        for (let i = 0; i < treeCount; i++) {
            this.distantTrees.push({
                x: Math.random() * this.width,
                y: this.horizonY + this.height * 0.08 + Math.random() * this.height * 0.1,
                height: 15 + Math.random() * 25,
                width: 8 + Math.random() * 12,
                opacity: 0.3 + Math.random() * 0.3
            });
        }

        for (let i = 0; i < 20; i++) {
            this.skyParticles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.horizonY * 0.6,
                size: 1 + Math.random() * 3,
                speed: 0.1 + Math.random() * 0.3,
                opacity: 0.1 + Math.random() * 0.3,
                phase: Math.random() * Math.PI * 2
            });
        }

        this.road = {
            leftStartX: this.width * 0.4,
            rightStartX: this.width * 0.6,
            leftEndX: this.width * 0.45,
            rightEndX: this.width * 0.55,
            startY: this.groundY,
            endY: this.horizonY + this.height * 0.15
        };
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
        this.time += deltaTime * 0.01;

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
        this.renderMountains(ctx);
        this.cloudManager.render(ctx, skyColor);
        this.renderHills(ctx);
        this.renderDistantTrees(ctx);
        this.renderGround(ctx);
        this.renderRoad(ctx);
        this.treeManager.render(ctx);
        this.characterManager.render(ctx);
        this.rainSystem.render(ctx);
        this.snowSystem.render(ctx);
        this.fogSystem.render(ctx);
        this.renderAtmosphere(ctx);
    }

    renderSky(ctx, baseColor, gradientColors) {
        const isNight = this.sceneParams?.sky?.moon_visible;
        const timeOfDay = this.sceneParams?.environment?.time_of_day || 'day';
        const isRaining = this.sceneParams?.weather_effects?.rain?.active;
        const isSnowing = this.sceneParams?.weather_effects?.snow?.active;
        const cloudDensity = this.sceneParams?.sky?.cloud_density || 30;

        const skyGradient = ctx.createLinearGradient(0, 0, 0, this.horizonY + 50);

        if (isNight || timeOfDay === 'night') {
            skyGradient.addColorStop(0, '#0a0a23');
            skyGradient.addColorStop(0.3, '#1a1a3e');
            skyGradient.addColorStop(0.7, '#2d2d5a');
            skyGradient.addColorStop(1, '#3d3d6a');

            ctx.fillStyle = skyGradient;
            ctx.fillRect(0, 0, this.width, this.horizonY + 50);

            this.renderStars(ctx);
            this.renderMeteorShower(ctx);
        } else if (timeOfDay === 'dawn') {
            skyGradient.addColorStop(0, '#1a1a4e');
            skyGradient.addColorStop(0.2, '#4a2c6a');
            skyGradient.addColorStop(0.4, '#8b4513');
            skyGradient.addColorStop(0.6, '#d4774f');
            skyGradient.addColorStop(0.8, '#f8c291');
            skyGradient.addColorStop(1, '#ffeaa7');

            ctx.fillStyle = skyGradient;
            ctx.fillRect(0, 0, this.width, this.horizonY + 50);
        } else if (timeOfDay === 'dusk') {
            skyGradient.addColorStop(0, '#2c3e50');
            skyGradient.addColorStop(0.2, '#5d4e7b');
            skyGradient.addColorStop(0.4, '#c0392b');
            skyGradient.addColorStop(0.6, '#e67e22');
            skyGradient.addColorStop(0.8, '#f39c12');
            skyGradient.addColorStop(1, '#f1c40f');

            ctx.fillStyle = skyGradient;
            ctx.fillRect(0, 0, this.width, this.horizonY + 50);
        } else {
            if (isRaining || isSnowing || cloudDensity > 70) {
                skyGradient.addColorStop(0, '#5a6a78');
                skyGradient.addColorStop(0.5, '#6a7a88');
                skyGradient.addColorStop(1, '#7a8a98');
            } else {
                skyGradient.addColorStop(0, '#4a90c9');
                skyGradient.addColorStop(0.3, '#6bb3e0');
                skyGradient.addColorStop(0.6, '#8fc8e8');
                skyGradient.addColorStop(1, '#b8d4e8');
            }

            ctx.fillStyle = skyGradient;
            ctx.fillRect(0, 0, this.width, this.horizonY + 50);
        }

        this.renderSkyParticles(ctx);
    }

    renderStars(ctx) {
        const time = this.time;
        
        for (let i = 0; i < 80; i++) {
            const x = (Math.sin(i * 1.734 + i * 0.001) * 0.5 + 0.5) * this.width;
            const y = (Math.cos(i * 2.456 + i * 0.0005) * 0.5 + 0.5) * this.horizonY * 0.7;
            
            const twinkle = 0.5 + Math.sin(time * 5 + i * 0.7) * 0.5;
            const size = (1 + Math.sin(time * 2 + i) * 0.3) * (0.5 + (i % 5) * 0.1);
            const opacity = twinkle * (0.3 + (i % 8) * 0.05);

            ctx.save();
            ctx.globalAlpha = opacity;
            ctx.fillStyle = '#FFFFFF';
            
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();

            if (size > 1.5) {
                ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.5})`;
                ctx.lineWidth = 0.5;
                const rayLength = size * 3;
                
                ctx.beginPath();
                ctx.moveTo(x - rayLength, y);
                ctx.lineTo(x + rayLength, y);
                ctx.moveTo(x, y - rayLength);
                ctx.lineTo(x, y + rayLength);
                ctx.stroke();
            }

            ctx.restore();
        }
    }

    renderMeteorShower(ctx) {
        const time = this.time;
        
        for (let i = 0; i < 3; i++) {
            const phase = (time * 0.5 + i * 1.5) % 3;
            
            if (phase < 0.8) {
                const progress = phase / 0.8;
                const startX = this.width * (0.1 + i * 0.3);
                const startY = this.horizonY * 0.1;
                const endX = startX + this.width * 0.3;
                const endY = startY + this.horizonY * 0.4;
                
                const currentX = startX + (endX - startX) * progress;
                const currentY = startY + (endY - startY) * progress;
                
                ctx.save();
                ctx.globalAlpha = 1 - progress;
                ctx.strokeStyle = '#FFFFFF';
                ctx.lineWidth = 2;
                
                const trailLength = 50 * (1 - progress);
                ctx.beginPath();
                ctx.moveTo(currentX - Math.cos(0.8) * trailLength, currentY - Math.sin(0.8) * trailLength);
                ctx.lineTo(currentX, currentY);
                ctx.stroke();

                const headGradient = ctx.createRadialGradient(currentX, currentY, 0, currentX, currentY, 8);
                headGradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
                headGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
                
                ctx.fillStyle = headGradient;
                ctx.beginPath();
                ctx.arc(currentX, currentY, 8, 0, Math.PI * 2);
                ctx.fill();

                ctx.restore();
            }
        }
    }

    renderSkyParticles(ctx) {
        const time = this.time;
        const timeOfDay = this.sceneParams?.environment?.time_of_day || 'day';
        const isNight = timeOfDay === 'night' || this.sceneParams?.sky?.moon_visible;

        if (isNight) return;

        this.skyParticles.forEach((particle, i) => {
            const y = particle.y + Math.sin(time * 2 + particle.phase) * 10;
            const opacity = particle.opacity * (0.5 + Math.sin(time + particle.phase) * 0.5);
            
            ctx.save();
            ctx.globalAlpha = opacity;
            
            const particleGradient = ctx.createRadialGradient(
                particle.x, y, 0,
                particle.x, y, particle.size * 2
            );
            
            if (timeOfDay === 'dawn' || timeOfDay === 'dusk') {
                particleGradient.addColorStop(0, 'rgba(255, 200, 150, 0.8)');
                particleGradient.addColorStop(1, 'rgba(255, 200, 150, 0)');
            } else {
                particleGradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
                particleGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            }

            ctx.fillStyle = particleGradient;
            ctx.beginPath();
            ctx.arc(particle.x, y, particle.size * 2, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
        });
    }

    renderSunMoon(ctx) {
        if (!this.sceneParams) return;

        const sky = this.sceneParams.sky;
        const isNight = sky?.moon_visible;
        const sunVisible = sky?.sun_visible;
        const timeOfDay = this.sceneParams.environment?.time_of_day || 'day';

        const centerX = this.width * 0.75;
        const centerY = this.horizonY * (timeOfDay === 'dawn' || timeOfDay === 'dusk' ? 0.6 : 0.25);

        if (isNight || timeOfDay === 'night') {
            this.renderMoon(ctx, centerX, centerY);
        } else if (sunVisible) {
            this.renderSun(ctx, centerX, centerY, timeOfDay);
        }
    }

    renderSun(ctx, x, y, timeOfDay) {
        const time = this.time;
        const radius = 50;

        const numRays = 24;
        for (let i = 0; i < numRays; i++) {
            const angle = (i / numRays) * Math.PI * 2 + time * 0.1;
            const rayOpacity = 0.05 + Math.sin(time * 3 + i * 0.5) * 0.03;
            const rayLength = radius * (2 + Math.sin(time * 2 + i) * 0.3);
            
            ctx.save();
            ctx.globalAlpha = rayOpacity;
            ctx.strokeStyle = timeOfDay === 'dawn' || timeOfDay === 'dusk' 
                ? `rgba(255, 150, 50, 0.6)` 
                : `rgba(255, 220, 100, 0.6)`;
            ctx.lineWidth = 3;
            ctx.lineCap = 'round';

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

            ctx.restore();
        }

        const glowRadius = radius * 2.5;
        const glowGradient = ctx.createRadialGradient(x, y, radius * 0.3, x, y, glowRadius);
        
        if (timeOfDay === 'dawn') {
            glowGradient.addColorStop(0, 'rgba(255, 200, 100, 0.9)');
            glowGradient.addColorStop(0.3, 'rgba(255, 150, 50, 0.5)');
            glowGradient.addColorStop(1, 'rgba(255, 100, 0, 0)');
        } else if (timeOfDay === 'dusk') {
            glowGradient.addColorStop(0, 'rgba(255, 180, 80, 0.9)');
            glowGradient.addColorStop(0.3, 'rgba(255, 100, 50, 0.5)');
            glowGradient.addColorStop(1, 'rgba(200, 50, 0, 0)');
        } else {
            glowGradient.addColorStop(0, 'rgba(255, 245, 200, 0.8)');
            glowGradient.addColorStop(0.3, 'rgba(255, 230, 150, 0.4)');
            glowGradient.addColorStop(1, 'rgba(255, 220, 100, 0)');
        }

        ctx.save();
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(x, y, glowRadius, 0, Math.PI * 2);
        ctx.fill();

        const sunGradient = ctx.createRadialGradient(x - 10, y - 10, 0, x, y, radius);
        
        if (timeOfDay === 'dawn' || timeOfDay === 'dusk') {
            sunGradient.addColorStop(0, '#FFF5E0');
            sunGradient.addColorStop(0.5, '#FFD700');
            sunGradient.addColorStop(1, '#FF8C00');
        } else {
            sunGradient.addColorStop(0, '#FFFFF0');
            sunGradient.addColorStop(0.5, '#FFEB3B');
            sunGradient.addColorStop(1, '#FFC107');
        }

        ctx.fillStyle = sunGradient;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = 0.1;
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(x - radius * 0.3, y - radius * 0.3, radius * 0.4, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    renderMoon(ctx, x, y) {
        const radius = 40;
        const time = this.time;

        ctx.save();

        const moonGlow = ctx.createRadialGradient(x, y, radius, x, y, radius * 3);
        moonGlow.addColorStop(0, 'rgba(180, 200, 255, 0.3)');
        moonGlow.addColorStop(0.5, 'rgba(150, 180, 255, 0.1)');
        moonGlow.addColorStop(1, 'rgba(100, 150, 255, 0)');

        ctx.fillStyle = moonGlow;
        ctx.beginPath();
        ctx.arc(x, y, radius * 3, 0, Math.PI * 2);
        ctx.fill();

        const moonGradient = ctx.createRadialGradient(x - 15, y - 10, 0, x, y, radius);
        moonGradient.addColorStop(0, '#F8F8FF');
        moonGradient.addColorStop(0.4, '#E8E8F0');
        moonGradient.addColorStop(0.8, '#D0D0E0');
        moonGradient.addColorStop(1, '#B0B0C8');

        ctx.fillStyle = moonGradient;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = 0.15;
        const craters = [
            { x: -12, y: -8, r: 8 },
            { x: 10, y: 12, r: 6 },
            { x: -5, y: 15, r: 5 },
            { x: 15, y: -5, r: 4 },
            { x: 0, y: 0, r: 10 },
            { x: -18, y: 10, r: 3 }
        ];

        craters.forEach(crater => {
            const craterGradient = ctx.createRadialGradient(
                x + crater.x - crater.r * 0.3,
                y + crater.y - crater.r * 0.3,
                0,
                x + crater.x,
                y + crater.y,
                crater.r
            );
            craterGradient.addColorStop(0, 'rgba(100, 100, 120, 0.8)');
            craterGradient.addColorStop(1, 'rgba(80, 80, 100, 0)');

            ctx.fillStyle = craterGradient;
            ctx.beginPath();
            ctx.arc(x + crater.x, y + crater.y, crater.r, 0, Math.PI * 2);
            ctx.fill();
        });

        ctx.globalAlpha = 0.3;
        ctx.strokeStyle = 'rgba(150, 150, 180, 0.5)';
        ctx.lineWidth = 1;
        
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.arc(x, y, radius * (0.3 + i * 0.25), 0, Math.PI * 2);
            ctx.stroke();
        }

        ctx.restore();
    }

    renderMountains(ctx) {
        const timeOfDay = this.sceneParams?.environment?.time_of_day || 'day';
        const isNight = timeOfDay === 'night' || this.sceneParams?.sky?.moon_visible;

        this.mountains.forEach((mountain, index) => {
            const layerOpacity = 0.6 + index * 0.15;
            
            ctx.save();

            const mountainGradient = ctx.createLinearGradient(
                mountain.x, mountain.baseY - mountain.height,
                mountain.x, mountain.baseY
            );

            if (isNight) {
                mountainGradient.addColorStop(0, `rgba(25, 35, 55, ${layerOpacity})`);
                mountainGradient.addColorStop(0.5, `rgba(35, 45, 65, ${layerOpacity})`);
                mountainGradient.addColorStop(1, `rgba(45, 55, 75, ${layerOpacity})`);
            } else if (timeOfDay === 'dawn' || timeOfDay === 'dusk') {
                mountainGradient.addColorStop(0, `rgba(100, 80, 90, ${layerOpacity})`);
                mountainGradient.addColorStop(0.5, `rgba(80, 70, 80, ${layerOpacity})`);
                mountainGradient.addColorStop(1, `rgba(60, 50, 60, ${layerOpacity})`);
            } else {
                const baseColor = 80 + index * 30;
                mountainGradient.addColorStop(0, `rgba(${baseColor + 60}, ${baseColor + 80}, ${baseColor + 100}, ${layerOpacity})`);
                mountainGradient.addColorStop(0.5, `rgba(${baseColor + 40}, ${baseColor + 60}, ${baseColor + 80}, ${layerOpacity})`);
                mountainGradient.addColorStop(1, `rgba(${baseColor + 20}, ${baseColor + 40}, ${baseColor + 60}, ${layerOpacity})`);
            }

            ctx.fillStyle = mountainGradient;
            ctx.beginPath();

            const startX = mountain.x - mountain.width / 2;
            const endX = mountain.x + mountain.width / 2;
            const peakX = mountain.x + (index % 2 === 0 ? -mountain.width * 0.1 : mountain.width * 0.1);
            const peakY = mountain.baseY - mountain.height;

            ctx.moveTo(startX, mountain.baseY);

            const peak1X = startX + mountain.width * 0.3;
            const peak1Y = mountain.baseY - mountain.height * 0.6;
            ctx.lineTo(peak1X, peak1Y);

            ctx.lineTo(peakX, peakY);

            const peak2X = startX + mountain.width * 0.7;
            const peak2Y = mountain.baseY - mountain.height * 0.5;
            ctx.lineTo(peak2X, peak2Y);

            ctx.lineTo(endX, mountain.baseY);
            ctx.closePath();

            ctx.fill();

            if (index === 0 && !isNight) {
                ctx.globalAlpha = 0.3;
                const snowGradient = ctx.createLinearGradient(0, peakY, 0, peakY + mountain.height * 0.2);
                snowGradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
                snowGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

                ctx.fillStyle = snowGradient;
                ctx.beginPath();
                ctx.moveTo(peakX - mountain.width * 0.1, peakY + mountain.height * 0.05);
                ctx.lineTo(peakX, peakY);
                ctx.lineTo(peakX + mountain.width * 0.15, peakY + mountain.height * 0.1);
                ctx.lineTo(peakX + mountain.width * 0.1, peakY + mountain.height * 0.2);
                ctx.lineTo(peakX - mountain.width * 0.15, peakY + mountain.height * 0.15);
                ctx.closePath();
                ctx.fill();
            }

            ctx.restore();
        });
    }

    renderHills(ctx) {
        const timeOfDay = this.sceneParams?.environment?.time_of_day || 'day';
        const isNight = timeOfDay === 'night' || this.sceneParams?.sky?.moon_visible;

        ctx.save();

        this.hills.forEach((hill, index) => {
            const hillGradient = ctx.createLinearGradient(
                0, hill.baseY - hill.height,
                0, hill.baseY
            );

            if (isNight) {
                hillGradient.addColorStop(0, 'rgba(35, 55, 45, 0.9)');
                hillGradient.addColorStop(1, 'rgba(25, 45, 35, 0.9)');
            } else {
                hillGradient.addColorStop(0, 'rgba(85, 150, 85, 0.95)');
                hillGradient.addColorStop(0.5, 'rgba(65, 130, 65, 0.95)');
                hillGradient.addColorStop(1, 'rgba(45, 100, 45, 0.95)');
            }

            ctx.fillStyle = hillGradient;
            ctx.beginPath();

            const startX = hill.x - hill.width / 2;
            const endX = hill.x + hill.width / 2;
            const centerX = hill.x;
            const peakY = hill.baseY - hill.height;

            ctx.moveTo(startX, hill.baseY);
            ctx.quadraticCurveTo(startX + hill.width * 0.3, peakY - hill.height * 0.2, centerX, peakY);
            ctx.quadraticCurveTo(endX - hill.width * 0.3, peakY + hill.height * 0.1, endX, hill.baseY);
            ctx.closePath();

            ctx.fill();
        });

        ctx.restore();
    }

    renderDistantTrees(ctx) {
        const timeOfDay = this.sceneParams?.environment?.time_of_day || 'day';
        const isNight = timeOfDay === 'night' || this.sceneParams?.sky?.moon_visible;

        ctx.save();

        this.distantTrees.forEach((tree, index) => {
            ctx.globalAlpha = tree.opacity;

            const trunkWidth = tree.width * 0.2;
            const trunkHeight = tree.height * 0.4;

            ctx.fillStyle = isNight ? 'rgba(30, 20, 15, 0.8)' : 'rgba(80, 50, 30, 0.8)';
            ctx.fillRect(
                tree.x - trunkWidth / 2,
                tree.y - trunkHeight,
                trunkWidth,
                trunkHeight
            );

            const foliageGradient = ctx.createRadialGradient(
                tree.x, tree.y - tree.height,
                0,
                tree.x, tree.y - tree.height * 0.6,
                tree.width
            );

            if (isNight) {
                foliageGradient.addColorStop(0, 'rgba(20, 40, 25, 0.9)');
                foliageGradient.addColorStop(1, 'rgba(15, 30, 20, 0)');
            } else {
                foliageGradient.addColorStop(0, 'rgba(40, 100, 50, 0.9)');
                foliageGradient.addColorStop(1, 'rgba(30, 80, 40, 0)');
            }

            ctx.fillStyle = foliageGradient;
            ctx.beginPath();
            ctx.arc(tree.x, tree.y - tree.height * 0.6, tree.width, 0, Math.PI * 2);
            ctx.fill();
        });

        ctx.restore();
    }

    renderGround(ctx) {
        const timeOfDay = this.sceneParams?.environment?.time_of_day || 'day';
        const isNight = timeOfDay === 'night' || this.sceneParams?.sky?.moon_visible;
        const isSnowing = this.sceneParams?.weather_effects?.snow?.active;

        ctx.save();

        const groundGradient = ctx.createLinearGradient(0, this.groundY, 0, this.height);
        
        if (isSnowing) {
            groundGradient.addColorStop(0, '#E8E8F0');
            groundGradient.addColorStop(0.5, '#D8D8E8');
            groundGradient.addColorStop(1, '#C8C8D8');
        } else if (isNight) {
            groundGradient.addColorStop(0, 'rgba(35, 55, 35, 1)');
            groundGradient.addColorStop(0.5, 'rgba(25, 45, 25, 1)');
            groundGradient.addColorStop(1, 'rgba(15, 35, 15, 1)');
        } else {
            groundGradient.addColorStop(0, '#5A9C5A');
            groundGradient.addColorStop(0.3, '#4A8C4A');
            groundGradient.addColorStop(0.7, '#3A7C3A');
            groundGradient.addColorStop(1, '#2A6C2A');
        }

        ctx.fillStyle = groundGradient;
        ctx.fillRect(0, this.groundY, this.width, this.height - this.groundY);

        if (!isSnowing) {
            this.renderGrass(ctx, isNight);
        } else {
            this.renderSnowCover(ctx);
        }

        ctx.restore();
    }

    renderGrass(ctx, isNight) {
        const time = this.time;
        const grassCount = Math.floor(this.width / 3);

        for (let i = 0; i < grassCount; i++) {
            const x = (i / grassCount) * this.width;
            const baseHeight = 3 + Math.random() * 8;
            const sway = Math.sin(x * 0.05 + time * 2 + i) * (this.windStrength * 3);
            const clumpOffset = Math.sin(i * 0.3) * 2;

            const grassCountPerClump = 3 + Math.floor(Math.random() * 3);
            
            for (let j = 0; j < grassCountPerClump; j++) {
                const grassX = x + clumpOffset + (j - grassCountPerClump / 2) * 2;
                const height = baseHeight * (0.7 + Math.random() * 0.6);

                ctx.save();
                ctx.strokeStyle = isNight 
                    ? `rgba(40, 70, 40, ${0.6 + Math.random() * 0.3})`
                    : `rgba(50, ${120 + Math.random() * 40}, 50, ${0.7 + Math.random() * 0.2})`;
                ctx.lineWidth = 1;
                ctx.lineCap = 'round';

                ctx.beginPath();
                ctx.moveTo(grassX, this.groundY);
                ctx.quadraticCurveTo(
                    grassX + sway * 0.5,
                    this.groundY - height * 0.5,
                    grassX + sway,
                    this.groundY - height
                );
                ctx.stroke();

                ctx.restore();
            }
        }
    }

    renderSnowCover(ctx) {
        const time = this.time;

        ctx.save();

        const snowGradient = ctx.createLinearGradient(0, this.groundY, 0, this.groundY + 30);
        snowGradient.addColorStop(0, '#FAFBFF');
        snowGradient.addColorStop(0.5, '#F0F4FF');
        snowGradient.addColorStop(1, '#E0E8FF');

        ctx.fillStyle = snowGradient;
        ctx.beginPath();
        ctx.moveTo(0, this.groundY);

        for (let x = 0; x <= this.width; x += 10) {
            const y = this.groundY + Math.sin(x * 0.02 + time * 0.1) * 2 + Math.sin(x * 0.05) * 1;
            ctx.lineTo(x, y);
        }

        ctx.lineTo(this.width, this.height);
        ctx.lineTo(0, this.height);
        ctx.closePath();
        ctx.fill();

        ctx.globalAlpha = 0.3;
        ctx.fillStyle = '#FFFFFF';
        for (let i = 0; i < 50; i++) {
            const x = Math.random() * this.width;
            const y = this.groundY + Math.random() * 20;
            const size = 1 + Math.random() * 3;
            
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    }

    renderRoad(ctx) {
        if (!this.road) return;

        const timeOfDay = this.sceneParams?.environment?.time_of_day || 'day';
        const isNight = timeOfDay === 'night' || this.sceneParams?.sky?.moon_visible;
        const time = this.time;

        ctx.save();

        const roadGradient = ctx.createLinearGradient(0, this.road.startY, 0, this.road.endY);
        
        if (isNight) {
            roadGradient.addColorStop(0, 'rgba(50, 50, 60, 0.9)');
            roadGradient.addColorStop(1, 'rgba(40, 40, 50, 0.7)');
        } else {
            roadGradient.addColorStop(0, 'rgba(60, 60, 70, 0.9)');
            roadGradient.addColorStop(1, 'rgba(50, 50, 60, 0.7)');
        }

        ctx.fillStyle = roadGradient;
        ctx.beginPath();
        ctx.moveTo(this.road.leftStartX, this.road.startY);
        ctx.lineTo(this.road.leftEndX, this.road.endY);
        ctx.lineTo(this.road.rightEndX, this.road.endY);
        ctx.lineTo(this.road.rightStartX, this.road.startY);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 3;
        ctx.setLineDash([20, 20]);
        ctx.lineDashOffset = -time * 50;

        ctx.beginPath();
        ctx.moveTo((this.road.leftStartX + this.road.rightStartX) / 2, this.road.startY);
        ctx.lineTo((this.road.leftEndX + this.road.rightEndX) / 2, this.road.endY);
        ctx.stroke();

        ctx.setLineDash([]);

        if (isNight) {
            ctx.globalAlpha = 0.1;
            for (let i = 0; i < 3; i++) {
                const progress = (time * 0.3 + i * 0.4) % 1;
                const carX = this.road.leftStartX + (this.road.rightStartX - this.road.leftStartX) * 0.5;
                const carY = this.road.startY - progress * (this.road.startY - this.road.endY);
                const size = 30 * (1 - progress * 0.7);

                const headlightGlow = ctx.createRadialGradient(carX, carY - size, 0, carX, carY - size, size * 3);
                headlightGlow.addColorStop(0, 'rgba(255, 255, 200, 0.8)');
                headlightGlow.addColorStop(1, 'rgba(255, 255, 200, 0)');

                ctx.fillStyle = headlightGlow;
                ctx.beginPath();
                ctx.arc(carX, carY - size, size * 3, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        ctx.restore();
    }

    renderAtmosphere(ctx) {
        const timeOfDay = this.sceneParams?.environment?.time_of_day || 'day';
        const isNight = timeOfDay === 'night' || this.sceneParams?.sky?.moon_visible;
        const cloudDensity = this.sceneParams?.sky?.cloud_density || 30;

        ctx.save();

        if (isNight) {
            const nightHaze = ctx.createLinearGradient(0, this.horizonY * 0.5, 0, this.horizonY + 50);
            nightHaze.addColorStop(0, 'rgba(0, 0, 20, 0)');
            nightHaze.addColorStop(1, 'rgba(0, 0, 30, 0.3)');

            ctx.fillStyle = nightHaze;
            ctx.fillRect(0, this.horizonY * 0.5, this.width, this.horizonY * 0.5 + 50);
        } else if (cloudDensity > 50) {
            const cloudHaze = ctx.createLinearGradient(0, 0, 0, this.horizonY);
            cloudHaze.addColorStop(0, 'rgba(150, 160, 170, 0.1)');
            cloudHaze.addColorStop(1, 'rgba(150, 160, 170, 0.25)');

            ctx.fillStyle = cloudHaze;
            ctx.fillRect(0, 0, this.width, this.horizonY);
        }

        const distanceHaze = ctx.createLinearGradient(0, this.horizonY, 0, this.groundY);
        distanceHaze.addColorStop(0, 'rgba(200, 210, 220, 0.3)');
        distanceHaze.addColorStop(0.5, 'rgba(200, 210, 220, 0.1)');
        distanceHaze.addColorStop(1, 'rgba(200, 210, 220, 0)');

        ctx.fillStyle = distanceHaze;
        ctx.fillRect(0, this.horizonY, this.width, this.groundY - this.horizonY);

        ctx.restore();
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SceneRenderer };
}
