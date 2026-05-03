# 天气场景模拟器 - 写实风格改进分析

## 一、当前实现问题分析

### 1.1 技术栈现状

当前项目使用纯 **Canvas 2D API** 进行程序化绘制，实现方式为：
- 纯几何图形（矩形、圆形、椭圆、贝塞尔曲线）
- 简单的颜色渐变
- 无纹理、无材质、无光影
- 无3D透视关系

### 1.2 核心问题清单

#### 人物渲染问题
```
当前问题                          写实需求
─────────────────────────────────────────────────────────
矩形+椭圆组合身体                 真实人体比例和骨骼结构
纯色填充衣物                      衣物纹理、褶皱、垂坠感
简单圆形头部                      面部特征：眼睛、鼻子、嘴巴、耳朵
简单弧形头发                      发丝细节、发型层次感
简单几何雨伞                      真实伞面、伞骨、光照反射
```

**具体代码位置**：`frontend/js/objects/character.js`
- `renderHead()`: 简单椭圆头部，仅有点状眼睛和弧形嘴巴
- `renderBody()`: 矩形填充，无任何纹理
- `renderHair()`: 简单椭圆，无发丝细节
- `renderUmbrella()`: 贝塞尔曲线伞面，无材质感

#### 树木渲染问题
```
当前问题                          写实需求
─────────────────────────────────────────────────────────
简单梯形树干                      树皮纹理、节疤、苔藓
圆形渐变树叶簇                    真实树叶形态、光影变化
无地面植被                        草地、灌木、落叶等细节
简单树枝结构                      复杂树枝分叉、粗细变化
```

**具体代码位置**：`frontend/js/objects/tree.js`
- `renderTrunk()`: 简单梯形渐变，仅有微弱的树皮纹理线条
- `renderLeaves()`: 圆形渐变簇，完全不像真实树叶
- `renderBranches()`: 简单梯形分支，无真实分叉效果

#### 云朵渲染问题
```
当前问题                          写实需求
─────────────────────────────────────────────────────────
简单圆形渐变组合                  真实云的体积感、层次感
单一透明度                        光影变化、明暗对比
无形态变化                        云的动态形态（积云、层云、卷云）
```

**具体代码位置**：`frontend/js/objects/cloud.js`
- `render()`: 3-5个圆形渐变堆叠，无体积感
- 无法区分积云、层云、雨云等不同形态

#### 天气特效问题
```
当前问题                          写实需求
─────────────────────────────────────────────────────────
简单线条雨滴                      雨滴体积、下落轨迹模糊
简单几何雪花                      真实雪花形态、大小变化
简单渐变雾气                      真实雾的层次感、能见度变化
无地面积水/积雪                   地面反射、堆积效果
无雨溅/飞溅效果                   雨滴落地溅起
```

**具体代码位置**：
- `frontend/js/effects/rain.js`: 简单线条，无体积感
- `frontend/js/effects/snow.js`: 简单6角星，无真实感
- `frontend/js/effects/fog.js`: 渐变填充，无真实雾气质感

#### 环境背景问题
```
当前问题                          写实需求
─────────────────────────────────────────────────────────
简单直线远山                      真实山脉形态、岩石细节
简单颜色渐变天空                  天空散射效果、大气透视
简单直线道路                      路面纹理、车道线细节
简单纯色地面                      草地、泥土、人行道等细节
```

### 1.3 问题本质

**根本原因**：纯 Canvas 2D 程序化几何绘制无法达到写实效果。

**写实风格需要的核心元素**：
1. **纹理/材质**：木纹、布料、皮肤、草地、石头
2. **光影系统**：光源、阴影、高光、反射、折射
3. **透视关系**：近大远小、景深、大气透视
4. **细节层次**：微小的瑕疵、变化、随机性
5. **物理模拟**：布料垂坠、头发飘动、液体流动

---

## 二、技术方案对比

### 2.1 方案一：Canvas 2D + 图片纹理（推荐短期方案）

**优点**：
- 无需大幅重构现有代码
- 学习曲线平缓
- 性能开销较小
- 可以渐进式改进

**缺点**：
- 3D效果仍然受限
- 光照、阴影需要手动绘制
- 动态效果（如布料摆动）实现复杂

