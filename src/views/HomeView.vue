<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useRouter } from "vue-router";
import { siteConfig } from "@/config/site";
import PlanetOrbit from "@/components/PlanetOrbit.vue";
import NebulaLoader from "@/components/NebulaLoader.vue";
import PyramidLoader from "@/components/PyramidLoader.vue";
import MarsEarthBackground from "@/components/MarsEarthBackground.vue";

// 路由
const router = useRouter();

// 背景组件引用
const earthBackgroundRef = ref<InstanceType<typeof MarsEarthBackground> | null>(null);

// ==================== 背景层状态 ====================
const scrollY = ref(0);
const isLoaded = ref(false);

const handleScroll = () => {
  scrollY.value = window.scrollY;
};

// ==================== 打字机效果 ====================
const typewriterText = ref("");
const fullText = "100101101000";
let typeIndex = 0;

const startTypewriter = () => {
  setTimeout(() => {
    const interval = setInterval(() => {
      if (typeIndex < fullText.length) {
        typewriterText.value += fullText.charAt(typeIndex);
        typeIndex++;
      } else {
        clearInterval(interval);
      }
    }, 80);
  }, 1000);
};

// ==================== 导航栏hover图标 ====================
const navItems = [
  { name: "首页", path: "/", icon: "🏠" },
  { name: "项目", path: "/projects", icon: "💻" },
  { name: "技能", path: "/skills", icon: "⚙️" },
  { name: "联系", path: "/contact", icon: "📧" },
];
const hoveredNav = ref<string | null>(null);

// ==================== 悬浮舱交互 ====================
const capsuleRef = ref<HTMLElement | null>(null);
const capsuleTilt = ref({ x: 0, y: 0 });

const handleCapsuleMove = (e: MouseEvent) => {
  if (!capsuleRef.value) return;
  const rect = capsuleRef.value.getBoundingClientRect();
  const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
  const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
  capsuleTilt.value = { x: -y * 15, y: x * 15 };
};

const handleCapsuleLeave = () => {
  capsuleTilt.value = { x: 0, y: 0 };
};

// ==================== 行星公转系统 ====================
// 公转元素配置：以火箭为圆心，固定轨道半径，半径大于火箭边界（约280px）
// 三个元素均匀分布在不同轨道，只能在各自轨道上运行
const orbitingPlanets = ref([
  { 
    name: "planet",      // 行星轨道SVG - 最小轨道
    angle: 0,            // 初始角度（度）
    speed: 0.2,          // 公转速度（度/帧）- 较慢
    radius: 720,         // 轨道半径（px）- 大于火箭边界
    size: 100            // 球壳尺寸
  },
  { 
    name: "nebula",      // 星云旋转动画 - 中等轨道
    angle: 150,          // 初始角度 - 间隔较远
    speed: 0.2,         // 公转速度 - 中速
    radius: 680,         // 轨道半径 - 中等
    size: 110            // 球壳尺寸
  },
  { 
    name: "pyramid",     // 3D金字塔 - 最大轨道
    angle: 300,          // 初始角度 - 均匀分布
    speed: 0.2,          // 公转速度 - 最慢
    radius: 740,         // 轨道半径 - 最大
    size: 90             // 球壳尺寸
  }
]);

// 计算属性：生成每个行星的样式
const planet1Style = computed(() => {
  const planet = orbitingPlanets.value[0];
  const radian = (planet.angle * Math.PI) / 180;
  const x = Math.cos(radian) * planet.radius;
  const y = Math.sin(radian) * planet.radius;
  return { transform: `translate(${x}px, ${y}px)` };
});

const planet2Style = computed(() => {
  const planet = orbitingPlanets.value[1];
  const radian = (planet.angle * Math.PI) / 180;
  const x = Math.cos(radian) * planet.radius;
  const y = Math.sin(radian) * planet.radius;
  return { transform: `translate(${x}px, ${y}px)` };
});

const planet3Style = computed(() => {
  const planet = orbitingPlanets.value[2];
  const radian = (planet.angle * Math.PI) / 180;
  const x = Math.cos(radian) * planet.radius;
  const y = Math.sin(radian) * planet.radius;
  return { transform: `translate(${x}px, ${y}px)` };
});

// 更新公转位置（每帧调用）
const updateOrbitPositions = () => {
  orbitingPlanets.value.forEach((planet: typeof orbitingPlanets.value[0]) => {
    planet.angle = (planet.angle + planet.speed) % 360;
  });
};

// ==================== 技能标签交互 ====================
const skillTags = ["点击进入控制台"];

// 点击跳转到控制台
const scrollToConsole = () => {
  const consoleSection = document.querySelector('.console-section');
  if (consoleSection) {
    consoleSection.scrollIntoView({ behavior: 'smooth' });
  }
};

