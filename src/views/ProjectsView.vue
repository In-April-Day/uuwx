<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { projects } from "@/config/projects";

const projectsList = ref(projects);

// 当前轮播索引
const currentIndexes = ref<Record<number, number>>(
  projects.reduce((acc, p) => ({ ...acc, [p.id]: 0 }), {})
);

// 自动轮播计时器
const autoPlayIntervals = ref<Record<number, number>>({});

// 切换到上一张
const prevImage = (projectId: number, imagesLength: number) => {
  const current = currentIndexes.value[projectId];
  currentIndexes.value[projectId] = current === 0 ? imagesLength - 1 : current - 1;
};

// 切换到下一张
const nextImage = (projectId: number, imagesLength: number) => {
  const current = currentIndexes.value[projectId];
  currentIndexes.value[projectId] = (current + 1) % imagesLength;
};

// 指示器点击
const goToImage = (projectId: number, idx: number) => {
  currentIndexes.value[projectId] = idx;
};

// 鼠标悬停暂停
const pauseAutoPlay = (projectId: number) => {
  if (autoPlayIntervals.value[projectId]) {
    clearInterval(autoPlayIntervals.value[projectId]);
    delete autoPlayIntervals.value[projectId];
  }
};

// 鼠标离开恢复
const resumeAutoPlay = (projectId: number, imagesLength: number) => {
  if (imagesLength > 1) {
    autoPlayIntervals.value[projectId] = window.setInterval(() => {
      nextImage(projectId, imagesLength);
    }, 4000);
  }
};

onMounted(() => {
  // 启动所有项目的自动轮播
  projectsList.value.forEach((project) => {
    if (project.images.length > 1) {
      autoPlayIntervals.value[project.id] = window.setInterval(() => {
        nextImage(project.id, project.images.length);
      }, 4000);
    }
  });
});

onUnmounted(() => {
  // 清除所有计时器
  Object.values(autoPlayIntervals.value).forEach((interval) => {
    clearInterval(interval);
  });
  autoPlayIntervals.value = {};
});

// 页面切换动画延迟
const getTransitionDelay = (index: number) => `${index * 100}ms`;
</script>

<template>
  <div class="projects-page">
    <div class="page-header">
      <h1 class="page-title">项目展示</h1>
      <p class="page-subtitle">我的作品集</p>
    </div>

    <div class="projects-container">
      <article
        v-for="(project, index) in projectsList"
        :key="project.id"
        :style="{ transitionDelay: getTransitionDelay(index) }"
        class="project-card animate-fade-in"
      >
        <!-- 轮播区域 -->
        <div 
          class="carousel-wrapper"
          @mouseenter="pauseAutoPlay(project.id)"
          @mouseleave="resumeAutoPlay(project.id, project.images.length)"
        >
          <div class="carousel">
            <img
              :src="project.images[currentIndexes[project.id]]"
              :alt="project.title"
              class="carousel-image"
            />
          </div>
          
          <!-- 左右箭头 -->
          <template v-if="project.images.length > 1">
            <button
              class="carousel-btn prev"
              @click.stop="prevImage(project.id, project.images.length)"
              aria-label="上一张"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <button
              class="carousel-btn next"
              @click.stop="nextImage(project.id, project.images.length)"
              aria-label="下一张"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </template>

          <!-- 底部指示器 -->
          <div class="carousel-indicators">
            <span
              v-for="(_, idx) in project.images"
              :key="idx"
              class="indicator"
              :class="{ active: idx === currentIndexes[project.id] }"
              @click.stop="goToImage(project.id, idx)"
            ></span>
          </div>
        </div>

        <!-- 项目信息 -->
        <div class="project-info">
          <h2 class="project-title">{{ project.title }}</h2>
          <p class="project-description">{{ project.description }}</p>
          <div class="project-tags">
            <span
              v-for="tag in project.tags"
              :key="tag"
              class="tag"
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>

<style scoped>
.projects-page {
  min-height: 100vh;
  padding: 2rem;
  background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
}

.page-header {
  text-align: center;
  padding: 3rem 0;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #a855f7, #ec4899, #3b82f6);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradient 4s linear infinite;
  margin-bottom: 0.5rem;
}

.page-subtitle {
  color: rgba(255, 255, 255, 0.6);
  font-size: 1.1rem;
}

@keyframes gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.projects-container {
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.project-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(168, 85, 247, 0.2);
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.project-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 60px rgba(168, 85, 247, 0.3);
  border-color: rgba(168, 85, 247, 0.4);
}

/* 轮播样式 */
.carousel-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.3);
}

.carousel {
  position: relative;
  width: 100%;
  height: 100%;
}

.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.3s ease;
}

.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;
  opacity: 0;
}

.carousel-wrapper:hover .carousel-btn {
  opacity: 1;
}

.carousel-btn:hover {
  background: rgba(168, 85, 247, 0.7);
  border-color: rgba(168, 85, 247, 0.5);
}

.carousel-btn.prev { left: 1rem; }
.carousel-btn.next { right: 1rem; }

.carousel-indicators {
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.5rem;
  z-index: 10;
}

.indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  transition: all 0.3s ease;
}

.indicator:hover {
  background: rgba(255, 255, 255, 0.7);
}

.indicator.active {
  background: #a855f7;
  transform: scale(1.2);
}

/* 项目信息 */
.project-info {
  padding: 1.5rem 2rem 2rem;
}

.project-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.75rem;
}

.project-description {
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
  margin-bottom: 1rem;
}

.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  padding: 0.4rem 1rem;
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.3), rgba(236, 72, 153, 0.3));
  border: 1px solid rgba(168, 85, 247, 0.4);
  border-radius: 9999px;
  color: white;
  font-size: 0.85rem;
  transition: all 0.3s ease;
}

.tag:hover {
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.5), rgba(236, 72, 153, 0.5));
  transform: translateY(-2px);
}

/* 渐入动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.6s ease-out forwards;
}

/* 响应式 */
@media (max-width: 768px) {
  .projects-page {
    padding: 1rem;
  }

  .page-title {
    font-size: 1.8rem;
  }

  .project-info {
    padding: 1rem 1.25rem 1.5rem;
  }

  .project-title {
    font-size: 1.25rem;
  }
}
</style>
