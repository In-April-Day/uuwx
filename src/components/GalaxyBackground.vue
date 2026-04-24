<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useGalaxyRenderer, type UseGalaxyRendererReturn } from "@/composables/useGalaxyRenderer";
import type { GalaxyOptions } from "@/shaders/galaxy";

const props = withDefaults(defineProps<GalaxyOptions>(), {
  mouseInteraction: true,
  density: 0.6,
  glowIntensity: 0.4,
  saturation: 0.5,
  hueShift: 150,
  twinkleIntensity: 0.4,
  rotationSpeed: 0.05,
  starSpeed: 0.3,
  speed: 0.5,
  repulsionStrength: 2,
  autoCenterRepulsion: 0,
});

const containerRef = ref<HTMLDivElement | null>(null);
let renderer: UseGalaxyRendererReturn | null = null;

onMounted(() => {
  if (containerRef.value) {
    renderer = useGalaxyRenderer(props);
    renderer.init(containerRef.value);
  }
});

onUnmounted(() => {
  renderer?.destroy();
});
</script>

<template>
  <div ref="containerRef" class="galaxy-background"></div>
</template>

<style scoped>
.galaxy-background {
  position: fixed;
  inset: 0;
  z-index: -2;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