// ==================== 行星点击跳转 ====================
const handlePlanetClick = (name: string) => {
  const routes: Record<string, string> = {
    planet: "/projects",   // 服务器模型 -> 项目
    nebula: "/contact",    // 元素球 -> 联系
    pyramid: "/skills",    // 金字塔 -> 技能
  };
  if (routes[name]) {
    router.push(routes[name]);
  }
};

// ==================== 代码雨效果 ====================
const codeDrops = ref<{ id: number; x: number; y: number; char: string; speed: number; opacity: number }[]>([]);
let dropId = 0;

const codeChars = [
  "const", "let", "var", "function", "return", "class", "interface",
  "import", "export", "from", "default", "async", "await", "try", "catch",
  "if", "else", "for", "while", "switch", "case", "break", "continue",
  "new", "this", "super", "extends", "implements",
  "string", "number", "boolean", "void", "null", "undefined",
  "any", "unknown", "never", "object", "Array", "Promise",
  "{ }", "[ ]", "( )", "=>", "===>", "!==", "??", "?.", "::",
  "// TODO", "/* */", "'''", '"""', "<<<", ">>>",
  "Java", "Spring", "Boot", "Vue", "React", "TypeScript", "Node",
  "MySQL", "Redis", "Docker", "Git", "Linux", "Nginx",
  "0x00", "0xFF", "true", "false", "console", "log", "debug",
  "fetch", "POST", "GET", "PUT", "DELETE", "HTTP", "API",
  "npm", "pnpm", "yarn", "build", "deploy", "test", "lint",
];

const spawnCodeDrop = () => {
  if (codeDrops.value.length < 40) {
    const drop = {
      id: dropId++,
      x: Math.random() * window.innerWidth,
      y: -20,
      char: codeChars[Math.floor(Math.random() * codeChars.length)],
      speed: 0.5 + Math.random() * 1,
      opacity: 0.15 + Math.random() * 0.25,
    };
    codeDrops.value.push(drop);
  }
};

const updateCodeDrops = () => {
  const dropType = codeDrops.value[0];
  codeDrops.value = codeDrops.value
    .map((drop: typeof dropType) => ({
      ...drop,
      y: drop.y + drop.speed,
    }))
    .filter((drop: typeof dropType) => drop.y < window.innerHeight + 50);
};

const triggerExplosion = (e: MouseEvent) => {
  return;
};

// ==================== 控制台交互 ====================
const consoleInput = ref("");
const consoleOutput = ref<string[]>([
  "╔══════════════════════════════════════════════╗",
  "║  🚀 欢迎来到个人空间站控制台 v2.0              ║",
  "║  输入 help 查看可用命令                       ║",
  "╚══════════════════════════════════════════════╝",
  "",
]);

const availableCommands: { [key: string]: string | (() => void) } = {
  help: `
📋 可用命令：
  whoami     - 查看个人信息
  cat intro  - 查看个人简介
  ls skills  - 查看技术栈列表
  projects   - 查看项目页面
  skills     - 查看技能详情
  contact    - 查看联系方式
  neofetch   - 显示系统信息
  clear      - 清空控制台
  `,
  whoami: `👤 ${siteConfig.name} | ${siteConfig.title}`,
  cat: "请使用完整命令，如: cat intro",
  "cat intro": `📝 ${siteConfig.siteDescription}`,
  "ls skills": `📂 skills/\n  ├── Java    ████████████░░ 90%\n  ├── Spring  ██████████░░░░ 85%\n  ├── Vue     ██████████░░░░ 80%\n  ├── MySQL   █████████░░░░░ 80%\n  ├── Redis   ████████░░░░░░ 75%\n  └── Docker  ████████░░░░░░ 75%`,
  projects: "➜ 正在跳转项目页面...",
  skills: "➜ 正在跳转技能页面...",
  contact: "➜ 正在跳转联系页面...",
  neofetch: `
  ┌─────────────────────────────┐
  │    OS: Code Universe v2.0   │
  │    Host: ${siteConfig.name.padEnd(20)} │
  │    Shell: Vue 3 + TS        │
  │    Theme: Space Station      │
  │    CPU: Creative Brain       │
  │    Memory: 100% Passion      │
  └─────────────────────────────┘`,
  clear: "CLEAR",
};

const executeCommand = () => {
  const cmd = consoleInput.value.trim().toLowerCase();
  consoleOutput.value.push(`$ ${consoleInput.value}`);
  
  if (cmd === "clear") {
    consoleOutput.value = [];
  } else if (cmd === "projects") {
    consoleOutput.value.push("➜ 正在跳转项目页面...");
    setTimeout(() => router.push("/projects"), 500);
  } else if (cmd === "skills") {
    consoleOutput.value.push("➜ 正在跳转技能页面...");
    setTimeout(() => router.push("/skills"), 500);
  } else if (cmd === "contact") {
    consoleOutput.value.push("➜ 正在跳转联系页面...");
    setTimeout(() => router.push("/contact"), 500);
  } else if (availableCommands[cmd]) {
    consoleOutput.value.push(availableCommands[cmd] as string);
  } else if (cmd) {
    consoleOutput.value.push(`❌ 未知命令: ${cmd}`);
  }
  
  consoleInput.value = "";
};

