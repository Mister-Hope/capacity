<template>
  <div class="global-bottom">
    <div class="global-bottom-progress">
      <div
        class="global-bottom-progress-fill"
        :style="{ width: `${progress}%` }"
      />
    </div>
    <div class="global-bottom-meta">
      <span class="global-bottom-page">{{ $slidev.nav.currentPage }} / {{ $slidev.nav.total }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const progress = computed(() => {
  const nav = ($slidev as any).nav
  if (nav.total <= 1) return 0
  return Math.round((nav.currentPage / nav.total) * 100)
})
</script>

<style scoped>
.global-bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  pointer-events: none;
}

.global-bottom-progress {
  height: 3px;
  background: rgba(148, 163, 184, 0.08);
}

.global-bottom-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #e2a846, #f59e0b);
  transition: width 0.5s ease;
  border-radius: 0 2px 2px 0;
}

.global-bottom-meta {
  display: flex;
  justify-content: flex-end;
  padding: 0.6rem 3.5rem;
}

.global-bottom-page {
  font-size: 0.6rem;
  color: rgba(148, 163, 184, 0.3);
  font-variant-numeric: tabular-nums;
}
</style>
