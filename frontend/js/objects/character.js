class Character {
    constructor(x, y, scale = 1, gender = 'male') {
        this.x = x;
        this.y = y;
        this.scale = scale;
        this.gender = gender;
        this.clothing = [];
        this.umbrella = { active: false, color: '#4A90D9' };
        this.posture = 'standing';
        
        this.breathPhase = 0;
        this.walkPhase = 0;
        this.windOffset = 0;
        
        this.colors = this.getGenderColors();
    }

    getGenderColors() {
        if (this.gender === 'male') {
            return {
                skin: '#E8B89D',
                hair: '#3E2723',
                shirt: '#1565C0',
                pants: '#1B5E20',
                jacket: '#37474F',
                scarf: '#C62828',
                shoes: '#212121'
            };
        } else {
            return {
                skin: '#F5CBA7',
                hair: '#6D4C41',
                blouse: '#E91E63',
                skirt: '#7B1FA2',
                cardigan: '#5C6BC0',
                dress: '#4CAF50',
                shoes: '#795548'
            };
        }
    }

    setConfig(sceneParams) {
        this.gender = sceneParams.character?.gender || 'male';
        this.clothing = sceneParams.character?.clothing || [];
        this.umbrella = sceneParams.character?.umbrella || { active: false, color: '#4A90D9' };
        this.posture = sceneParams.character?.posture || 'standing';
        this.colors = this.getGenderColors();
    }

    update(windStrength, deltaTime = 1) {
        this.breathPhase += 0.05 * deltaTime;
        this.windOffset += windStrength * 0.01 * deltaTime;
        
        if (this.posture === 'walking') {
            this.walkPhase += 0.1 * deltaTime;
        }
    }

    render(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.scale(this.scale, this.scale);

        const breathOffset = Math.sin(this.breathPhase) * 2;
        const windSkew = Math.sin(this.windOffset) * 0.05;
        ctx.transform(1, 0, windSkew, 1, 0, 0);

        if (this.umbrella.active) {
            this.renderUmbrella(ctx);
        }

        this.renderLegs(ctx);
        this.renderBody(ctx, breathOffset);
        this.renderArms(ctx, breathOffset);
        this.renderHead(ctx);
        this.renderHair(ctx);

        ctx.restore();
    }

    renderLegs(ctx) {
        const walkOffset = this.posture === 'walking' ? Math.sin(this.walkPhase) * 10 : 0;
        
        ctx.save();
        ctx.fillStyle = this.gender === 'male' ? this.colors.pants : this.colors.skirt;

        if (this.gender === 'male') {
            ctx.fillRect(-12, 0, 10, 40 + walkOffset);
            ctx.fillRect(2, 0, 10, 40 - walkOffset);

            ctx.fillStyle = this.colors.shoes;
            ctx.fillRect(-15, 38 + walkOffset, 16, 8);
            ctx.fillRect(-1, 38 - walkOffset, 16, 8);
        } else {
            ctx.beginPath();
            ctx.moveTo(-18, 0);
            ctx.lineTo(18, 0);
            ctx.lineTo(25, 35);
            ctx.lineTo(-25, 35);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = this.colors.skin;
            ctx.fillRect(-8, 30, 6, 15 + walkOffset);
            ctx.fillRect(2, 30, 6, 15 - walkOffset);

            ctx.fillStyle = this.colors.shoes;
            ctx.fillRect(-10, 43 + walkOffset, 12, 6);
            ctx.fillRect(-2, 43 - walkOffset, 12, 6);
        }

        ctx.restore();
    }

    renderBody(ctx, breathOffset) {
        ctx.save();
        
        const bodyY = -70 + breathOffset;
        const bodyWidth = this.gender === 'male' ? 40 : 36;
        const bodyHeight = 70;

        if (this.clothing.includes('heavy_jacket') || this.clothing.includes('jacket')) {
            ctx.fillStyle = this.colors.jacket;
            this.renderJacket(ctx, bodyY, bodyWidth, bodyHeight);
        } else if (this.clothing.includes('cardigan')) {
            ctx.fillStyle = this.colors.cardigan;
            this.renderCardigan(ctx, bodyY, bodyWidth, bodyHeight);
        }

        if (this.clothing.includes('tshirt') || this.clothing.includes('long_sleeve')) {
            ctx.fillStyle = this.colors.shirt;
            this.renderShirt(ctx, bodyY, bodyWidth, bodyHeight);
        } else if (this.clothing.includes('blouse')) {
            ctx.fillStyle = this.colors.blouse;
            this.renderBlouse(ctx, bodyY, bodyWidth, bodyHeight);
        }

        if (this.clothing.includes('scarf')) {
            this.renderScarf(ctx);
        }

        ctx.restore();
    }

    renderJacket(ctx, y, width, height) {
        ctx.beginPath();
        ctx.moveTo(-width/2, y + 15);
        ctx.lineTo(-width/2 + 5, y);
        ctx.lineTo(width/2 - 5, y);
        ctx.lineTo(width/2, y + 15);
        ctx.lineTo(width/2, y + height);
        ctx.lineTo(-width/2, y + height);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fillRect(-width/2 + 5, y + 20, width/2 - 10, 10);

        ctx.fillStyle = '#607D8B';
        ctx.beginPath();
        ctx.arc(0, y + 40, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(0, y + 60, 4, 0, Math.PI * 2);
        ctx.fill();
    }

    renderCardigan(ctx, y, width, height) {
        ctx.beginPath();
        ctx.moveTo(-width/2, y + 15);
        ctx.lineTo(-width/2 + 8, y);
        ctx.lineTo(width/2 - 8, y);
        ctx.lineTo(width/2, y + 15);
        ctx.lineTo(width/2, y + height - 10);
        ctx.lineTo(-width/2, y + height - 10);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, y + 15);
        ctx.lineTo(0, y + height - 10);
        ctx.stroke();
    }

    renderShirt(ctx, y, width, height) {
        ctx.beginPath();
        ctx.moveTo(-width/2 + 5, y + 15);
        ctx.lineTo(-width/2 + 10, y + 5);
        ctx.lineTo(width/2 - 10, y + 5);
        ctx.lineTo(width/2 - 5, y + 15);
        ctx.lineTo(width/2 - 5, y + height);
        ctx.lineTo(-width/2 + 5, y + height);
        ctx.closePath();
        ctx.fill();
    }

    renderBlouse(ctx, y, width, height) {
        ctx.beginPath();
        ctx.moveTo(-width/2 + 3, y + 20);
        ctx.quadraticCurveTo(-width/2 + 8, y + 5, 0, y + 8);
        ctx.quadraticCurveTo(width/2 - 8, y + 5, width/2 - 3, y + 20);
        ctx.lineTo(width/2 - 3, y + height - 5);
        ctx.lineTo(-width/2 + 3, y + height - 5);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.beginPath();
        ctx.arc(-5, y + 25, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(5, y + 25, 3, 0, Math.PI * 2);
        ctx.fill();
    }

    renderScarf(ctx) {
        ctx.save();
        ctx.fillStyle = this.colors.scarf;

        ctx.beginPath();
        ctx.ellipse(0, -65, 15, 8, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(-10, -60);
        ctx.quadraticCurveTo(-15, -30, -20, -10);
        ctx.quadraticCurveTo(-10, -15, -8, -20);
        ctx.quadraticCurveTo(-5, -35, -5, -58);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    }

    renderArms(ctx, breathOffset) {
        const walkOffset = this.posture === 'walking' ? Math.sin(this.walkPhase) * 15 : 0;
        
        ctx.save();
        ctx.fillStyle = this.clothing.includes('long_sleeve') || this.clothing.includes('jacket') || this.clothing.includes('cardigan')
            ? (this.clothing.includes('jacket') ? this.colors.jacket : this.clothing.includes('cardigan') ? this.colors.cardigan : this.colors.shirt)
            : this.colors.skin;

        ctx.save();
        ctx.translate(-22, -55 + breathOffset);
        ctx.rotate(Utils.radians(-20 + walkOffset));
        ctx.fillRect(-4, 0, 8, 35);
        ctx.restore();

        ctx.save();
        ctx.translate(22, -55 + breathOffset);
        ctx.rotate(Utils.radians(20 - walkOffset));
        ctx.fillRect(-4, 0, 8, 35);
        ctx.restore();

        ctx.fillStyle = this.colors.skin;
        const handY = this.posture === 'walking' 
            ? -20 + breathOffset + Math.sin(this.walkPhase) * 10
            : -20 + breathOffset;
        
        ctx.beginPath();
        ctx.arc(-28, handY, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(28, handY, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    renderHead(ctx) {
        ctx.save();

        ctx.fillStyle = this.colors.skin;
        ctx.beginPath();
        ctx.ellipse(0, -95, 16, 18, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(-15, -90);
        ctx.quadraticCurveTo(-8, -75, 0, -72);
        ctx.quadraticCurveTo(8, -75, 15, -90);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#333';
        ctx.beginPath();
        ctx.ellipse(-6, -98, 3, 2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(6, -98, 3, 2, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#E57373';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, -90, 5, 0.1 * Math.PI, 0.9 * Math.PI);
        ctx.stroke();

        ctx.restore();
    }

    renderHair(ctx) {
        ctx.save();
        ctx.fillStyle = this.colors.hair;

        if (this.gender === 'male') {
            ctx.beginPath();
            ctx.ellipse(0, -105, 18, 12, 0, Math.PI, Math.PI * 2);
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(-17, -105);
            ctx.lineTo(-15, -85);
            ctx.lineTo(-10, -95);
            ctx.closePath();
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(17, -105);
            ctx.lineTo(15, -85);
            ctx.lineTo(10, -95);
            ctx.closePath();
            ctx.fill();
        } else {
            ctx.beginPath();
            ctx.ellipse(0, -108, 20, 14, 0, Math.PI, Math.PI * 2);
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(-18, -105);
            ctx.quadraticCurveTo(-25, -80, -20, -60);
            ctx.lineTo(-15, -85);
            ctx.closePath();
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(18, -105);
            ctx.quadraticCurveTo(25, -80, 20, -60);
            ctx.lineTo(15, -85);
            ctx.closePath();
            ctx.fill();
        }

        ctx.restore();
    }

    renderUmbrella(ctx) {
        ctx.save();

        const umbrellaX = 0;
        const umbrellaY = -130;
        const windOffset = Math.sin(this.windOffset) * 5;

        ctx.fillStyle = this.colors.skin;
        ctx.fillRect(25, -45, 4, 15);

        ctx.save();
        ctx.translate(27 + windOffset, -45);
        ctx.rotate(Utils.radians(-30));

        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -65);
        ctx.stroke();

        ctx.fillStyle = this.umbrella.color;
        ctx.beginPath();
        ctx.moveTo(-40, -60);
        ctx.quadraticCurveTo(-20, -90, 0, -95);
        ctx.quadraticCurveTo(20, -90, 40, -60);
        ctx.quadraticCurveTo(0, -70, -40, -60);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;
        for (let i = -30; i <= 30; i += 15) {
            ctx.beginPath();
            ctx.moveTo(0, -60);
            ctx.lineTo(i, -60 - Math.abs(i) * 0.5);
            ctx.stroke();
        }

        ctx.fillStyle = '#5D4037';
        ctx.beginPath();
        ctx.arc(0, -5, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
        ctx.restore();
    }
}

class CharacterManager {
    constructor(canvasWidth, canvasHeight, groundY) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.groundY = groundY;
        this.character = new Character(
            canvasWidth / 2,
            groundY - 50,
            1.5,
            'male'
        );
    }

    setConfig(sceneParams) {
        this.character.setConfig(sceneParams);
    }

    update(windStrength, deltaTime = 1) {
        this.character.update(windStrength, deltaTime);
    }

    render(ctx) {
        this.character.render(ctx);
    }

    resize(width, height, groundY) {
        this.canvasWidth = width;
        this.canvasHeight = height;
        this.groundY = groundY;
        this.character.x = width / 2;
        this.character.y = groundY - 50;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Character, CharacterManager };
}