// ==================== 动画循环 ====================
let animationFrameId: number;
let dropIntervalId: number;

const animate = () => {
  updateCodeDrops();
  updateOrbitPositions(); // 更新公转位置
  animationFrameId = requestAnimationFrame(animate);
};

// ==================== 生命周期 ====================
onMounted(() => {
  setTimeout(() => {
    isLoaded.value = true;
    startTypewriter();
  }, 100);

  window.addEventListener("scroll", handleScroll, { passive: true });
  window.addEventListener("click", triggerExplosion);

  animate(); // 包含行星环绕动画
  
  dropIntervalId = window.setInterval(spawnCodeDrop, 500);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
  window.removeEventListener("click", triggerExplosion);
  cancelAnimationFrame(animationFrameId);
  clearInterval(dropIntervalId);
  
  // 销毁背景组件
  if (earthBackgroundRef.value) {
    earthBackgroundRef.value.destroy?.();
  }
});

</script>

<template>
  <div class="space-station-page" @click="triggerExplosion">
    <!-- Mars3D 3D 地球背景层 -->
    <MarsEarthBackground 
      ref="earthBackgroundRef"
      :auto-rotate="true"
      :rotate-speed="0.003"
      :opacity="0.8"
    />
    
    <div class="bg-layer">
      <div class="nebula-bg"></div>
      
      <div class="mid-layer">
        <span 
          v-for="i in 15" 
          :key="i" 
          class="floating-code"
          :style="{
            left: `${(i * 7) % 100}%`,
            top: `${(i * 11) % 100}%`,
            animationDelay: `${i * 0.3}s`,
            opacity: 0.15 + (i % 3) * 0.05,
            fontSize: `${0.8 + (i % 4) * 0.3}rem`
          }"
        >
          {{ ["{ }", "[ ]", "( )", "=>", "< />", "0x1A", "&&", "||", "++", "/* */"][i % 10] }}
        </span>
      </div>
      
      <div class="near-layer">
        <svg class="geo-lines" viewBox="0 0 1000 600" preserveAspectRatio="none">
          <path d="M0,150 Q250,50 500,150 T1000,100" stroke="url(#lineGrad1)" />
          <path d="M0,250 Q300,200 600,280 T1000,220" stroke="url(#lineGrad2)" />
          <path d="M0,380 Q400,320 700,400 T1000,350" stroke="url(#lineGrad3)" />
          <path d="M0,500 Q350,450 650,520 T1000,480" stroke="url(#lineGrad1)" />
          <circle cx="200" cy="120" r="2" fill="#a855f7" opacity="0.4"/>
          <circle cx="450" cy="180" r="1.5" fill="#ec4899" opacity="0.3"/>
          <circle cx="700" cy="350" r="2" fill="#3b82f6" opacity="0.4"/>
          <circle cx="850" cy="280" r="1.5" fill="#a855f7" opacity="0.3"/>
          <defs>
            <linearGradient id="lineGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#a855f7" stop-opacity="0.5"/>
              <stop offset="50%" stop-color="#ec4899" stop-opacity="0.3"/>
              <stop offset="100%" stop-color="#a855f7" stop-opacity="0.5"/>
            </linearGradient>
            <linearGradient id="lineGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#ec4899" stop-opacity="0.4"/>
              <stop offset="50%" stop-color="#3b82f6" stop-opacity="0.2"/>
              <stop offset="100%" stop-color="#ec4899" stop-opacity="0.4"/>
            </linearGradient>
            <linearGradient id="lineGrad3" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.3"/>
              <stop offset="50%" stop-color="#a855f7" stop-opacity="0.2"/>
              <stop offset="100%" stop-color="#3b82f6" stop-opacity="0.3"/>
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div class="stars-container">
        <div 
          v-for="i in 20" 
          :key="i" 
          class="star"
          :class="{ 'star-bright': i % 3 === 0 }"
          :style="{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 15}s`,
            animationDuration: `${100 + Math.random() * 5}s`
          }"
        ></div>
      </div>
    </div>

    <div class="code-rain">
      <div 
        v-for="drop in codeDrops" 
        :key="drop.id" 
        class="code-drop"
        :style="{
          left: `${drop.x}px`,
          top: `${drop.y}px`,
          opacity: drop.opacity
        }"
      >
        {{ drop.char }}
      </div>
    </div>

    <div 
      v-for="exp in explosions" 
      :key="exp.id" 
      class="explosion"
    >
      <div 
        v-for="(p, idx) in exp.particles" 
        :key="idx"
        class="explosion-particle"
        :style="{
          left: `${exp.x}px`,
          top: `${exp.y}px`,
          '--dx': `${p.dx}px`,
          '--dy': `${p.dy}px`
        }"
      ></div>
    </div>

    <div class="main-content" :class="{ loaded: isLoaded }">
      
      <nav class="glass-nav" :class="{ scrolled: scrollY > 50 }">
        <div class="nav-inner">
          <router-link to="/" class="ascii-logo">
            <span class="logo-text">
              <span v-for="(char, idx) in 'HANDSOME'" :key="idx" 
                :style="{ animationDelay: `${idx * 0.1}s` }"
                class="logo-char"
              >{{ char }}</span>
            </span>
            <span class="logo-glow"></span>
          </router-link>
          
          <div class="nav-items">
            <router-link 
              v-for="item in navItems" 
              :key="item.path"
              :to="item.path"
              class="nav-item"
              @mouseenter="hoveredNav = item.name"
              @mouseleave="hoveredNav = null"
            >
              <span class="nav-icon">{{ hoveredNav === item.name ? item.icon : '' }}</span>
              <span class="nav-text">{{ item.name }}</span>
              <span class="nav-underline"></span>
            </router-link>
          </div>
        </div>
      </nav>

      <section class="hero-section">
        <!-- 行星环绕容器 -->
        <div class="planets-container">
          <!-- 行星1：PlanetOrbit + 球形背景壳 -->
          <div 
            class="planet-item planet-1 cursor-pointer hover:scale-[1.5] transition-transform duration-300" 
            :style="planet1Style"
            @click="handlePlanetClick('planet')"
          >
            <div class="planet-sphere sphere-purple">
              <PlanetOrbit />
            </div>
          </div>

          <!-- 行星2：NebulaLoader + 球形背景壳 -->
          <div 
            class="planet-item planet-2 cursor-pointer hover:scale-[1.5] transition-transform duration-300" 
            :style="planet2Style"
            @click="handlePlanetClick('nebula')"
          >
            <div class="planet-sphere sphere-nebula">
              <NebulaLoader />
            </div>
          </div>

          <!-- 行星3：PyramidLoader + 球形背景壳 -->
          <div 
            class="planet-item planet-3 cursor-pointer hover:scale-[3] transition-transform duration-300" 
            :style="planet3Style"
            @click="handlePlanetClick('pyramid')"
          >
            <div class="planet-sphere sphere-gold">
              <PyramidLoader />
            </div>
          </div>
        </div>

        <!-- 中心火箭 -->
        <div class="capsule-wrapper">
          <div 
            ref="capsuleRef"
            class="rocket-capsule"
            :style="{
              transform: `perspective(1000px) rotateX(${capsuleTilt.x}deg) rotateY(${capsuleTilt.y}deg) scale3d(${capsuleTilt.x === 0 && capsuleTilt.y === 0 ? 1 : 0.97}, ${capsuleTilt.x === 0 && capsuleTilt.y === 0 ? 1 : 0.97}, 1)`,
              transition: capsuleTilt.x === 0 && capsuleTilt.y === 0 ? 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)' : 'transform 0.15s ease-out'
            }"
            @mousemove="handleCapsuleMove"
            @mouseleave="handleCapsuleLeave"
          >
            <div class="rocket-nose">
              <div class="cone-wrapper">
                <div class="cone-body"></div>
              </div>
            </div>

            <div class="rocket-body">
              <div class="avatar-section">
                <div class="avatar-wrapper">
                  <img 
                    src="https://q.qlogo.cn/headimg_dl?dst_uin=884738667&spec=640&img_type=jpg"
                    alt="头像"
                    class="avatar-img"
                  />
                  <div class="avatar-ring ring-1"></div>
                  <div class="avatar-ring ring-2"></div>
                </div>
              </div>

              <div class="profile-section">
                <h1 class="profile-name">{{ siteConfig.name }}</h1>
                <p class="typewriter-text">{{ typewriterText }}<span class="cursor">|</span></p>
                
                <div class="skill-tags">
                  <button 
                    v-for="skill in skillTags" 
                    :key="skill"
                    class="skill-tag"
                    @click="scrollToConsole"
                  >
                    {{ skill }}
                  </button>
                </div>
              </div>
            </div>

            <div class="rocket-flames">
              <div class="flame flame-1"></div>
              <div class="flame flame-2"></div>
              <div class="flame flame-3"></div>
            </div>

            <div class="rocket-fins">
              <div class="fin fin-left"></div>
              <div class="fin fin-right"></div>
              <div class="fin fin-back"></div>
            </div>
          </div>
        </div>
      </section>

      <section class="console-section">
        <div class="terminal-window">
          <div class="terminal-header">
            <div class="terminal-dots">
              <span class="dot red"></span>
              <span class="dot yellow"></span>
              <span class="dot green"></span>
            </div>
            <span class="terminal-title">user@space-station:~$</span>
          </div>
          
          <div class="terminal-body">
            <div class="console-output">
              <p v-for="(line, idx) in consoleOutput" :key="idx" class="console-line">
                {{ line }}
              </p>
            </div>
            
            <div class="console-input-line">
              <span class="prompt">➜</span>
              <input 
                v-model="consoleInput"
                type="text"
                class="console-input"
                placeholder="输入命令..."
                @keyup.enter="executeCommand"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
