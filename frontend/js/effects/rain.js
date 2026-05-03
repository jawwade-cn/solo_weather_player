class Raindrop {
    constructor(x, y, speed, windStrength) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.windStrength = windStrength;
        this.length = Utils.random(15, 25);
        this.opacity = Utils.random(0.4, 0.8);
    }

    update(windStrength, deltaTime = 1) {
        this.windStrength = windStrength;
        this.y += this.speed * deltaTime;
        this.x += windStrength * 0.5 * deltaTime;
    }

    render(ctx) {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.strokeStyle = 'rgba(174, 194, 224, 0.8)';
        ctx.lineWidth = 1.5;
        ctx.lineCap = 'round';

        const angle = Utils.radians(10 + this.windStrength * 2);
        const startX = this.x - Math.sin(angle) * this.length;
        const startY = this.y - Math.cos(angle) * this.length;

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(this.x, this.y);
        ctx.stroke();

        ctx.restore();
    }
}

class RainSystem {
    constructor(canvasWidth, canvasHeight, intensity = 50, speed = 5) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.intensity = intensity;
        this.speed = speed;
        this.raindrops = [];
        this.windStrength = 0;
        this.active = false;

        this.generateRaindrops();
    }

    generateRaindrops() {
        this.raindrops = [];
        const count = Math.floor(this.intensity * 2);

        for (let i = 0; i < count; i++) {
            this.raindrops.push(new Raindrop(
                Utils.random(-50, this.canvasWidth + 50),
                Utils.random(-this.canvasHeight, this.canvasHeight),
                Utils.random(this.speed * 0.8, this.speed * 1.2),
                this.windStrength
            ));
        }
    }

    setActive(active) {
        this.active = active;
    }

    setIntensity(intensity) {
        this.intensity = intensity;
        this.generateRaindrops();
    }

    setWindStrength(strength) {
        this.windStrength = strength;
    }

    update(deltaTime = 1) {
        if (!this.active) return;

        this.raindrops.forEach(drop => {
            drop.update(this.windStrength, deltaTime);

            if (drop.y > this.canvasHeight || drop.x > this.canvasWidth + 100 || drop.x < -100) {
                drop.x = Utils.random(-50, this.canvasWidth + 50);
                drop.y = Utils.random(-50, 0);
            }
        });
    }

    render(ctx) {
        if (!this.active) return;

        this.raindrops.forEach(drop => {
            drop.render(ctx);
        });
    }

    resize(width, height) {
        this.canvasWidth = width;
        this.canvasHeight = height;
        this.generateRaindrops();
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Raindrop, RainSystem };
}
