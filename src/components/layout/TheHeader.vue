<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, nextTick, watch } from "vue";
import { useRoute } from "vue-router";
import ThemeToggle from "@/components/ThemeToggle.vue";

const route = useRoute();
const isMenuOpen = ref(false);
const scrollY = ref(0);

// 检测暗色模式
const isDark = ref(false);
let observer: MutationObserver | null = null;

const updateDarkMode = () => {
  isDark.value = document.documentElement.classList.contains("dark");
};

// 滚动时毛玻璃透明度变化：滚动 50px 内透明，超过 50px 逐渐变为半透明
const headerStyle = computed(() => {
  if (isDark.value) {
    const opacity = Math.min(scrollY.value / 50, 1);
    return {
      backgroundColor: `rgba(17, 24, 39, ${0.85 + opacity * 0.1})`,
    };
  }
  const opacity = Math.min(scrollY.value / 50, 1);
  return {
    backgroundColor: `rgba(255, 255, 255, ${0.8 + opacity * 0.15})`,
  };
});

const handleScroll = () => {
  scrollY.value = window.scrollY;
};

const closeMenu = () => {
  isMenuOpen.value = false;
};

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === "Escape") {
    closeMenu();
  }
};

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (!target.closest(".mobile-menu") && !target.closest(".menu-button")) {
    closeMenu();
  }
};

// 在组件挂载时添加事件监听
onMounted(() => {
  updateDarkMode();
  // 监听暗色模式变化
  const observer = new MutationObserver(updateDarkMode);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });

  window.addEventListener("scroll", handleScroll, { passive: true });
  window.addEventListener("click", handleClickOutside);
  window.addEventListener("keydown", handleKeydown);
});

// 在组件卸载时移除事件监听，防止内存泄漏
onUnmounted(() => {
  if (observer) observer.disconnect();
  window.removeEventListener("scroll", handleScroll);
  window.removeEventListener("click", handleClickOutside);
  window.removeEventListener("keydown", handleKeydown);
});

const navItems = [
  { name: "首页", path: "/" },
  { name: "项目", path: "/projects" },
  { name: "技能", path: "/skills" },
  { name: "联系", path: "/contact" },
];

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

// 下划线指示器
const indicatorStyle = ref({ left: "0px", width: "0px" });
const navRefs = ref<{ [key: string]: HTMLElement | null }>({});

const updateIndicator = () => {
  nextTick(() => {
    const activeItem = navItems.find((item) => route.path === item.path);
    if (activeItem && navRefs.value[activeItem.path]) {
      const el = navRefs.value[activeItem.path];
      if (el) {
        const parent = el.parentElement;
        if (parent) {
          const parentRect = parent.getBoundingClientRect();
          const elRect = el.getBoundingClientRect();
          indicatorStyle.value = {
            left: `${elRect.left - parentRect.left}px`,
            width: `${elRect.width}px`,
          };
        }
      }
    }
  });
};

// 监听路由变化更新指示器
watch(() => route.path, updateIndicator, { immediate: true });
watch(() => route.path, () => nextTick(updateIndicator));

// 波纹效果
const rippleKey = ref(0);
const activeRipple = ref<{ x: number; y: number } | null>(null);

const handleNavClick = (e: MouseEvent) => {
  const target = e.currentTarget as HTMLElement;
  const rect = target.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  activeRipple.value = { x, y };
  rippleKey.value++;
  setTimeout(() => {
    activeRipple.value = null;
  }, 600);
};
</script>