/* ==================== 整体布局 ==================== */
.space-station-page {
  position: relative;
  min-height: 100vh;
  overflow-x: hidden;
  background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
  color: white;
}

/* ==================== 行星环绕布局（核心改造） ==================== */
.planets-container {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 0;
  height: 0;
  z-index: 25;
}

.planet-item {
  position: absolute;
  left: 50%;
  top: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  /* 保持原始大小，确保圆形轨道不变形 */
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), z-index 0s;
  /* 允许鼠标交互 */
  cursor: pointer;
}

/* 悬停时行星发光增强 */
.planet-item:hover {
  z-index: 100 !important;
}

/* 悬停时球壳发光增强 */
.planet-item:hover .planet-sphere {
  box-shadow: 
    0 0 60px rgba(168, 85, 247, 0.8),
    0 0 120px rgba(168, 85, 247, 0.5),
    inset 0 0 50px rgba(255, 255, 255, 0.15);
}

/* 三个行星各自的层级，防止聚在一起 */
.planet-1 { z-index: 26; }
.planet-2 { z-index: 27; }
.planet-3 { z-index: 28; }

/* 球形背景壳基础样式 - 磨砂玻璃质感 */
.planet-sphere {
  position: relative;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  /* 磨砂玻璃效果 */
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  /* 边框发光 */
  border: 1px solid rgba(255, 255, 255, 0.15);
  /* 内部阴影增加立体感 */
  box-shadow: 
    inset 0 0 30px rgba(255, 255, 255, 0.05),
    inset 0 -10px 30px rgba(0, 0, 0, 0.2);
  /* 确保内容不超出 */
  overflow: visible;
  /* 允许鼠标交互 */
  cursor: pointer;
  /* 悬停发光增强 */
  transition: box-shadow 0.3s ease, transform 0.4s ease;
}