**实现思路**：
```
当前架构                          改进后架构
─────────────────────────────────────────────────────────
纯几何绘制 ────────►              图片纹理为主
                                    几何图形为辅（遮罩、阴影）
                                    
人物渲染 ──────────►              人物精灵图(8方向行走等)
                                    或 3D渲染导出为2D序列帧
                                    
树木渲染 ──────────►              树木PNG图片（多种形态）
                                    不同季节、不同大小
                                    
云朵渲染 ──────────►              云朵PNG图片（多种形态）
                                    分层叠加产生体积感
                                    
地面/背景 ────────►              背景图（不同天气/时段）
                                    前景装饰图
```

**需要的素材**：
- 人物精灵图（男/女，不同衣物，不同姿势）
- 树木图片（近景/远景，不同季节）
- 云朵图片（不同形态：积云、层云、雨云）
- 背景图片（天空、远山、地面、道路）
- 天气特效序列帧（雨滴、雪花、雨滴落地飞溅）

**工作量评估**：
- 代码修改：约 30% 重构
- 素材制作：需要专业美术支持
- 开发周期：2-4周

---

### 2.2 方案二：Three.js WebGL 3D渲染（推荐长期方案）

**优点**：
- 真正的3D透视和体积感
- 支持PBR材质和真实光照
- 物理引擎支持（布料、头发、流体）
- 相机视角自由调节
- 可以利用现成3D素材库

**缺点**：
- 需要完全重写渲染层
- 学习曲线陡峭
- 性能开销较大（对移动设备不友好）
- 需要3D建模能力

**实现思路**：
```
技术栈迁移：
─────────────────────────────────────────────────────────
HTML5 Canvas 2D   ────────►      Three.js (WebGL)
纯几何绘制         ────────►      3D模型 + 材质 + 光照
手动动画          ────────►      骨骼动画 + 物理引擎

场景结构：
┌─────────────────────────────────────────────────────┐
│  Skybox (天空盒/动态天空)                            │
│  ┌───────────────────────────────────────────────┐  │
│  │  DirectionalLight (阳光/月光)                  │  │
│  │  AmbientLight (环境光)                         │  │
│  │  ┌─────────────────────────────────────────┐  │  │
│  │  │  远景：远山、云朵、雾气                   │  │  │
│  │  │  中景：树木、道路、建筑物                 │  │  │
│  │  │  近景：人物、植被、地面细节               │  │  │
│  │  └─────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

**需要的资源**：
- 3D模型：人物、树木、雨伞、建筑物等
- 材质贴图：皮肤、布料、木材、金属、草地
- 天空盒或程序化天空生成
- 可能需要Blender建模或购买3D素材

**工作量评估**：
- 代码重写：约 80%
- 3D资源：需要专业3D建模师
- 开发周期：1-3个月

---

### 2.3 方案三：混合方案（推荐折中方案）

结合方案一和方案二的优点：

**核心思路**：
- 背景/远景：使用图片或视频
- 中景/近景：使用Canvas 2D + 图片纹理
- 关键视觉元素：可考虑用WebGL渲染

**实现架构**：
```
层次结构（从后到前）：
─────────────────────────────────────────────────────────
1. 天空层      <img> 或 CSS background（不同时段/天气）
2. 远景层      <canvas> 或 <img>（远山、远景云）
3. 中景层      <canvas> 2D 渲染（近山、树木、建筑物）
4. 近景层      <canvas> 2D 渲染（人物、植被、道路）
5. 特效层      <canvas> 2D 渲染（雨、雪、雾）
6. UI层        HTML/CSS（控制面板、天气信息）
```

**优缺点**：
- ✅ 开发速度较快
- ✅ 效果提升明显
- ✅ 性能良好
- ❌ 无法实现真正的3D交互

---

### 2.4 方案四：CSS/DOM + 图片

**优点**：
- 最简单，无需Canvas知识
- CSS动画性能优秀
- 便于响应式设计

**缺点**：
- 动态效果受限
- 复杂场景难以管理
- 无法实现复杂的视觉效果

**适用场景**：
- 简单的天气图标动画
- 固定视角的场景展示
- 不推荐本项目使用

---

## 三、推荐方案详细设计

### 3.1 短期方案：Canvas 2D + 图片纹理（推荐立即实施）

#### 3.1.1 代码架构调整

```
frontend/
├── js/
│   ├── renderer.js           # 主渲染器（修改）
│   ├── objects/
│   │   ├── character.js      # 人物（改为精灵图）
│   │   ├── tree.js           # 树木（改为图片）
│   │   ├── cloud.js          # 云朵（改为图片）
│   │   └── sprite.js         # 新增：精灵图类
│   └── effects/
│       ├── rain.js           # 雨滴（改为序列帧）
│       ├── snow.js           # 雪花（改为序列帧）
│       └── particles.js      # 新增：粒子系统
├── assets/                   # 新增：素材目录
│   ├── images/
│   │   ├── characters/       # 人物素材
│   │   ├── trees/            # 树木素材
│   │   ├── clouds/           # 云朵素材
│   │   ├── backgrounds/      # 背景素材
│   │   ├── effects/          # 特效素材
│   │   └── ui/               # UI素材
│   └── spritesheets/         # 精灵表
└── config/
    └── assets.json           # 素材配置
