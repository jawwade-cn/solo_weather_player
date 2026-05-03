class Tree {
    constructor(x, y, height, trunkWidth, type = 'deciduous') {
        this.x = x;
        this.y = y;
        this.height = height;
        this.trunkWidth = trunkWidth;
        this.type = type;
        
        this.swayAngle = 0;
        this.swaySpeed = Utils.random(0.02, 0.04);
        this.swayOffset = Utils.random(0, Math.PI * 2);
        this.maxSwayAngle = 0;
        
        this.leafClusters = this.generateLeafClusters();
        this.branches = this.generateBranches();
    }

    generateLeafClusters() {
        const clusters = [];
        const clusterCount = Utils.randomInt(5, 8);
        
        for (let i = 0; i < clusterCount; i++) {
            clusters.push({
                offsetX: Utils.random(-this.height * 0.15, this.height * 0.15),
                offsetY: Utils.random(this.height * 0.3, this.height * 0.8),
                radius: Utils.random(this.height * 0.1, this.height * 0.2),
                colorVariation: Utils.random(0.8, 1.2)
            });
        }
        
        return clusters;
    }

    generateBranches() {
        const branches = [];
        const branchCount = Utils.randomInt(3, 5);
        
        for (let i = 0; i < branchCount; i++) {
            const isLeft = i % 2 === 0;
            branches.push({
                startY: this.height * (0.4 + i * 0.1),
                length: this.height * Utils.random(0.15, 0.25),
                width: this.trunkWidth * Utils.random(0.2, 0.3),
                angle: (isLeft ? -1 : 1) * Utils.random(0.3, 0.6),
                direction: isLeft ? -1 : 1
            });
        }
        
        return branches;
    }

    update(windStrength, deltaTime = 1) {
        this.maxSwayAngle = Utils.radians(windStrength * 3);
        this.swayOffset += this.swaySpeed * deltaTime;
        this.swayAngle = Math.sin(this.swayOffset) * this.maxSwayAngle;
    }

    render(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.swayAngle);

        this.renderTrunk(ctx);
        this.renderBranches(ctx);
        this.renderLeaves(ctx);

        ctx.restore();
    }

    renderTrunk(ctx) {
        const gradient = ctx.createLinearGradient(
            -this.trunkWidth / 2, 0,
            this.trunkWidth / 2, 0
        );
        
        gradient.addColorStop(0, '#5D4037');
        gradient.addColorStop(0.3, '#8D6E63');
        gradient.addColorStop(0.7, '#6D4C41');
        gradient.addColorStop(1, '#4E342E');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        
        const trunkTopWidth = this.trunkWidth * 0.6;
        
        ctx.moveTo(-this.trunkWidth / 2, 0);
        ctx.lineTo(-trunkTopWidth / 2, -this.height);
        ctx.quadraticCurveTo(
            0, -this.height - 10,
            trunkTopWidth / 2, -this.height
        );
        ctx.lineTo(this.trunkWidth / 2, 0);
        ctx.closePath();
        
        ctx.fill();

        this.renderBarkTexture(ctx);
    }

    renderBarkTexture(ctx) {
        ctx.save();
        ctx.globalAlpha = 0.2;
        ctx.strokeStyle = '#3E2723';
        ctx.lineWidth = 1;

        for (let y = -this.height + 20; y < 0; y += 30) {
            ctx.beginPath();
            ctx.moveTo(-this.trunkWidth * 0.3, y);
            ctx.quadraticCurveTo(
                0, y + 10,
                this.trunkWidth * 0.3, y
            );
            ctx.stroke();
        }

        ctx.restore();
    }

    renderBranches(ctx) {
        ctx.save();
        ctx.fillStyle = '#5D4037';

        this.branches.forEach(branch => {
            ctx.save();
            ctx.translate(0, -branch.startY);
            ctx.rotate(branch.angle);

            const gradient = ctx.createLinearGradient(0, 0, 0, -branch.length);
            gradient.addColorStop(0, '#5D4037');
            gradient.addColorStop(1, '#6D4C41');

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.moveTo(-branch.width / 2, 0);
            ctx.lineTo(-branch.width / 4, -branch.length);
            ctx.quadraticCurveTo(
                0, -branch.length - 5,
                branch.width / 4, -branch.length
            );
            ctx.lineTo(branch.width / 2, 0);
            ctx.closePath();
            ctx.fill();

            ctx.restore();
        });

        ctx.restore();
    }

    renderLeaves(ctx) {
        const baseGreen = { r: 76, g: 175, b: 80 };
        
        this.leafClusters.forEach(cluster => {
            const clusterX = cluster.offsetX;
            const clusterY = -cluster.offsetY;
            const radius = cluster.radius;

            const gradient = ctx.createRadialGradient(
                clusterX, clusterY, 0,
                clusterX, clusterY, radius
            );

            const variation = cluster.colorVariation;
            const r = Math.floor(Utils.clamp(baseGreen.r * variation, 40, 120));
            const g = Math.floor(Utils.clamp(baseGreen.g * variation, 140, 200));
            const b = Math.floor(Utils.clamp(baseGreen.b * variation, 40, 120));

            gradient.addColorStop(0, `rgba(${r + 20}, ${g + 20}, ${b + 20}, 0.9)`);
            gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, 0.8)`);
            gradient.addColorStop(1, `rgba(${r - 20}, ${g - 20}, ${b - 20}, 0)`);

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(clusterX, clusterY, radius, 0, Math.PI * 2);
            ctx.fill();
        });

        this.renderLeafHighlights(ctx);
    }

    renderLeafHighlights(ctx) {
        ctx.save();
        ctx.globalAlpha = 0.3;

        for (let i = 0; i < 5; i++) {
            const x = Utils.random(-this.height * 0.15, this.height * 0.15);
            const y = Utils.random(-this.height * 0.4, -this.height * 0.8);
            const radius = Utils.random(10, 20);

            const highlight = ctx.createRadialGradient(x, y, 0, x, y, radius);
            highlight.addColorStop(0, 'rgba(200, 230, 200, 0.6)');
            highlight.addColorStop(1, 'rgba(200, 230, 200, 0)');

            ctx.fillStyle = highlight;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    }
}

class TreeManager {
    constructor(canvasWidth, canvasHeight, groundY) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.groundY = groundY;
        this.trees = [];

        this.generateTrees();
    }

    generateTrees() {
        this.trees = [];
        
        const treeCount = Utils.randomInt(3, 6);
        
        for (let i = 0; i < treeCount; i++) {
            const x = Utils.random(50, this.canvasWidth - 50);
            const height = Utils.random(120, 200);
            const trunkWidth = Utils.random(15, 25);
            
            this.trees.push(new Tree(x, this.groundY, height, trunkWidth));
        }

        this.trees.sort((a, b) => a.height - b.height);
    }

    update(windStrength, deltaTime = 1) {
        this.trees.forEach(tree => {
            tree.update(windStrength, deltaTime);
        });
    }

    render(ctx) {
        this.trees.forEach(tree => {
            tree.render(ctx);
        });
    }

    resize(width, height, groundY) {
        this.canvasWidth = width;
        this.canvasHeight = height;
        this.groundY = groundY;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Tree, TreeManager };
}