/* 悬停发光增强 */
.planet-sphere:hover {
  transform: scale(1.05);
}

/* 紫色渐变球体 - PlanetOrbit */
.sphere-purple {
  width: 130px;
  height: 130px;
  background: radial-gradient(
    circle at 30% 30%,
    rgba(168, 85, 247, 0.4) 0%,
    rgba(139, 92, 246, 0.3) 40%,
    rgba(87, 40, 204, 0.25) 70%,
    rgba(59, 130, 246, 0.2) 100%
  );
  box-shadow: 
    0 0 40px rgba(168, 85, 247, 0.5),
    0 0 80px rgba(168, 85, 247, 0.3),
    inset 0 0 30px rgba(255, 255, 255, 0.08),
    inset 0 -15px 40px rgba(87, 40, 204, 0.3);
  animation-delay: 0s;
}

/* 星云渐变球体 - NebulaLoader */
.sphere-nebula {
  width: 140px;
  height: 140px;
  background: radial-gradient(
    circle at 35% 35%,
    rgba(255, 191, 72, 0.35) 0%,
    rgba(190, 74, 29, 0.3) 35%,
    rgba(139, 92, 246, 0.25) 60%,
    rgba(236, 72, 153, 0.2) 100%
  );
  box-shadow: 
    0 0 50px rgba(255, 191, 72, 0.4),
    0 0 100px rgba(190, 74, 29, 0.25),
    inset 0 0 40px rgba(255, 255, 255, 0.1),
    inset 0 -20px 50px rgba(139, 92, 246, 0.3);
  animation-delay: 0.3s;
}

/* 金色渐变球体 - PyramidLoader */
.sphere-gold {
  width: 120px;
  height: 120px;
  background: radial-gradient(
    circle at 30% 30%,
    rgba(43, 222, 172, 0.35) 0%,
    rgba(139, 92, 246, 0.3) 30%,
    rgba(210, 40, 253, 0.25) 60%,
    rgba(47, 37, 133, 0.2) 100%
  );
  box-shadow: 
    0 0 45px rgba(43, 222, 172, 0.4),
    0 0 90px rgba(210, 40, 253, 0.3),
    inset 0 0 35px rgba(255, 255, 255, 0.08),
    inset 0 -15px 45px rgba(47, 37, 133, 0.4);
  animation-delay: 0.6s;
}