```

#### 3.1.2 关键组件设计

**精灵图类（Sprite）**：
```javascript
class Sprite {
    constructor(imageSrc, options = {}) {
        this.image = new Image();
        this.image.src = imageSrc;
        this.frameWidth = options.frameWidth || 0;
        this.frameHeight = options.frameHeight || 0;
        this.frameCount = options.frameCount || 1;
        this.currentFrame = 0;
        this.animationSpeed = options.animationSpeed || 0.1;
        this.isLoaded = false;
        
        this.image.onload = () => {
            this.isLoaded = true;
            if (this.frameWidth === 0) {
                this.frameWidth = this.image.width / this.frameCount;
            }
            if (this.frameHeight === 0) {
                this.frameHeight = this.image.height;
            }
        };
    }
    
    update(deltaTime) {
        if (this.frameCount > 1) {
            this.currentFrame += this.animationSpeed * deltaTime;
            if (this.currentFrame >= this.frameCount) {
                this.currentFrame = 0;
            }
        }
    }
    
    render(ctx, x, y, options = {}) {
        if (!this.isLoaded) return;
        
        const scale = options.scale || 1;
        const opacity = options.opacity || 1;
        const rotation = options.rotation || 0;
        const flipX = options.flipX || false;
        
        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.translate(x, y);
        ctx.rotate(rotation);
        ctx.scale(flipX ? -scale : scale, scale);
        
        const frameIndex = Math.floor(this.currentFrame);
        const sx = frameIndex * this.frameWidth;
        
        ctx.drawImage(
            this.image,
            sx, 0,
            this.frameWidth, this.frameHeight,
            -this.frameWidth/2, -this.frameHeight/2,
            this.frameWidth, this.frameHeight
        );
        
        ctx.restore();
    }
}
```

**人物渲染重构**：
```javascript
class Character {
    constructor(x, y, gender = 'male') {
        this.x = x;
        this.y = y;
        this.gender = gender;
        this.sprites = {};
        this.currentAnimation = 'idle';
        this.direction = 1; // 1: 右, -1: 左
        
        this.loadSprites();
    }
    
    loadSprites() {
        const genderPrefix = this.gender === 'male' ? 'm' : 'f';
        
        this.sprites = {
            idle: new Sprite(`assets/characters/${genderPrefix}_idle.png`, {
                frameCount: 4,
                animationSpeed: 0.15
            }),
            walking: new Sprite(`assets/characters/${genderPrefix}_walking.png`, {
                frameCount: 8,
                animationSpeed: 0.2
            }),
            umbrella: new Sprite(`assets/characters/${genderPrefix}_umbrella.png`, {
                frameCount: 4,
                animationSpeed: 0.1
            })
            // 更多动画：跑步、站立、坐下等
        };
    }
    
    render(ctx) {
        const sprite = this.sprites[this.currentAnimation];
        if (sprite) {
            sprite.render(ctx, this.x, this.y, {
                flipX: this.direction === -1
            });
        }
    }
}
```

#### 3.1.3 分层渲染优化

```
渲染顺序（从后到前）：
─────────────────────────────────────────────────────────
1. 背景图片（天空+远山）
   - 不同时段：白天/夜晚/黎明/黄昏
   - 不同天气：晴天/阴天/雨天/雪天/雾天

2. 远景云（慢速移动）
   - 多张半透明PNG叠加
   - 不同形态：积云/层云/卷云

3. 远景树木（小尺寸，低细节）
   - 多棵排列，高度随机
   - 轻微模糊模拟景深

4. 近景树木（大尺寸，高细节）
   - 前景树木，细节丰富
   - 树叶随风摆动

5. 地面/道路
   - 草地纹理平铺
   - 道路纹理、车道线
   - 水坑（雨天）、积雪（雪天）

