<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

const canvasRef = ref<HTMLCanvasElement | null>(null);
let animationId: number | null = null;
let ctx: CanvasRenderingContext2D | null = null;
let lastTime = 0;

// 星星
let stars: { x: number; y: number; size: number; opacity: number; twinkleSpeed: number; phase: number }[] = [];

// 卫星
const satellites = [
  { angle: 0, speed: 0.3, radius: 150, color: '#a855f7' },
  { angle: 120, speed: 0.2, radius: 180, color: '#ec4899' },
  { angle: 240, speed: 0.25, radius: 120, color: '#3b82f6' },
];

// 轨道角度
const orbitAngles = [0, 45, 90, -30];

// 城市节点
const cities = [
  { x: 0, y: 0 }, { x: 30, y: -20 }, { x: -40, y: 30 },
  { x: 50, y: 40 }, { x: -20, y: -40 }, { x: 10, y: 50 }
];
const cityColors = ['#a855f7', '#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];
const connections = [[0, 1], [0, 2], [1, 3], [2, 3], [3, 4], [4, 5], [5, 1]];
let flowProgress = 0;

function initCanvas() {
  if (!canvasRef.value) return;
  ctx = canvasRef.value.getContext('2d', { alpha: false });
  if (!ctx) return;
  resizeCanvas();
  lastTime = performance.now();
  animate();
}

function resizeCanvas() {
  if (!canvasRef.value) return;
  canvasRef.value.width = window.innerWidth;
  canvasRef.value.height = window.innerHeight;
  generateStars();
}

function generateStars() {
  const count = Math.min(120, Math.floor(window.innerWidth * window.innerHeight / 12000));
  stars = Array.from({ length: count }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    size: Math.random() * 1.5 + 0.5,
    opacity: Math.random() * 0.4 + 0.4,
    twinkleSpeed: Math.random() * 0.015 + 0.005,
    phase: Math.random() * Math.PI * 2,
  }));
}

function animate() {
  if (!ctx || !canvasRef.value) return;

  const now = performance.now();
  const delta = (now - lastTime) / 1000;
  lastTime = now;

  const width = canvasRef.value.width;
  const height = canvasRef.value.height;
  const centerX = width / 2;
  const centerY = height * 0.45;
  const radius = Math.min(width, height) * 0.2;

  // 深空背景
  ctx.fillStyle = 'rgb(5, 5, 15)';
  ctx.fillRect(0, 0, width, height);

  // 星星
  const time = now * 0.001;
  for (let i = 0; i < stars.length; i++) {
    const s = stars[i];
    const twinkle = Math.sin(time * s.twinkleSpeed * 10 + s.phase) * 0.3 + 0.7;
    ctx.fillStyle = `rgba(255, 255, 255, ${s.opacity * twinkle})`;
    ctx.fillRect(s.x, s.y, s.size, s.size);
  }

  // 轨道线
  for (let i = 0; i < orbitAngles.length; i++) {
    const rad = (orbitAngles[i] * Math.PI) / 180;
    const orbitRadius = radius * (1.2 + i * 0.15);
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, orbitRadius, orbitRadius * Math.abs(Math.cos(rad)), rad, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(168, 85, 247, ${0.15 + i * 0.05})`;
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // 卫星
  for (let i = 0; i < satellites.length; i++) {
    const sat = satellites[i];
    sat.angle += sat.speed * delta;
    const rad = sat.angle;
    const x = centerX + Math.cos(rad) * sat.radius;
    const y = centerY + Math.sin(rad) * sat.radius * 0.5;

    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fillStyle = sat.color;
    ctx.fill();
  }

  // 城市节点
  const cityPositions = cities.map(c => ({
    x: centerX + c.x * radius * 0.015,
    y: centerY + c.y * radius * 0.015,
  }));

  flowProgress += delta * 0.3;
  if (flowProgress > 1) flowProgress = 0;

  // 连接线和流动点
  for (let i = 0; i < connections.length; i++) {
    const [from, to] = connections[i];
    const start = cityPositions[from];
    const end = cityPositions[to];

    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.strokeStyle = 'rgba(168, 85, 247, 0.2)';
    ctx.lineWidth = 1;
    ctx.stroke();

    const flowX = start.x + (end.x - start.x) * flowProgress;
    const flowY = start.y + (end.y - start.y) * flowProgress;
    ctx.beginPath();
    ctx.arc(flowX, flowY, 2, 0, Math.PI * 2);
    ctx.fillStyle = '#a855f7';
    ctx.fill();
  }

  // 城市节点
  for (let i = 0; i < cityPositions.length; i++) {
    const c = cityPositions[i];
    ctx.beginPath();
    ctx.arc(c.x, c.y, 3, 0, Math.PI * 2);
    ctx.fillStyle = cityColors[i];
    ctx.fill();
  }

  animationId = requestAnimationFrame(animate);
}

function destroy() {
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
}

defineExpose({ destroy });

onMounted(() => {
  initCanvas();
  window.addEventListener('resize', resizeCanvas);
});

onUnmounted(() => {
  destroy();
  window.removeEventListener('resize', resizeCanvas);
});
</script>

<template>
  <div class="mars-earth-container">
    <canvas ref="canvasRef" class="earth-canvas"></canvas>
    <div class="overlay-vignette"></div>
  </div>
</template>

<style scoped>
.mars-earth-container {
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;
}
.earth-canvas {
  width: 100%;
  height: 100%;
  display: block;
}
.overlay-vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse 100% 80% at 50% 50%,
    transparent 20%,
    rgba(10, 10, 26, 0.4) 60%,
    rgba(10, 10, 26, 0.8) 100%
  );
  pointer-events: none;
}
</style>