/* 确保组件在球体内部正确显示 */
.planet-sphere > * {
  position: relative;
  z-index: 1;
}

/* ==================== 背景层 ==================== */
.bg-layer {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: -1;
  /* 添加渐变叠加，让 CSS 背景与 Mars3D 地球融合 */
  background: linear-gradient(
    180deg,
    rgba(15, 12, 41, 0.85) 0%,
    rgba(48, 43, 99, 0.7) 40%,
    rgba(36, 36, 62, 0.6) 100%
  );
}

.nebula-bg {
  position: absolute;
  inset: -50%;
  background: 
    radial-gradient(ellipse at 20% 20%, rgba(168, 85, 247, 0.25) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 30%, rgba(236, 72, 153, 0.2) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 80%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse at 30% 60%, rgba(16, 185, 129, 0.12) 0%, transparent 40%);
  animation: nebulaFlow 20s ease-in-out infinite;
}

@keyframes nebulaFlow {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
}

.mid-layer {
  position: absolute;
  inset: 0;
  z-index: 1;
}

.floating-code {
  position: absolute;
  font-family: 'Courier New', monospace;
  color: rgba(168, 85, 247, 0.5);
  animation: floatCode 8s ease-in-out infinite;
  text-shadow: 0 0 10px rgba(168, 85, 247, 0.3);
}

@keyframes floatCode {
  0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.3; }
  50% { transform: translateY(-8px) rotate(3deg); opacity: 0.5; }
}

.near-layer {
  position: absolute;
  inset: 0;
  z-index: 2;
}

.geo-lines {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0.12;
  z-index: 1;
}

.geo-lines path {
  fill: none;
  stroke-width: 0.8;
  stroke-linecap: round;
}

.stars-container {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}

.star {
  position: absolute;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 50%;
  box-shadow: 0 0 4px rgba(255, 255, 255, 0.3);
  animation: starTwinkle 3s ease-in-out infinite;
}

@keyframes starTwinkle {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
}

/* ==================== 代码雨 ==================== */
.code-rain {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 3;
  overflow: hidden;
}

.code-drop {
  position: absolute;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  color: rgba(168, 85, 247, 0.5);
  text-shadow: 0 0 8px rgba(168, 85, 247, 0.4), 0 0 20px rgba(168, 85, 247, 0.2);
  white-space: nowrap;
  animation: codeDropFall 3s linear infinite;
}

@keyframes codeDropFall {
  0% {
    transform: translateY(-10px);
    opacity: 0;
  }
  10% {
    opacity: 0.6;
  }
  90% {
    opacity: 0.6;
  }
  100% {
    transform: translateY(100px);
    opacity: 0;
  }
}

/* ==================== 爆炸效果 ==================== */
.explosion {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 100;
}

.explosion-particle {
  position: absolute;
  width: 8px;
  height: 8px;
  background: linear-gradient(135deg, #a855f7, #ec4899);
  border-radius: 50%;
  animation: explode 0.6s ease-out forwards;
  transform: translate(-50%, -50%);
}

@keyframes explode {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(0);
    opacity: 0;
  }
}

/* ==================== 主内容层 ==================== */
.main-content {
  position: relative;
  z-index: 10;
  opacity: 0;
  transition: opacity 1s ease;
}

.main-content.loaded {
  opacity: 1;
}

/* ==================== 导航栏 ==================== */
.glass-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding: 1rem 2rem;
  background: transparent;
  transition: all 0.4s ease;
}

.glass-nav.scrolled {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(168, 85, 247, 0.3);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
}

.nav-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.ascii-logo {
  position: relative;
  font-family: 'Courier New', monospace;
  font-size: 1.5rem;
  font-weight: bold;
  text-decoration: none;
}

.logo-text {
  display: flex;
  background: linear-gradient(135deg, #a855f7, #ec4899, #3b82f6);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: logoGradient 3s ease infinite;
}

.logo-char {
  animation: charPop 0.5s ease backwards;
}

@keyframes charPop {
  0% { opacity: 0; transform: scale(0); }
  100% { opacity: 1; transform: scale(1); }
}

@keyframes logoGradient {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.logo-glow {
  position: absolute;
  inset: -10px;
  background: radial-gradient(circle, rgba(168, 85, 247, 0.3), transparent 70%);
  filter: blur(10px);
  animation: logoGlow 2s ease-in-out infinite;
}

@keyframes logoGlow {
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.1); }
}

.nav-items {
  display: flex;
  gap: 0.5rem;
}

.nav-item {
  position: relative;
  padding: 0.5rem 1rem;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  border-radius: 9999px;
  transition: all 0.3s ease;
  overflow: hidden;
}