6. 人物
   - 精灵图动画
   - 阴影

7. 天气特效
   - 雨/雪粒子
   - 雾效果

8. UI层
   - 控制面板
   - 天气信息
```

---

### 3.2 长期方案：Three.js 3D渲染

#### 3.2.1 技术选型

| 组件 | 推荐技术 | 说明 |
|------|----------|------|
| 3D引擎 | Three.js | 最流行的WebGL框架 |
| 物理引擎 | Cannon.js / Ammo.js | 碰撞检测、物理模拟 |
| 后处理 | PostProcessing | Bloom、景深、色调映射 |
| 模型加载 | GLTFLoader | 支持Blender导出 |
| 动画系统 | THREE.AnimationMixer | 骨骼动画 |
| 天空系统 | ProceduralSky / Skybox | 动态天空 |

#### 3.2.2 场景架构

```javascript
class WeatherScene {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(60, 
            window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true 
        });
        
        this.setupLighting();
        this.setupSky();
        this.setupEnvironment();
        this.setupCharacter();
        this.setupWeatherEffects();
    }
    
    setupLighting() {
        // 环境光
        this.ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        this.scene.add(this.ambientLight);
        
        // 方向光（太阳/月亮）
        this.directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        this.directionalLight.position.set(100, 100, 50);
        this.directionalLight.castShadow = true;
        this.scene.add(this.directionalLight);
        
        // 半球光（天空/地面反射）
        this.hemisphereLight = new THREE.HemisphereLight(
            0x87CEEB, 0x3E2723, 0.6
        );
        this.scene.add(this.hemisphereLight);
    }
    
    setupSky() {
        // 方案一：天空盒
        const loader = new THREE.CubeTextureLoader();
        const texture = loader.load([
            'assets/sky/skybox/posx.jpg',
            'assets/sky/skybox/negx.jpg',
            'assets/sky/skybox/posy.jpg',
            'assets/sky/skybox/negy.jpg',
            'assets/sky/skybox/posz.jpg',
            'assets/sky/skybox/negz.jpg'
        ]);
        this.scene.background = texture;
        
        // 方案二：程序化天空
        // 使用 THREE.Sky 或自定义 shader
    }
    
    setupEnvironment() {
        // 地面
        const groundGeometry = new THREE.PlaneGeometry(200, 200);
        const groundMaterial = new THREE.MeshStandardMaterial({
            map: this.loadTexture('assets/ground/grass.jpg'),
            normalMap: this.loadTexture('assets/ground/grass_normal.jpg'),
            roughnessMap: this.loadTexture('assets/ground/grass_roughness.jpg')
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);
        
        // 树木
        this.trees = [];
        for (let i = 0; i < 10; i++) {
            const tree = this.createTree();
            tree.position.set(
                Math.random() * 100 - 50,
                0,
                Math.random() * 100 - 50
            );
            this.trees.push(tree);
            this.scene.add(tree);
        }
        
        // 远山
        this.createMountains();
    }
    
    setupCharacter() {
        // 加载人物模型
        const loader = new THREE.GLTFLoader();
        loader.load('assets/characters/male.glb', (gltf) => {
            this.character = gltf.scene;
            this.character.scale.set(1, 1, 1);
            this.character.castShadow = true;
            this.scene.add(this.character);
            
            // 设置动画
            this.animations = {};
            gltf.animations.forEach((clip) => {
                this.animations[clip.name] = {
                    clip: clip,
                    action: this.animationMixer.clipAction(clip)
                };
            });
        });
        
        this.animationMixer = new THREE.AnimationMixer(this.scene);
    }
}
```

#### 3.2.3 天气系统设计

```javascript
class WeatherSystem {
    constructor(scene) {
        this.scene = scene;
        this.weatherType = 'sunny';
        this.rainSystem = null;
        this.snowSystem = null;
        this.fogSystem = null;
        
        this.initParticleSystems();
    }
    
    initParticleSystems() {
        // 雨滴粒子系统
        const rainCount = 5000;
        const rainGeometry = new THREE.BufferGeometry();
        const rainPositions = new Float32Array(rainCount * 3);
        
        for (let i = 0; i < rainCount; i++) {
            rainPositions[i * 3] = Math.random() * 200 - 100;
            rainPositions[i * 3 + 1] = Math.random() * 100;
            rainPositions[i * 3 + 2] = Math.random() * 200 - 100;
        }
        
        rainGeometry.setAttribute('position', 
            new THREE.BufferAttribute(rainPositions, 3));
        
        const rainMaterial = new THREE.PointsMaterial({
            color: 0x8899aa,
            size: 0.3,
            transparent: true,
            opacity: 0.6
        });
        
        this.rainSystem = new THREE.Points(rainGeometry, rainMaterial);
        this.rainSystem.visible = false;
        this.scene.add(this.rainSystem);
        
        // 雪花、雾气类似实现
    }
    
