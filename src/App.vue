<script setup lang="ts">
import { watch, onMounted } from "vue";
import { useRoute, type RouteMeta } from "vue-router";
import { RouterView } from "vue-router";
import TheHeader from "./components/layout/TheHeader.vue";
import TheFooter from "./components/layout/TheFooter.vue";
import PageTransition from "./components/PageTransition.vue";
import Toast from "./components/ui/Toast.vue";
import { siteConfig } from "./config/site";
import { siteInfo } from "./config/site-info";
import { printConsoleInfo } from "@/utils/console";

const route = useRoute();

// 监听路由变化更新页面标题和描述
watch(
  () => route.meta,
  (meta: RouteMeta) => {
    if (meta.title) {
      document.title = `${meta.title} | ${siteConfig.name}`;
    }
    if (meta.description) {
      document
        .querySelector('meta[name="description"]')
        ?.setAttribute("content", meta.description as string);
    }
    if (meta.keywords) {
      document
        .querySelector('meta[name="keywords"]')
        ?.setAttribute("content", meta.keywords as string);
    }
    // 更新 Open Graph 标签
    document
      .querySelector('meta[property="og:title"]')
      ?.setAttribute("content", meta.title as string);
    document
      .querySelector('meta[property="og:description"]')
      ?.setAttribute("content", meta.description as string);
  },
);

onMounted(() => {
  // 打印控制台信息
  printConsoleInfo({
    text: siteInfo.text,
    version: siteInfo.version,
    link: siteInfo.link,
  });
});
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <TheHeader />
    <main class="flex-grow pt-16 md:pt-20">
      <router-view v-slot="{ Component }">
        <PageTransition :name="(route.meta.transition as string) || 'fade'">
          <component :is="Component" />
        </PageTransition>
      </router-view>
    </main>
    <TheFooter />
    <Toast />
  </div>
</template>
