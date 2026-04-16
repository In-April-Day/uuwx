<script setup lang="ts">
import { ref, onMounted } from "vue";
import PageTransition from "@/components/PageTransition.vue";

interface Skill {
  category: string;
  description: string;
  items: {
    name: string;
    level: number;
    description?: string;
  }[];
}

const skills = ref<Skill[]>([
  {
    category: "Java全栈开发",
    description: "专注于Java生态系统与现代化前端技术，构建高性能、可扩展的全栈应用",
    items: [
      { name: "Java", level: 90, description: "核心语言" },
      { name: "Spring Boot", level: 85, description: "Web应用开发" },
      { name: "MySQL", level: 80, description: "关系型数据库" },
      { name: "Redis", level: 75, description: "缓存与数据存储" },
      { name: "Vue.js", level: 80, description: "前端框架" },
      { name: "HTML/CSS", level: 80, description: "网页基础" },
      { name: "Git", level: 85, description: "版本控制" },
      { name: "Docker", level: 75, description: "容器化部署" },
      { name: "Linux", level: 80, description: "服务器运维" },
      { name: "IntelliJ IDEA", level: 85, description: "开发工具" },
    ],
  },
  {
    category: "剪辑",
    description: "视频剪辑与后期制作",
    items: [
      { name: "Premiere Pro", level: 70, description: "视频剪辑" },
      { name: "After Effects", level: 65, description: "特效制作" },
      { name: "剪映", level: 80, description: "短视频剪辑" },
      { name: "Photoshop", level: 75, description: "图像处理" },
    ],
  },
  {
    category: "嵌入式",
    description: "物联网设备开发与硬件编程，实现软硬件深度结合",
    items: [
      { name: "STM32", level: 45, description: "ARM微控制器" },
      { name: "嵌入式C", level: 80, description: "底层编程" },
      { name: "电路原理图", level: 65, description: "硬件设计" },
      { name: "PCB设计", level: 30, description: "电路板布局" },
    ],
  },
  {
    category: "Python",
    description: "脚本开发、数据分析与后端服务构建",
    items: [
      { name: "Python", level: 85, description: "核心语言" },
      { name: "Flask", level: 30, description: "轻量级框架" },
      { name: "PyCharm", level: 45, description: "开发工具" },
      { name: "Pygame", level: 55, description: "游戏开发" },
    ],
  },
]);

const activeCategory = ref(skills.value[0].category);

// 添加进度条动画控制
const isVisible = ref(false);
onMounted(() => {
  setTimeout(() => {
    isVisible.value = true;
  }, 500);
});
</script>

<template>
  <div class="min-h-screen py-16">
    <div class="container mx-auto px-4">
      <PageTransition>
        <h1
          class="text-3xl md:text-4xl font-bold text-center mb-10 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient"
        >
          技能
        </h1>
      </PageTransition>

      <!-- 分类导航 -->
      <div class="flex justify-center mb-8 space-x-3">
        <button
          v-for="skill in skills"
          :key="skill.category"
          class="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300"
          :class="[
            activeCategory === skill.category
              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700',
          ]"
          @click="activeCategory = skill.category"
        >
          {{ skill.category }}
        </button>
      </div>

      <!-- 技能内容 -->
      <div class="max-w-4xl mx-auto">
        <transition-group name="fade" mode="out-in">
          <div
            v-for="category in skills"
            :key="category.category"
            v-show="activeCategory === category.category"
          >
            <div class="text-center mb-6">
              <p
                class="text-gray-600 dark:text-gray-400 text-sm max-w-2xl mx-auto"
              >
                {{ category.description }}
              </p>
            </div>

            <div class="grid md:grid-cols-2 gap-4">
              <div
                v-for="(skill, index) in category.items"
                :key="skill.name"
                class="skill-card group"
              >
                <div class="flex items-center justify-between mb-2">
                  <div>
                    <div class="flex items-center gap-2">
                      <h3
                        class="text-base font-medium text-gray-800 dark:text-gray-200 group-hover:text-blue-500 transition-colors"
                      >
                        {{ skill.name }}
                      </h3>
                      <span class="text-sm font-medium text-blue-500"
                        >{{ skill.level }}%</span
                      >
                    </div>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {{ skill.description }}
                    </p>
                  </div>
                </div>
                <div
                  class="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden"
                >
                  <div
                    class="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-1000 ease-out transform origin-left progress-bar"
                    :style="{
                      width: isVisible ? `${skill.level}%` : '0%',
                      transitionDelay: `${index * 100}ms`,
                    }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </transition-group>
      </div>
    </div>
  </div>
</template>

<style scoped>
.skill-card {
  @apply p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm
    hover:shadow-md transition-all duration-300
    border border-gray-100 dark:border-gray-700;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

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

.progress-bar {
  animation: shimmer 2s linear infinite;
  background-size: 200% 100%;
}

@keyframes shimmer {
  0% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>