    setWeather(type, intensity = 1) {
        this.weatherType = type;
        
        // 禁用所有天气
        this.rainSystem.visible = false;
        this.snowSystem.visible = false;
        
        // 启用对应天气
        switch (type) {
            case 'rain':
            case 'storm':
                this.rainSystem.visible = true;
                this.rainSystem.material.opacity = intensity * 0.6;
                break;
            case 'snow':
                this.snowSystem.visible = true;
                break;
            case 'fog':
                // 设置 THREE.Fog
                this.scene.fog = new THREE.Fog(0xcccccc, 10, 100);
                break;
            default:
                this.scene.fog = null;
        }
    }
    
    update(deltaTime) {
        // 更新雨滴位置
        if (this.rainSystem.visible) {
            const positions = this.rainSystem.geometry.attributes.position.array;
            for (let i = 0; i < positions.length; i += 3) {
                positions[i + 1] -= 10 * deltaTime; // 下落
                positions[i] += this.windSpeed * deltaTime; // 随风偏移
                
                if (positions[i + 1] < 0) {
                    positions[i + 1] = 100;
                }
            }
            this.rainSystem.geometry.attributes.position.needsUpdate = true;
        }
        
        // 雪花、雾气更新类似
    }
}
```

---

## 四、素材需求与提示词

### 4.1 图片素材清单

#### 人物素材（精灵图）

**风格要求**：
- 写实风格，接近真实人类比例
- 平视/稍俯视角度
- 透明背景（PNG格式）
- 高分辨率（至少512x512每帧）

**需要的素材**：

| 素材名称 | 帧数 | 描述 | 提示词 |
|----------|------|------|--------|
| 男性_站立_休闲装 | 4 | 站立呼吸动画 | `photorealistic young man in casual clothes, standing pose, neutral expression, full body, transparent background, high detail, 4k, studio lighting, --ar 1:1` |
| 男性_行走_休闲装 | 8 | 行走循环动画 | `photorealistic young man walking, casual clothes, full body, side view, sprite sheet animation, 8 frames, transparent background, high detail, 4k` |
| 男性_站立_持伞 | 4 | 持伞站立 | `photorealistic young man holding umbrella, standing, rainy day outfit, full body, transparent background, 4k` |
| 男性_行走_持伞 | 8 | 持伞行走 | `photorealistic young man walking with umbrella, rainy day, full body, side view, sprite sheet, 8 frames, transparent background` |
| 女性_站立_休闲装 | 4 | 站立呼吸 | `photorealistic young woman in casual clothes, standing, neutral expression, full body, transparent background, 4k` |
| 女性_行走_休闲装 | 8 | 行走循环 | `photorealistic young woman walking, casual clothes, full body, side view, sprite sheet 8 frames, transparent background` |
| 男性_冬季_厚衣 | 4 | 冬季厚外套 | `photorealistic man wearing heavy winter coat, scarf, gloves, standing, full body, cold weather outfit, transparent background, 4k` |
| 女性_冬季_厚衣 | 4 | 冬季厚外套 | `photorealistic woman wearing winter coat, scarf, gloves, standing, full body, cold weather, transparent background, 4k` |

#### 树木素材

**风格要求**：
- 写实风格树木
- 不同种类（阔叶树、针叶树）
- 不同季节（绿叶、黄叶、枯枝）
- 透明背景

**需要的素材**：

| 素材名称 | 描述 | 提示词 |
|----------|------|--------|
| 阔叶树_夏季_近景 | 近景高细节阔叶树 | `photorealistic large deciduous tree, summer green leaves, full height, detailed bark, isolated on transparent background, 4k, high detail, --ar 1:2` |
| 阔叶树_夏季_中景 | 中景阔叶树 | `photorealistic medium deciduous tree, green summer foliage, isolated transparent background, 2k, --ar 1:2` |
| 阔叶树_秋季_近景 | 秋天黄叶阔叶树 | `photorealistic large deciduous tree, autumn yellow orange leaves, full height, detailed bark, transparent background, 4k` |
| 针叶树_近景 | 松树/冷杉 | `photorealistic tall pine tree, evergreen conifer, full height, detailed pine needles, isolated transparent background, 4k, --ar 1:3` |
| 阔叶树_冬季_枯枝 | 冬季无叶树枝 | `photorealistic bare deciduous tree, winter season, intricate branches, no leaves, isolated transparent background, 4k` |
| 远景树木群 | 远景树林剪影 | `photorealistic distant tree line, forest silhouette, atmospheric perspective, hazy, soft details, isolated transparent background, --ar 4:1` |
| 树木被风吹动动画 | 风吹树动画序列 | `photorealistic tree swaying in strong wind, animation sequence, 8 frames, green leaves blowing, isolated transparent background, sprite sheet` |

#### 云朵素材

**风格要求**：
- 写实云朵，不同形态
- 半透明效果
- 不同天气类型

**需要的素材**：

| 素材名称 | 描述 | 提示词 |
|----------|------|--------|
| 积云_单体 | 单个棉花糖形状积云 | `photorealistic fluffy cumulus cloud, isolated on transparent background, white puffy shape, soft edges, high detail, 4k, --ar 2:1` |
| 积云_群组 | 积云群 | `photorealistic cumulus cloud cluster, multiple puffy clouds, isolated transparent background, 4k, --ar 3:1` |
| 层云_薄 | 薄层高云 | `photorealistic thin stratus clouds, wispy, high altitude, isolated transparent background, soft white, 4k` |
| 雨云_深色 | 厚重雨云 | `photorealistic dark storm clouds, heavy cumulonimbus, gray and dark blue, isolated transparent background, dramatic lighting, 4k` |
| 卷云_丝状 | 高空丝状卷云 | `photorealistic cirrus clouds, wispy feathery filaments, high altitude, isolated transparent background, delicate white, 4k` |

#### 背景素材

**风格要求**：
- 全景或宽幅风景
- 不同时段和天气
- 无缝拼接（如果需要滚动）

**需要的素材**：

| 素材名称 | 描述 | 提示词 |
|----------|------|--------|
| 白天_晴天_远景 | 晴朗白天远景 | `photorealistic landscape, clear sunny day, blue sky with few clouds, distant mountains, green hills, atmospheric perspective, panoramic, 8k, --ar 4:1` |
| 白天_阴天_远景 | 阴天天远景 | `photorealistic landscape, overcast cloudy day, gray sky, flat lighting, distant hills, atmospheric haze, panoramic, --ar 4:1` |
| 白天_雨天_远景 | 雨天远景 | `photorealistic landscape during rain, dark gray storm clouds, wet atmosphere, visible rain streaks in distance, panoramic, dark moody lighting, --ar 4:1` |
| 夜晚_晴天_远景 | 晴朗夜晚 | `photorealistic night landscape, clear dark blue sky, bright stars, crescent moon, distant mountains silhouettes, moonlight, panoramic, 8k, --ar 4:1` |
| 夜晚_多云_远景 | 多云夜晚 | `photorealistic night landscape, cloudy night sky, moon hidden behind clouds, dark atmosphere, distant hills, panoramic, --ar 4:1` |
| 黎明_远景 | 黎明时分 | `photorealistic landscape at dawn, sky gradient from purple to orange to yellow, sunrise just below horizon, soft pink light, panoramic, 8k, --ar 4:1` |
| 黄昏_远景 | 黄昏时分 | `photorealistic landscape at sunset, dramatic orange red purple sky gradient, golden hour light, long shadows, panoramic, 8k, --ar 4:1` |
| 雪地_远景 | 雪景远景 | `photorealistic winter landscape, snow covered ground and trees, pale blue sky, cold atmosphere, distant snowy mountains, panoramic, --ar 4:1` |
| 雾天_远景 | 大雾远景 | `photorealistic foggy landscape, thick white fog, low visibility, distant trees barely visible, atmospheric perspective, muted colors, panoramic, --ar 4:1` |

#### 地面/道路素材

**风格要求**：
- 可平铺纹理
- 不同地面类型
- 高细节

**需要的素材**：

| 素材名称 | 描述 | 提示词 |
|----------|------|--------|
| 草地_夏季 | 夏季草地纹理 | `photorealistic green grass texture, seamless tile, top view, short lawn, detailed blades, natural variation, high detail, 4k, --ar 1:1` |
| 草地_秋季 | 秋季草地 | `photorealistic autumn grass texture, yellow and brown, seamless tile, top view, fall season, 4k` |
| 草地_冬季_积雪 | 雪地覆盖 | `photorealistic snow covered ground texture, seamless tile, fresh white snow, subtle undulations, top view, 4k` |
| 沥青路面 | 沥青道路 | `photorealistic asphalt road texture, seamless tile, dark gray tarmac, fine grain, subtle cracks, top view, 4k` |
| 混凝土人行道 | 混凝土路面 | `photorealistic concrete sidewalk texture, seamless tile, light gray, expansion joints, subtle stains, top view, 4k` |
| 泥地_雨天 | 湿泥地 | `photorealistic wet muddy ground texture, seamless tile, dark brown mud, puddles, reflections, rainy day, top view, 4k` |
| 道路车道线 | 黄色白色标线 | `photorealistic road markings texture, yellow and white lane lines, dashed and solid, slightly worn, top view, transparent background, 4k` |

#### 天气特效素材

**风格要求**：
- 特效序列帧
- 透明背景
- 高分辨率

**需要的素材**：

| 素材名称 | 描述 | 提示词 |
|----------|------|--------|
| 雨滴_下落 | 雨滴粒子 | `photorealistic water droplet, clear water, falling raindrop, motion blur, isolated transparent background, high speed photography, 4k, multiple angles` |
| 雨滴_落地飞溅 | 雨滴撞击地面 | `photorealistic water splash, raindrop hitting ground, crown splash effect, water droplets flying, isolated transparent background, high speed photography, 4k` |
| 雪花_多种形态 | 真实雪花 | `photorealistic snowflakes, multiple different snow crystal patterns, intricate ice structures, white, isolated transparent background, macro photography, 4k, various sizes` |
| 雾气_层次 | 雾气纹理 | `photorealistic white fog texture, multiple layers, wispy mist, soft edges, transparent background, atmospheric haze, --ar 2:1` |

---

## 五、实施路线图

### 第一阶段：快速提升（1-2周）

**目标**：使用图片替换关键元素，快速提升视觉效果

**任务**：
1. [ ] 创建素材目录结构
2. [ ] 实现精灵图加载和渲染类
3. [ ] 替换背景为高质量图片（不同时段/天气）
4. [ ] 替换云朵为PNG图片
5. [ ] 替换树木为PNG图片
6. [ ] 更新渲染器以支持图片和几何图形混合渲染

**预期效果**：
- 背景和远景明显更真实
- 云朵和树木具有真实照片质感
- 用户能感受到场景参考价值

### 第二阶段：人物与交互（2-3周）

**目标**：实现写实风格的人物和完整的天气变化

**任务**：
1. [ ] 采集/购买人物精灵图素材
2. [ ] 重写人物渲染类
3. [ ] 实现人物换装系统（根据天气）
4. [ ] 实现人物动画（行走、站立、持伞等）
5. [ ] 优化天气特效（使用粒子系统）
6. [ ] 实现天气过渡动画

**预期效果**：
- 人物具有真实照片质感
- 不同天气下人物自动换装
- 天气变化平滑过渡

### 第三阶段：细节与优化（2-4周）

**目标**：添加细节层次，优化性能和用户体验

**任务**：
1. [ ] 添加地面细节（草地纹理、道路标线）
2. [ ] 添加阴影效果（人物、树木）
3. [ ] 添加景深效果（远景模糊）
4. [ ] 添加颜色分级（不同天气氛围）
5. [ ] 优化性能（图片压缩、分级渲染）
6. [ ] 添加更多动画细节（树叶飘动、布料摆动）
7. [ ] 实现响应式不同分辨率

**预期效果**：
- 场景具有电影级视觉层次
- 性能流畅（60fps）
- 在各种设备上显示良好

### 第四阶段：长期演进（可选）

**目标**：评估是否需要迁移到3D方案

**任务**：
1. [ ] 评估2D方案的视觉上限
2. [ ] 调研Three.js方案的可行性
3. [ ] 制作3D原型（可选）
4. [ ] 决定是否迁移或继续优化2D

---

## 六、成本与资源评估

### 6.1 素材获取方式

| 方式 | 成本 | 质量 | 周期 | 说明 |
|------|------|------|------|------|
| AI生成（Midjourney/DALL-E） | 低 | 中 | 快 | 需要大量prompt调试，可能需要后期处理 |
| 素材网站购买（Shutterstock等） | 中 | 高 | 中 | 需要匹配风格，可能需要裁剪处理 |
| 专业摄影师/画师定制 | 高 | 极高 | 慢 | 最理想，但成本高周期长 |
| 免费素材网站 | 无 | 低-中 | 快 | 质量参差不齐，版权需确认 |

### 6.2 推荐素材网站

**免费素材**：
- Unsplash (https://unsplash.com) - 高质量照片
- Pexels (https://www.pexels.com) - 免费商用
- Pixabay (https://pixabay.com) - 图片和视频
- OpenGameArt (https://opengameart.org) - 游戏素材

**付费素材**：
- Shutterstock (https://www.shutterstock.com) - 高质量图片/视频
- Adobe Stock (https://stock.adobe.com) - 与Adobe生态集成
- TurboSquid (https://www.turbosquid.com) - 3D模型
- Mixamo (https://www.mixamo.com) - 免费人物动画（Adobe旗下）
- CGTrader (https://www.cgtrader.com) - 3D模型市场

### 6.3 开发资源需求

**短期方案（图片+Canvas 2D）**：
- 前端开发：1人，4-6周
- 美术资源：根据获取方式，0-2人，2-4周
- 设备要求：普通开发机即可

**长期方案（Three.js 3D）**：
- 前端开发：1-2人，8-12周
- 3D建模师：1人，持续支持
- 设备要求：较好显卡（用于测试3D性能）

---

## 七、结论与建议

### 7.1 核心结论

1. **当前纯Canvas 2D几何绘制无法达到写实效果**
   - 缺乏纹理、材质、光影、透视
   - 无论怎么优化代码，视觉上限很低

2. **推荐分阶段实施**
   - 第一阶段：快速用图片替换关键元素
   - 第二阶段：优化人物和交互
   - 第三阶段：添加细节和优化
   - 第四阶段：评估是否需要3D

3. **不需要立即更换渲染引擎**
   - Canvas 2D + 图片可以达到很好的视觉效果
   - 开发成本更低，周期更短
   - 性能更稳定

4. **素材是关键**
   - 高质量素材决定了最终视觉效果
   - 建议优先解决素材获取问题

### 7.2 立即行动建议

1. **本周内**：确定素材获取方式（AI生成/购买/定制）
2. **下周内**：开始实施第一阶段（背景、云朵、树木图片化）
3. **两周后**：评估效果，决定继续2D方案或调研3D方案

### 7.3 风险提示

1. **AI生成素材风险**：
   - 风格一致性难以保证
   - 可能有奇异生成（畸形手、怪异比例）
   - 需要人工审核和后期处理

2. **版权风险**：
   - 使用网络图片需确认版权
   - 建议使用明确标明可商用的素材
   - 或自行拍摄/生成

3. **性能风险**：
   - 大量高分辨率图片会占用内存
   - 需要实现图片加载优化和分级渲染
   - 移动设备可能需要降低质量

---

## 八、附录：示例AI生图Prompt模板

### 8.1 Midjourney Prompt结构

```
[主体描述], [风格修饰], [质量修饰], [参数]
```

**示例**：
```
photorealistic young man standing in casual jeans and t-shirt, full body shot, neutral expression, --ar 1:2 --style raw --v 6.0
```

### 8.2 常用参数

| 参数 | 说明 | 示例 |
|------|------|------|
| --ar | 宽高比 | --ar 16:9, --ar 1:2 |
| --style | 风格模式 | --style raw（更写实） |
| --v | 模型版本 | --v 6.0 |
| --no | 排除元素 | --no text, watermark |
| --q | 质量 | --q 2（更高质量） |
| --s | 风格化 | --s 50（更低更写实） |

### 8.3 背景去除

AI生成的图片通常带有背景，需要去除背景：

**工具推荐**：
- remove.bg (在线免费)
- Photoshop 选择主体
- 在线工具：https://www.remove.bg/

### 8.4 精灵表制作

将多张单帧图片组合成精灵表：

**工具推荐**：
- TexturePacker (专业工具)
- Shoebox (免费)
- 在线工具：https://www.codeandweb.com/texturepacker

**精灵表格式**：
```
┌─────┬─────┬─────┬─────┐
│ F0  │ F1  │ F2  │ F3  │  4帧行走动画
└─────┴─────┴─────┴─────┘
每帧大小相同，水平排列
```

---

*文档创建时间：2026-05-03*
*最后更新：2026-05-03*
