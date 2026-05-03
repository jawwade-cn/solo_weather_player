class Snowflake {
    constructor(x, y, size, speed) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.speed = speed;
        this.opacity = Utils.random(0.6, 0.9);
        this.swayOffset = Utils.random(0, Math.PI * 2);
        this.swaySpeed = Utils.random(0.02, 0.05);
        this.swayAmplitude = Utils.random(20, 40);
        this.rotation = 0;
        this.rotationSpeed = Utils.random(-0.02, 0.02);
    }

    update(windStrength, deltaTime = 1) {
        this.swayOffset += this.swaySpeed * deltaTime;
        this.y += this.speed * deltaTime;
        this.x += windStrength * 0.3 * deltaTime;
        this.x += Math.sin(this.swayOffset) * 0.5 * deltaTime;
        this.rotation += this.rotationSpeed * deltaTime;
    }

    render(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = this.opacity;

        this.renderSnowflakeShape(ctx);

        ctx.restore();
    }

    renderSnowflakeShape(ctx) {
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = this.size * 0.1;
        ctx.lineCap = 'round';

        const branches = 6;
        const branchLength = this.size;

        for (let i = 0; i < branches; i++) {
            const angle = (i / branches) * Math.PI * 2;
            
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(
                Math.cos(angle) * branchLength,
                Math.sin(angle) * branchLength
            );
            ctx.stroke();

            const subAngle1 = angle + Math.PI / 6;
            const subAngle2 = angle - Math.PI / 6;
            const subLength = branchLength * 0.5;
            const startDist = branchLength * 0.4;

            ctx.beginPath();
            ctx.moveTo(
                Math.cos(angle) * startDist,
                Math.sin(angle) * startDist
            );
            ctx.lineTo(
                Math.cos(subAngle1) * (startDist + subLength),
                Math.sin(subAngle1) * (startDist + subLength)
            );
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(
                Math.cos(angle) * startDist,
                Math.sin(angle) * startDist
            );
            ctx.lineTo(
                Math.cos(subAngle2) * (startDist + subLength),
                Math.sin(subAngle2) * (startDist + subLength)
            );
            ctx.stroke();
        }

        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(0, 0, this.size * 0.15, 0, Math.PI * 2);
        ctx.fill();
    }
}

class SnowSystem {
    constructor(canvasWidth, canvasHeight, intensity = 50, speed = 3) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.intensity = intensity;
        this.speed = speed;
        this.snowflakes = [];
        this.windStrength = 0;
        this.active = false;

        this.generateSnowflakes();
    }

    generateSnowflakes() {
        this.snowflakes = [];
        const count = Math.floor(this.intensity * 1.5);

        for (let i = 0; i < count; i++) {
            this.snowflakes.push(new Snowflake(
                Utils.random(-50, this.canvasWidth + 50),
                Utils.random(-this.canvasHeight, this.canvasHeight),
                Utils.random(3, 8),
                Utils.random(this.speed * 0.6, this.speed * 1.4)
            ));
        }
    }

    setActive(active) {
        this.active = active;
    }

    setIntensity(intensity) {
        this.intensity = intensity;
        this.generateSnowflakes();
    }

    setWindStrength(strength) {
        this.windStrength = strength;
    }

    update(deltaTime = 1) {
        if (!this.active) return;

        this.snowflakes.forEach(flake => {
            flake.update(this.windStrength, deltaTime);

            if (flake.y > this.canvasHeight || flake.x > this.canvasWidth + 100 || flake.x < -100) {
                flake.x = Utils.random(-50, this.canvasWidth + 50);
                flake.y = Utils.random(-50, 0);
            }
        });
    }

    render(ctx) {
        if (!this.active) return;

        this.snowflakes.forEach(flake => {
            flake.render(ctx);
        });
    }

    resize(width, height) {
        this.canvasWidth = width;
        this.canvasHeight = height;
        this.generateSnowflakes();
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Snowflake, SnowSystem };
}
