<script setup lang="ts">
import { ref } from "vue";
import { projects } from "@/config/projects";

const projectsList = ref(projects);

// 加载状态
const isLoading = ref(false);

// 模拟加载效果
const handleLoading = async () => {
  isLoading.value = true;
  await new Promise((resolve) => setTimeout(resolve, 300));
  isLoading.value = false;
};

// 页面切换动画延迟
const getTransitionDelay = (index: number) => `${index * 100}ms`;
</script>

<template>
  <div class="container mx-auto px-4 py-8 md:py-12">
    <h1
      class="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient"
    >
      项目展示
    </h1>

    <div class="max-w-6xl mx-auto">
      <!-- 加载状态 -->
      <div
        v-if="isLoading"
        class="flex items-center justify-center py-8 md:py-12"
      >
        <div
          class="loader dark:border-t-gray-700 dark:border-r-gray-700 dark:border-l-gray-700 w-10 h-10 md:w-12 md:h-12"
        ></div>
      </div>

      <!-- 项目列表 -->
      <TransitionGroup
        v-show="!isLoading"
        name="list"
        tag="div"
        class="grid grid-cols-1 md:grid-cols-2 gap-8 px-4"
      >
        <article
          v-for="(project, index) in projectsList"
          :key="project.id"
          :style="{ transitionDelay: getTransitionDelay(index) }"
          class="group bg-white dark:bg-gray-800/90 rounded-xl shadow-lg overflow-hidden hover:shadow-xl dark:hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-2 relative dark:border dark:border-gray-700/50 dark:hover:glow-lg dark:hover:border-primary/30 flex flex-col animate-fade-in"
        >
          <!-- 项目卡片悬停效果 -->
          <div
            class="absolute inset-0 bg-primary/5 dark:bg-primary/10 opacity-0 group-hover:opacity-100 transition-all duration-300 dark:group-hover:backdrop-blur-sm"
          ></div>
          <div class="relative h-56 overflow-hidden">
            <img
              :src="project.image"
              :alt="project.title"
              class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div
              class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
            >
              <a
                v-if="project.link && project.status === 'completed'"
                :href="project.link"
                target="_blank"
                class="px-8 py-3 bg-white/20 hover:bg-white/30 rounded-full transition-all duration-300 text-white font-medium hover:scale-105 hover:shadow-lg backdrop-blur-sm"
              >
                访问项目
              </a>
              <span
                v-if="project.status !== 'completed'"
                class="px-8 py-3 bg-white/20 rounded-full text-white backdrop-blur-sm"
              >
                {{ project.status === "developing" ? "开发中" : "规划中" }}
              </span>
            </div>
          </div>
          <div class="p-6 flex-1 flex flex-col">
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-xl font-semibold dark:text-gray-100">
                {{ project.title }}
              </h3>
              <span
                class="text-sm px-2 py-1 rounded"
                :class="{
                  'bg-green-100/80 text-green-800 dark:bg-green-900/80 dark:text-green-100':
                    project.status === 'completed',
                  'bg-yellow-100/80 text-yellow-800 dark:bg-yellow-900/80 dark:text-yellow-100':
                    project.status === 'developing',
                  'bg-gray-100/80 text-gray-800 dark:bg-gray-900/80 dark:text-gray-100':
                    project.status === 'planning',
                }"
              >
                {{
                  project.status === "completed"
                    ? "已完成"
                    : project.status === "developing"
                      ? "开发中"
                      : "规划中"
                }}
              </span>
            </div>
            <p class="text-gray-600 dark:text-gray-400 mb-4 flex-1">
              {{ project.description }}
            </p>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="tag in project.tags"
                :key="tag"
                class="px-3 py-1 bg-primary-10 dark:bg-primary/10 text-primary dark:text-primary-light rounded-full text-sm font-medium hover:scale-105 transition-transform cursor-default"
              >
                {{ tag }}
              </span>
            </div>
          </div>
        </article>
      </TransitionGroup>
    </div>
  </div>
</template>

<style scoped>
/* 列表动画 */
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(50px);
}

.list-leave-active {
  position: absolute;
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

/* 渐变动画 */
@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.animate-gradient {
  background-size: 200% auto;
  animation: gradient 4s linear infinite;
}

.animate-fade-in {
  animation: fadeIn 0.6s ease-out forwards;
}

/* 加载动画 */
.loader {
  width: 48px;
  height: 48px;
  border: 5px solid;
  border-color: #f3f3f3;
  border-bottom-color: var(--color-primary);
  border-radius: 50%;
  display: inline-block;
  animation: rotation 1s linear infinite;
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* 暗色模式特效 */
@media (prefers-color-scheme: dark) {
  .dark\:hover\:glow-lg:hover {
    box-shadow: 0 0 30px var(--color-primary);
    transform: translateY(-0.5rem) scale(1.01);
  }
}

/* 背景渐变 */
.container {
  background: linear-gradient(
    135deg,
    var(--color-primary-50/10) 0%,
    transparent 100%
  );
}

/* 卡片悬停效果增强 */
.group:hover {
  transform: translateY(-0.5rem) scale(1.01);
  z-index: 1;
}

/* 加载动画优化 */
.loader {
  box-shadow: 0 0 15px var(--color-primary/30);
}

/* 暗色模式优化 */
@media (prefers-color-scheme: dark) {
  .container {
    background: linear-gradient(
      135deg,
      var(--color-primary-900/10) 0%,
      transparent 100%
    );
  }
}
</style>
