<template>
  <footer
    class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700"
  >
    <div class="container mx-auto px-4 py-6">
      <div class="flex justify-center items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
        <template v-for="link in footerConfig.links" :key="link.text">
          <router-link
            v-if="link.to"
            :to="link.to"
            class="hover:text-blue-500 transition-colors"
          >
            {{ link.text }}
          </router-link>
          <a
            v-else-if="link.href"
            :href="link.href"
            :target="link.target"
            class="hover:text-blue-500 transition-colors"
          >
            {{ link.text }}
          </a>
        </template>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { footerConfig } from "@/config/footer";
</script>
