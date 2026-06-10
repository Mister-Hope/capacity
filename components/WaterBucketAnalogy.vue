<script setup lang="ts">
import { ref, onUnmounted } from 'vue';

const level = ref(0);
const animating = ref(false);
let timer: any = null;

function toggle() {
  if (animating.value) return;
  if (level.value > 0.9) { level.value = 0; return; }
  animating.value = true; level.value = 0;
  const steps = 60; let step = 0;
  timer = setInterval(() => {
    step++;
    const t = step / steps;
    level.value = Math.min(1, 1 - Math.exp(-5 * t));
    if (step >= steps) { clearInterval(timer); timer = null; level.value = 1; animating.value = false; }
  }, 30);
}

onUnmounted(() => { if (timer) clearInterval(timer); });
</script>

<template>
  <div class="bucket-root" @click="toggle">
    <svg viewBox="0 0 680 230" class="bucket-svg">

      <!-- ═══════ 左侧：水桶 ═══════ -->
      <text x="210" y="18" text-anchor="middle" font-size="14" font-weight="800" fill="#94a3b8">水桶装水</text>

      <path d="M 105 55 L 105 215 Q 105 225 115 225 L 305 225 Q 315 225 315 215 L 315 55"
            fill="none" stroke="#64748b" stroke-width="3" />

      <defs><clipPath id="bC"><rect x="107" y="57" width="206" height="166" rx="2"/></clipPath></defs>
      <rect x="107" :y="223 - level * 131" width="206" :height="level * 131 + 2"
            fill="rgba(59,130,246,0.35)" clip-path="url(#bC)" />

      <line v-if="level > 0.02" x1="108" :y1="223 - level * 131" x2="314" :y2="223 - level * 131"
            stroke="rgba(147,197,253,0.5)" stroke-width="1.5" />

      <!-- 水龙头管 -->
      <rect x="60" y="74" width="55" height="13" rx="5" fill="#475569" stroke="#334155" stroke-width="1.5" />
      <path d="M 102 74 L 112 74 Q 116 74 116 78 L 116 88" fill="none" stroke="#475569" stroke-width="10" stroke-linecap="round"/>
      <ellipse cx="116" cy="91" rx="5" ry="2.5" fill="#334155" />
      <line x1="100" y1="92" x2="315" y2="92" stroke="#64748b" stroke-width="0.6" stroke-dasharray="3,5" opacity="0.3"/>

      <g v-if="animating && level < 0.9">
        <circle cx="116" cy="96" r="2.5" fill="#60a5fa" opacity="0.5">
          <animate attributeName="cy" from="93" to="220" dur="1s" repeatCount="indefinite"/>
          <animate attributeName="opacity" from="0.5" to="0" dur="1s" repeatCount="indefinite"/>
        </circle>
      </g>

      <!-- h：桶底 → 水面 -->
      <line x1="330" y1="223" x2="345" y2="223" stroke="#64748b" stroke-width="1" stroke-dasharray="3,3"/>
      <line x1="330" :y1="223 - level * 131" x2="345" :y2="223 - level * 131" stroke="#64748b" stroke-width="1" stroke-dasharray="3,3"/>
      <line x1="338" y1="223" x2="338" :y2="223 - level * 131" stroke="#e2a846" stroke-width="2"/>
      <!-- h 顶端箭头（指向上） -->
      <polygon :points="`334,${223 - level * 131 + 8} 338,${223 - level * 131 - 1} 342,${223 - level * 131 + 8}`" fill="#e2a846"/>
      <!-- h 底端箭头（指向下） -->
      <polygon :points="`334,${223 - 8} 338,${223 + 1} 342,${223 - 8}`" fill="#e2a846"/>
      <text x="353" :y="223 - level * 65" font-size="14" font-weight="800" fill="#e2a846">h</text>

      <!-- ═══════ 右侧：电容器 ═══════ -->
      <text x="480" y="18" text-anchor="middle" font-size="14" font-weight="800" fill="#94a3b8">电容器充电</text>

      <line x1="480" y1="32" x2="480" y2="98" stroke="#64748b" stroke-width="2"/>
      <line x1="480" y1="155" x2="480" y2="220" stroke="#64748b" stroke-width="2"/>
      <line x1="470" y1="32" x2="490" y2="32" stroke="#ef4444" stroke-width="3"/>
      <line x1="475" y1="37" x2="485" y2="37" stroke="#475569" stroke-width="5"/>

      <line x1="415" y1="98" x2="535" y2="98" stroke="#ef4444" stroke-width="5" stroke-linecap="round"/>
      <line x1="415" y1="155" x2="535" y2="155" stroke="#3b82f6" stroke-width="5" stroke-linecap="round"/>

      <g :opacity="level">
        <text x="430" y="87" font-size="14" font-weight="950" fill="#f87171">+</text>
        <text x="460" y="87" font-size="14" font-weight="950" fill="#f87171">+</text>
        <text x="490" y="87" font-size="14" font-weight="950" fill="#f87171">+</text>
        <text x="520" y="87" font-size="14" font-weight="950" fill="#f87171">+</text>
        <text x="430" y="172" font-size="14" font-weight="950" fill="#60a5fa">−</text>
        <text x="460" y="172" font-size="14" font-weight="950" fill="#60a5fa">−</text>
        <text x="490" y="172" font-size="14" font-weight="950" fill="#60a5fa">−</text>
        <text x="520" y="172" font-size="14" font-weight="950" fill="#60a5fa">−</text>
      </g>

      <!-- U：从两极板中间向上下对称展开 -->
      <line x1="550" y1="98" x2="580" y2="98" stroke="#64748b" stroke-width="1" stroke-dasharray="3,3"/>
      <line x1="550" y1="155" x2="580" y2="155" stroke="#64748b" stroke-width="1" stroke-dasharray="3,3"/>
      <line x1="565" :y1="126.5 - level * 28.5" :x2="565" :y2="126.5 + level * 28.5" stroke="#f59e0b" stroke-width="2.5"/>
      <!-- U 上端箭头（指向上） -->
      <polygon :points="`561,${126.5 - level * 28.5 + 7} 565,${126.5 - level * 28.5 - 1} 569,${126.5 - level * 28.5 + 7}`" fill="#f59e0b"/>
      <!-- U 下端箭头（指向下） -->
      <polygon :points="`561,${126.5 + level * 28.5 - 7} 565,${126.5 + level * 28.5 + 1} 569,${126.5 + level * 28.5 - 7}`" fill="#f59e0b"/>
      <text x="590" y="130" font-size="15" font-weight="800" fill="#f59e0b">U</text>

    </svg>
  </div>
</template>

<style scoped>
.bucket-root { width: 100%; cursor: pointer; user-select: none; }
.bucket-svg { display: block; width: 100%; height: auto; }
.bucket-svg text { font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important; user-select: none !important; pointer-events: none !important; }
</style>