.nav-item:hover {
  color: white;
  background: rgba(168, 85, 247, 0.2);
}

.nav-icon {
  position: absolute;
  left: 0.5rem;
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.3s ease;
}

.nav-item:hover .nav-icon {
  opacity: 1;
  transform: translateX(0);
}

.nav-text {
  transition: all 0.3s ease;
}

.nav-underline {
  position: absolute;
  bottom: 4px;
  left: 50%;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #a855f7, #ec4899);
  transform: translateX(-50%);
  transition: width 0.3s ease;
  border-radius: 1px;
}

.nav-item:hover .nav-underline {
  width: 60%;
}

/* ==================== Hero 区 ==================== */
.hero-section {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6rem 2rem 2rem;
}

.capsule-wrapper {
  position: relative;
  z-index: 15;
  animation: capsuleFloat 6s ease-in-out infinite;
  filter: drop-shadow(0 0 40px rgba(168, 85, 247, 0.6));
  /* 火箭不阻挡鼠标事件，让行星可以接收 */
  pointer-events: none;
}

.capsule-wrapper * {
  pointer-events: auto;
}

@keyframes capsuleFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

/* 火箭形态悬浮舱 */
.rocket-capsule {
  position: relative;
  width: 280px;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
}

.rocket-nose {
  width: 80px;
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  z-index: 10;
}

.cone-wrapper {
  position: relative;
  width: 70px;
  height: 65px;
}

.cone-body {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 70px;
  height: 65px;
  background: linear-gradient(180deg, 
    #ec4899 0%, 
    #c026d3 25%, 
    #a855f7 50%, 
    #7c3aed 75%, 
    #4f46e5 100%
  );
  clip-path: polygon(50% 0%, 100% 100%, 0% 100%);
  animation: coneSpin 3s linear infinite;
  box-shadow: 
    0 0 30px rgba(236, 72, 153, 0.6),
    inset 0 -20px 40px rgba(139, 92, 246, 0.5);
}

.cone-body::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, 
    transparent 0%, 
    rgba(255,255,255,0.4) 30%, 
    transparent 50%,
    rgba(0,0,0,0.2) 70%,
    transparent 100%
  );
  animation: coneShine 1.5s ease-in-out infinite;
}

@keyframes coneSpin {
  0% { transform: translateX(-50%) rotateY(0deg); }
  100% { transform: translateX(-50%) rotateY(360deg); }
}

@keyframes coneShine {
  0%, 100% { opacity: 0.3; transform: translateX(-50%); }
  50% { opacity: 0.8; transform: translateX(0%); }
}

/* 火箭主体 */
.rocket-body {
  width: 100%;
  background: linear-gradient(180deg, 
    rgba(168, 85, 247, 0.3) 0%,
    rgba(139, 92, 246, 0.25) 30%,
    rgba(236, 72, 153, 0.2) 100%
  );
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 20px 20px 10px 10px;
  padding: 1.5rem 1rem;
  box-shadow: 
    0 0 40px rgba(168, 85, 247, 0.4),
    inset 0 0 30px rgba(255, 255, 255, 0.05);
}

/* 火箭火焰 */
.rocket-flames {
  display: flex;
  justify-content: center;
  gap: 4px;
  margin-top: -2px;
}