<template>
  <header
    class="fixed w-full top-0 z-50 backdrop-blur-md transition-colors duration-300"
    :style="headerStyle"
  >
    <!-- 顶部 1px 淡紫-淡粉渐变描边 -->
    <div class="header-border"></div>
    <nav class="container mx-auto px-4 py-3 md:py-4">
      <div class="flex items-center justify-between">
        <router-link to="/" class="logo-link group relative overflow-hidden">
          <span
            class="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent bg-[length:200%_auto] hover:animate-gradient"
          >
            ༼ つ/̵͇̿̿/’̿’̿ ̿ ̿̿ ̿̿◕ _◕ ༽つ/̵͇̿̿/’̿’̿ ̿ ̿̿ ̿̿ ̿̿
          </span>
        </router-link>

        <!-- 桌面端导航 -->
        <div class="hidden md:flex items-center relative">
          <!-- 下划线指示器 -->
          <div class="nav-indicator" :style="indicatorStyle"></div>
          <router-link
            v-for="item in navItems"
            :key="item.path"
            :ref="(el) => { navRefs[item.path] = el as HTMLElement; }"
            :to="item.path"
            class="nav-link"
            @click="handleNavClick"
          >
            {{ item.name }}
            <!-- 波纹效果 -->
            <span
              v-if="activeRipple"
              :key="rippleKey"
              class="nav-ripple"
              :style="{ left: activeRipple.x + 'px', top: activeRipple.y + 'px' }"
            ></span>
          </router-link>
          <ThemeToggle />
        </div>

        <!-- 移动端菜单按钮 -->
        <div class="md:hidden flex items-center space-x-2">
          <ThemeToggle />
          <button
            class="menu-button p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            @click.stop="toggleMenu"
            aria-label="Toggle menu"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                v-if="!isMenuOpen"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
              <path
                v-else
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- 移动端导航菜单 -->
      <transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <div v-show="isMenuOpen" class="mobile-menu md:hidden">
          <div class="py-2 space-y-1">
            <router-link
              v-for="item in navItems"
              :key="item.path"
              :to="item.path"
              class="block px-4 py-2 text-base hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              :class="{
                'bg-primary/10 text-primary': route.path === item.path,
              }"
              @click="closeMenu"
            >
              {{ item.name }}
            </router-link>
          </div>
        </div>
      </transition>
    </nav>
  </header>
</template>

<style scoped>
/* 顶部 1px 淡紫-淡粉渐变描边 */
.header-border {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    rgba(168, 85, 247, 0.6) 0%,
    rgba(236, 72, 153, 0.8) 50%,
    rgba(168, 85, 247, 0.6) 100%
  );
  background-size: 200% 100%;
  animation: borderShimmer 4s ease-in-out infinite;
}

@keyframes borderShimmer {
  0%, 100% {
    background-position: 0% 50%;
    opacity: 0.8;
  }
  50% {
    background-position: 100% 50%;
    opacity: 1;
  }
}

/* 下划线指示器 */
.nav-indicator {
  position: absolute;
  bottom: 4px;
  height: 2px;
  background: linear-gradient(90deg, #a855f7, #ec4899);
  border-radius: 1px;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
}

.nav-link {
  position: relative;
  padding: 8px 16px;
  border-radius: 9999px;
  color: #6b7280;
  transition: all 0.3s ease;
  background: transparent;
  overflow: hidden;
}

.nav-link:hover {
  color: white;
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.85), rgba(236, 72, 153, 0.85));
}

.dark .nav-link {
  color: #d1d5db;
}

.dark .nav-link:hover {
  color: white;
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.9), rgba(236, 72, 153, 0.9));
}

/* 波纹效果 */
.nav-ripple {
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  transform: translate(-50%, -50%) scale(0);
  animation: ripple-expand 0.6s ease-out forwards;
  pointer-events: none;
}

@keyframes ripple-expand {
  to {
    transform: translate(-50%, -50%) scale(20);
    opacity: 0;
  }
}

.mobile-menu {
  @apply absolute top-full left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm
    border-t border-gray-200 dark:border-gray-700 shadow-lg;
}

/* 移动端导航链接悬停效果 */
@media (hover: hover) {
  .mobile-menu .router-link-active {
    @apply bg-primary-10 text-primary;
  }
}

/* Logo 悬停动画 */
.logo-link {
  @apply inline-block py-1;
}

.logo-link:hover span:first-child {
  @apply transform scale-105 transition-transform duration-300;
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

.hover\:animate-gradient:hover {
  animation: gradient 3s linear infinite;
}
</style>
