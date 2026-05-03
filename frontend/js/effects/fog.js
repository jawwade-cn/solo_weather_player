class FogSystem {
    constructor(canvasWidth, canvasHeight, density = 50) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.density = density;
        this.active = false;
        this.fogLayers = [];
        this.time = 0;

        this.generateFogLayers();
    }

    generateFogLayers() {
        this.fogLayers = [];
        
        const layerCount = 4;
        
        for (let i = 0; i < layerCount; i++) {
            this.fogLayers.push({
                offset: i * 0.3,
                speed: 0.001 + i * 0.0005,
                opacity: 0.1 + i * 0.05,
                baseY: this.canvasHeight * (0.3 + i * 0.15)
            });
        }
    }

    setActive(active) {
        this.active = active;
    }

    setDensity(density) {
        this.density = density;
    }

    update(deltaTime = 1) {
        if (!this.active) return;
        this.time += deltaTime;
    }

    render(ctx) {
        if (!this.active || this.density <= 0) return;

        const baseOpacity = this.density / 100;

        this.fogLayers.forEach((layer, index) => {
            const timeOffset = this.time * layer.speed;
            
            ctx.save();
            ctx.globalAlpha = layer.opacity * baseOpacity;

            const gradient = ctx.createLinearGradient(0, 0, 0, this.canvasHeight);
            
            const baseColor = 200 + Math.sin(timeOffset + layer.offset) * 20;
            const color1 = `rgba(${baseColor}, ${baseColor + 10}, ${baseColor + 20}, ${0.5 * baseOpacity})`;
            const color2 = `rgba(${baseColor - 20}, ${baseColor - 10}, ${baseColor}, ${0.3 * baseOpacity})`;
            const color3 = `rgba(${baseColor}, ${baseColor + 10}, ${baseColor + 20}, 0)`;

            gradient.addColorStop(0, color3);
            gradient.addColorStop(0.3, color2);
            gradient.addColorStop(0.7, color1);
            gradient.addColorStop(1, color3);

            ctx.fillStyle = gradient;

            ctx.beginPath();
            ctx.moveTo(0, this.canvasHeight);

            const waveAmplitude = 30;
            const waveFrequency = 0.01;
            
            for (let x = 0; x <= this.canvasWidth; x += 5) {
                const y = layer.baseY + 
                    Math.sin(x * waveFrequency + timeOffset + layer.offset) * waveAmplitude +
                    Math.sin(x * waveFrequency * 2 + timeOffset * 1.5) * (waveAmplitude * 0.5);
                
                ctx.lineTo(x, y - index * 20);
            }

            ctx.lineTo(this.canvasWidth, this.canvasHeight);
            ctx.closePath();
            ctx.fill();

            this.renderFogPatches(ctx, layer, timeOffset, baseOpacity);

            ctx.restore();
        });

        this.renderOverallFog(ctx, baseOpacity);
    }

    renderFogPatches(ctx, layer, timeOffset, baseOpacity) {
        const patchCount = 5;
        
        for (let i = 0; i < patchCount; i++) {
            const x = (Math.sin(timeOffset * 0.5 + i * 2) * 0.5 + 0.5) * this.canvasWidth;
            const y = layer.baseY + Math.sin(timeOffset + i) * 50;
            const radius = 50 + Math.sin(timeOffset * 0.3 + i * 1.5) * 20;

            const patchGradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
            patchGradient.addColorStop(0, `rgba(220, 230, 240, ${0.2 * baseOpacity})`);
            patchGradient.addColorStop(1, 'rgba(220, 230, 240, 0)');

            ctx.fillStyle = patchGradient;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    renderOverallFog(ctx, baseOpacity) {
        const overallOpacity = Math.min(0.4, baseOpacity * 0.5);
        
        if (overallOpacity <= 0) return;

        const gradient = ctx.createRadialGradient(
            this.canvasWidth / 2,
            this.canvasHeight * 0.3,
            0,
            this.canvasWidth / 2,
            this.canvasHeight * 0.5,
            this.canvasWidth
        );

        gradient.addColorStop(0, `rgba(200, 210, 220, ${0.1 * overallOpacity})`);
        gradient.addColorStop(0.5, `rgba(180, 190, 200, ${0.2 * overallOpacity})`);
        gradient.addColorStop(1, `rgba(160, 170, 180, ${0.3 * overallOpacity})`);

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    }

    resize(width, height) {
        this.canvasWidth = width;
        this.canvasHeight = height;
        this.generateFogLayers();
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { FogSystem };
}