.flame {
  width: 20px;
  height: 40px;
  border-radius: 0 0 50% 50%;
  background: linear-gradient(180deg, #fbbf24 0%, #f97316 50%, #ef4444 100%);
  animation: flameFlicker 0.15s ease-in-out infinite alternate;
}

.flame-1 { height: 45px; animation-delay: 0s; }
.flame-2 { height: 55px; animation-delay: 0.05s; }
.flame-3 { height: 40px; animation-delay: 0.1s; }

@keyframes flameFlicker {
  0% { transform: scaleY(1) scaleX(1); opacity: 1; }
  100% { transform: scaleY(1.1) scaleX(0.9); opacity: 0.8; }
}

/* 火箭尾翼 */
.rocket-fins {
  position: absolute;
  bottom: 50px;
  width: 100%;
  height: 60px;
  pointer-events: none;
}

.fin {
  position: absolute;
  background: linear-gradient(180deg, rgba(168, 85, 247, 0.8) 0%, rgba(139, 92, 246, 0.6) 100%);
  box-shadow: 0 0 15px rgba(168, 85, 247, 0.4);
}

.fin-left {
  left: -20px;
  bottom: 0;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 0 35px 25px;
  border-color: transparent transparent rgba(168, 85, 247, 0.7) transparent;
  filter: drop-shadow(-3px 0 8px rgba(168, 85, 247, 0.5));
}

.fin-right {
  right: -20px;
  bottom: 0;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 25px 35px 0;
  border-color: transparent transparent rgba(168, 85, 247, 0.7) transparent;
  filter: drop-shadow(3px 0 8px rgba(168, 85, 247, 0.5));
}

.fin-back {
  left: 50%;
  bottom: 5px;
  transform: translateX(-50%);
  width: 40px;
  height: 8px;
  background: linear-gradient(90deg, transparent, rgba(236, 72, 153, 0.6), transparent);
  border-radius: 4px;
  filter: blur(2px);
}

.avatar-section {
  position: relative;
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.avatar-wrapper {
  position: relative;
  width: 110px;
  height: 110px;
}

.avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid white;
  box-shadow: 0 0 30px rgba(168, 85, 247, 0.5);
  transition: all 0.4s ease;
}

.avatar-img:hover {
  transform: scale(1.1);
  box-shadow: 0 0 50px rgba(168, 85, 247, 0.8);
}

.avatar-ring {
  position: absolute;
  border-radius: 50%;
  border: 2px solid transparent;
  animation: ringRotate 8s linear infinite;
}

.ring-1 {
  inset: -10px;
  border-top-color: rgba(168, 85, 247, 0.8);
  border-right-color: rgba(236, 72, 153, 0.8);
}

.ring-2 {
  inset: -20px;
  border-bottom-color: rgba(59, 130, 246, 0.8);
  border-left-color: rgba(16, 185, 129, 0.8);
  animation-direction: reverse;
  animation-duration: 12s;
}

@keyframes ringRotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.profile-section {
  text-align: center;
}

.profile-name {
  font-size: 1.8rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #a855f7, #ec4899, #3b82f6);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: nameGradient 4s ease infinite;
  font-family: 'ZCOOL KuaiLe', cursive;
}

@keyframes nameGradient {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.typewriter-text {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 1.5rem;
  min-height: 1.5rem;
}

.cursor {
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.skill-tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.skill-tag {
  padding: 0.5rem 1rem;
  font-size: 0.85rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 9999px;
  color: rgba(255, 255, 255, 0.9);
  cursor: pointer;
  transition: all 0.3s ease;
}

.skill-tag:hover {
  transform: translateY(-3px);
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.6), rgba(236, 72, 153, 0.6));
  border-color: transparent;
  box-shadow: 0 4px 20px rgba(168, 85, 247, 0.4);
}

/* ==================== 控制台模块 ==================== */
.console-section {
  position: relative;
  padding: 4rem 2rem;
  z-index: 10;
}

.terminal-window {
  max-width: 800px;
  margin: 0 auto;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(20px);
  border-radius: 12px;
  border: 1px solid rgba(168, 85, 247, 0.3);
  overflow: hidden;
  box-shadow: 
    0 0 40px rgba(168, 85, 247, 0.2),
    inset 0 0 60px rgba(0, 0, 0, 0.3);
}

.terminal-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.terminal-dots {
  display: flex;
  gap: 0.5rem;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.dot.red { background: #ff5f56; }
.dot.yellow { background: #ffbd2e; }
.dot.green { background: #27ca40; }

.terminal-title {
  font-family: 'Courier New', monospace;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
}

.terminal-body {
  padding: 1rem;
  max-height: 300px;
  overflow-y: auto;
}

.console-output {
  margin-bottom: 1rem;
}

.console-line {
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  color: #27ca40;
  line-height: 1.6;
  white-space: pre-wrap;
}

.console-input-line {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.prompt {
  color: #a855f7;
  font-family: 'Courier New', monospace;
}

.console-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: white;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
}

.console-input::placeholder {
  color: rgba(255, 255, 255, 0.3);
}

/* ==================== 响应式 ==================== */
@media (max-width: 768px) {
  .glass-nav {
    padding: 0.75rem 1rem;
  }
  
  .ascii-logo {
    font-size: 1.2rem;
  }
  
  .nav-items {
    gap: 0.25rem;
  }
  
  .nav-item {
    padding: 0.4rem 0.6rem;
    font-size: 0.85rem;
  }
  
  .nav-icon {
    display: none;
  }
  
  .hero-section {
    padding: 5rem 1rem 2rem;
  }
  
  .rocket-capsule {
    width: 240px;
  }
  
  .rocket-body {
    padding: 1rem 0.8rem;
  }
  
  .rocket-nose {
    width: 60px;
    height: 40px;
  }
  
  .avatar-wrapper {
    width: 90px;
    height: 90px;
  }
  
  .profile-name {
    font-size: 1.5rem;
  }
  
  .skill-tags {
    gap: 0.3rem;
  }
  
  .skill-tag {
    padding: 0.3rem 0.6rem;
    font-size: 0.75rem;
  }
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
}

::-webkit-scrollbar-thumb {
  background: rgba(168, 85, 247, 0.5);
  border-radius: 3px;
}
</style>