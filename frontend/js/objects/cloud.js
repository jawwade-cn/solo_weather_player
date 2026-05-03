class Cloud {
    constructor(x, y, size, speed) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.speed = speed;
        this.opacity = Utils.random(0.3, 0.7);
        this.puffs = this.generatePuffs();
        this.windOffset = 0;
    }

    generatePuffs() {
        const puffs = [];
        const puffCount = Utils.randomInt(3, 5);
        
        for (let i = 0; i < puffCount; i++) {
            puffs.push({
                offsetX: Utils.random(-this.size * 0.4, this.size * 0.4),
                offsetY: Utils.random(-this.size * 0.1, this.size * 0.1),
                radius: Utils.random(this.size * 0.3, this.size * 0.5)
            });
        }
        
        return puffs;
    }

    update(windStrength = 0, deltaTime = 1) {
        const effectiveSpeed = this.speed + windStrength * 0.5;
        this.x += effectiveSpeed * deltaTime;
        this.windOffset += windStrength * 0.1;

        const canvasWidth = this.getCanvasWidth();
        if (this.x > canvasWidth + this.size * 2) {
            this.x = -this.size * 2;
        }
    }

    render(ctx, skyColor = '#FFFFFF') {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        
        const baseX = this.x + Math.sin(this.windOffset * 0.01) * 5;
        
        this.puffs.forEach((puff, index) => {
            const gradient = ctx.createRadialGradient(
                baseX + puff.offsetX,
                this.y + puff.offsetY,
                0,
                baseX + puff.offsetX,
                this.y + puff.offsetY,
                puff.radius
            );
            
            const lightness = this.getLightnessFromColor(skyColor);
            const cloudColor = lightness > 50 
                ? `rgba(255, 255, 255, ${0.9 - index * 0.05})`
                : `rgba(180, 180, 180, ${0.9 - index * 0.05})`;
            
            gradient.addColorStop(0, cloudColor);
            gradient.addColorStop(1, 'rgba(200, 200, 200, 0)');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(
                baseX + puff.offsetX,
                this.y + puff.offsetY,
                puff.radius,
                0,
                Math.PI * 2
            );
            ctx.fill();
        });
        
        ctx.restore();
    }

    getLightnessFromColor(hex) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        
        return (Math.max(r, g, b) + Math.min(r, g, b)) / 2 / 2.55;
    }

    getCanvasWidth() {
        return typeof Cloud.canvasWidth !== 'undefined' ? Cloud.canvasWidth : window.innerWidth;
    }

    static setCanvasWidth(width) {
        Cloud.canvasWidth = width;
    }
}

class CloudManager {
    constructor(canvasWidth, canvasHeight, density = 50) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.density = density;
        this.clouds = [];
        
        Cloud.setCanvasWidth(canvasWidth);
        this.generateClouds();
    }

    generateClouds() {
        this.clouds = [];
        const cloudCount = Math.floor(this.density / 10);
        
        for (let i = 0; i < cloudCount; i++) {
            const x = Utils.random(-100, this.canvasWidth + 100);
            const y = Utils.random(50, this.canvasHeight * 0.4);
            const size = Utils.random(60, 150);
            const speed = Utils.random(0.2, 0.8);
            
            this.clouds.push(new Cloud(x, y, size, speed));
        }
    }

    updateDensity(density) {
        this.density = density;
        const targetCount = Math.floor(density / 10);
        
        while (this.clouds.length < targetCount) {
            const x = Utils.random(-100, this.canvasWidth + 100);
            const y = Utils.random(50, this.canvasHeight * 0.4);
            const size = Utils.random(60, 150);
            const speed = Utils.random(0.2, 0.8);
            
            this.clouds.push(new Cloud(x, y, size, speed));
        }
        
        while (this.clouds.length > targetCount) {
            this.clouds.pop();
        }
    }

    update(windStrength = 0, deltaTime = 1) {
        this.clouds.forEach(cloud => {
            cloud.update(windStrength, deltaTime);
        });
    }

    render(ctx, skyColor = '#87CEEB') {
        this.clouds.forEach(cloud => {
            cloud.render(ctx, skyColor);
        });
    }

    resize(width, height) {
        this.canvasWidth = width;
        this.canvasHeight = height;
        Cloud.setCanvasWidth(width);
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Cloud, CloudManager };
}
