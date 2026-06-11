<script setup lang="ts">
import { ref, computed, onUnmounted, onMounted } from "vue";

// State rules
// plateCharge goes from 0 (uncharged) to 1 (fully charged)
const plateCharge = ref<number>(0);
const current = ref<number>(0);
const state = ref<"idle" | "charging" | "discharging">("idle");
const switchPos = ref<"charge" | "discharge" | "open">("open");
const electronOffset = ref<number>(0);

// We keep a history of points for the real-time I-t graph
const currentPoints = ref<{ x: number; y: number }[]>([]);

let intervalId: any = null;
let stepCounter = 0;

// Color interpolation function
function interpolateColor(color1: string, color2: string, factor: number) {
  const parseHex = (hex: string) => {
    const match = hex.replace("#", "");
    const r = parseInt(match.substring(0, 2), 16);
    const g = parseInt(match.substring(2, 4), 16);
    const b = parseInt(match.substring(4, 6), 16);
    return { r, g, b };
  };
  const c1 = parseHex(color1);
  const c2 = parseHex(color2);
  const r = Math.round(c1.r + factor * (c2.r - c1.r));
  const g = Math.round(c1.g + factor * (c2.g - c1.g));
  const b = Math.round(c1.b + factor * (c2.b - c1.b));
  return `rgb(${r}, ${g}, ${b})`;
}

// Compute Horizontal Plate Colors
const upperPlateColor = computed(() => {
  return interpolateColor("#475569", "#ef4444", plateCharge.value); // Positive (Red)
});

const lowerPlateColor = computed(() => {
  return interpolateColor("#475569", "#3b82f6", plateCharge.value); // Negative (Blue)
});

// Switch handle target coordinate (using constant length radius ~70px to prevent stretching)
const switchTarget = computed(() => {
  if (switchPos.value === "charge") return { x: 220, y: 20 };
  if (switchPos.value === "discharge") return { x: 220, y: 90 };
  return { x: 210, y: 55 }; // Hanging open / disconnected (aligns with terminal 2)
});

// Computed SVG path for the live I-t graph
const graphPath = computed(() => {
  if (currentPoints.value.length === 0) {
    // Return empty or zero line
    return "M 440 105 L 700 105";
  }
  return currentPoints.value
    .map((p, idx) => `${idx === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");
});

// Select terminal action
function handleSelectTerminal(pos: "charge" | "discharge" | "open") {
  if (switchPos.value === pos) return; // Already in this position

  switchPos.value = pos;

  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }

  if (pos === "charge") {
    // Start charging transient
    if (plateCharge.value >= 0.99) {
      state.value = "idle";
      current.value = 0;
      currentPoints.value = [];
      for (let i = 0; i <= 40; i++) {
        currentPoints.value.push({
          x: 440 + (i / 40) * 260,
          y: 105,
        });
      }
      return;
    }

    state.value = "charging";
    currentPoints.value = [];
    stepCounter = 0;
    const chargeStart = plateCharge.value;

    intervalId = setInterval(() => {
      electronOffset.value += 4;
      stepCounter++;

      // Physically increment charge up to 1
      plateCharge.value = Math.min(1, chargeStart + (stepCounter / 40) * (1 - chargeStart));

      // Physically computed transient current decaying to 0
      const progress = stepCounter / 40;
      current.value = 0.5 * (1 - chargeStart) * Math.exp(-4 * progress);

      // Record graph point
      const x = 440 + progress * 260;
      const y = 105 - (current.value / 0.5) * 70;
      currentPoints.value.push({ x, y });

      if (stepCounter >= 40) {
        clearInterval(intervalId);
        intervalId = null;
        current.value = 0;
        state.value = "idle";
      }
    }, 40);

  } else if (pos === "discharge") {
    // Start discharging transient
    if (plateCharge.value <= 0.01) {
      state.value = "idle";
      current.value = 0;
      currentPoints.value = [];
      for (let i = 0; i <= 40; i++) {
        currentPoints.value.push({
          x: 440 + (i / 40) * 260,
          y: 105,
        });
      }
      return;
    }

    state.value = "discharging";
    currentPoints.value = [];
    stepCounter = 0;
    const dischargeStart = plateCharge.value;

    intervalId = setInterval(() => {
      electronOffset.value += 4;
      stepCounter++;

      // Physically decay capacitor charge down to 0
      plateCharge.value = Math.max(0, dischargeStart - (stepCounter / 40) * dischargeStart);

      // Negatively decaying current (opposite direction)
      const progress = stepCounter / 40;
      current.value = -0.5 * dischargeStart * Math.exp(-4 * progress);

      // Record graph point
      const x = 440 + progress * 260;
      const y = 105 - (current.value / 0.5) * 70;
      currentPoints.value.push({ x, y });

      if (stepCounter >= 40) {
        clearInterval(intervalId);
        intervalId = null;
        current.value = 0;
        state.value = "idle";
      }
    }, 40);

  } else {
    // Open (disconnected) - preserves plateCharge!
    state.value = "idle";
    current.value = 0;
    currentPoints.value = [];
    for (let i = 0; i <= 40; i++) {
      currentPoints.value.push({
        x: 440 + (i / 40) * 260,
        y: 105,
      });
    }
  }
}

onMounted(() => {
  // Initialize grid line on mount
  currentPoints.value = [];
  for (let i = 0; i <= 40; i++) {
    currentPoints.value.push({
      x: 440 + (i / 40) * 260,
      y: 105,
    });
  }
});

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
});
</script>

<template>
  <div class="circuit-wrap">
    <div
      class="bg-slate-900 border border-slate-800 rounded-xl shadow-xl text-slate-100 flex flex-col items-center select-none"
    >
      <!-- SVG Drawing -->
      <div
        id="capacitor-circuit-svg-container"
        class="w-full relative bg-slate-950/40 rounded-xl p-2 overflow-hidden"
      >
        <svg viewBox="0 0 720 220" class="circuit-svg">
          <!-- LEFT VERTICAL WIRE SECTION WITH EMBEDDED VERTICAL BATTERY (AS PER REF PICTURE) -->
          <line x1="45" y1="20" x2="45" y2="75" stroke="#475569" stroke-width="2" />
          <line x1="45" y1="89" x2="45" y2="160" stroke="#475569" stroke-width="2" />

          <!-- VERTICAL BATTERY SYMBOL -->
          <!-- Long positive plate (thin blue line) -->
          <line x1="33" y1="75" x2="57" y2="75" stroke="#3b82f6" stroke-width="2.5" />
          <!-- Short negative plate (thick slate line) -->
          <line x1="39" y1="83" x2="51" y2="83" stroke="#475569" stroke-width="4.5" />

          <!-- UPPER WIRE BUS: y=20 -->
          <line x1="45" y1="20" x2="220" y2="20" stroke="#475569" stroke-width="2" />

          <!-- LOWER WIRE BUS: y=160 -->
          <line x1="45" y1="160" x2="286" y2="160" stroke="#475569" stroke-width="2" />
          <line x1="314" y1="160" x2="380" y2="160" stroke="#475569" stroke-width="2" />

          <!-- VERTICAL SHUNT WIRE (DISCHARGE BRANCH) -->
          <line x1="220" y1="90" x2="220" y2="160" stroke="#475569" stroke-width="2" />

          <!-- AMMETER (A) - ON THE BOTTOM WIRE -->
          <g id="ammeter">
            <circle cx="300" cy="160" r="14" fill="#1e293b" stroke="#475569" stroke-width="2" />
            <text
              x="300"
              y="164"
              font-size="11"
              font-family="sans-serif"
              font-weight="900"
              fill="#94a3b8"
              text-anchor="middle"
            >
              A
            </text>
          </g>

          <!-- Knife Pivot Point -->
          <circle cx="280" cy="55" r="4.5" fill="#e2a846" stroke="#1e293b" stroke-width="1.5" />

          <!-- Switch Knife blade (Line) -->
          <line
            x1="280"
            y1="55"
            :x2="switchTarget.x"
            :y2="switchTarget.y"
            stroke="#e2a846"
            stroke-width="3"
            stroke-linecap="round"
            class="transition-all duration-300 ease-out"
          />

          <!-- THREE CLICKABLE CHASSIS TERMINALS (接线柱 CONTROLLERS) -->
          <!-- 1 (Charge Terminal) @ (220, 20) -->
          <g class="clickable group" @click="handleSelectTerminal('charge')">
            <circle cx="220" cy="20" r="16" fill="transparent" />
            <circle
              cx="220"
              cy="20"
              r="7.5"
              :fill="switchPos === 'charge' ? '#ef4444' : '#1e293b'"
              :stroke="switchPos === 'charge' ? '#f87171' : '#475569'"
              stroke-width="1.5"
              class="group-hover:stroke-red-400 group-hover:fill-red-950 transition-all duration-200"
            />
            <circle cx="220" cy="20" r="2.5" fill="#fff" />
            <text
              x="195"
              y="24"
              text-anchor="end"
              font-size="11"
              font-family="sans-serif"
              :fill="switchPos === 'charge' ? '#f87171' : '#64748b'"
              class="group-hover:fill-red-400 transition-all font-semibold"
            >
              1
            </text>
          </g>

          <!-- 2 (Open/Disconnect Terminal) @ (210, 55) -->
          <g class="clickable group" @click="handleSelectTerminal('open')">
            <circle cx="210" cy="55" r="16" fill="transparent" />
            <!-- We draw a tiny disconnected wire segment to show it is a contact -->
            <circle
              cx="210"
              cy="55"
              r="7.5"
              :fill="switchPos === 'open' ? '#94a3b8' : '#1e293b'"
              :stroke="switchPos === 'open' ? '#cbd5e1' : '#475569'"
              stroke-width="1.5"
              class="group-hover:stroke-slate-300 group-hover:fill-slate-800 transition-all duration-200"
            />
            <circle cx="210" cy="55" r="2.5" fill="#fff" />
            <text
              x="185"
              y="59"
              text-anchor="end"
              font-size="11"
              font-family="sans-serif"
              :fill="switchPos === 'open' ? '#cbd5e1' : '#64748b'"
              class="group-hover:fill-slate-300 transition-all font-semibold"
            >
              2
            </text>
          </g>

          <!-- 3 (Discharge Terminal) @ (220, 90) -->
          <g class="clickable group" @click="handleSelectTerminal('discharge')">
            <circle cx="220" cy="90" r="16" fill="transparent" />
            <circle
              cx="220"
              cy="90"
              r="7.5"
              :fill="switchPos === 'discharge' ? '#3b82f6' : '#1e293b'"
              :stroke="switchPos === 'discharge' ? '#60a5fa' : '#475569'"
              stroke-width="1.5"
              class="group-hover:stroke-blue-400 group-hover:fill-blue-950 transition-all duration-200"
            />
            <circle cx="220" cy="90" r="2.5" fill="#fff" />
            <text
              x="195"
              y="94"
              text-anchor="end"
              font-size="11"
              font-family="sans-serif"
              :fill="switchPos === 'discharge' ? '#60a5fa' : '#64748b'"
              class="group-hover:fill-blue-400 transition-all font-semibold"
            >
              3
            </text>
          </g>

          <!-- CAPACITOR PARALLEL PLATES WIRES -->
          <!-- Wire from switch pivot to upper plate -->
          <line x1="280" y1="55" x2="380" y2="55" stroke="#475569" stroke-width="2" />
          <line x1="380" y1="55" x2="380" y2="75" stroke="#475569" stroke-width="2" />

          <!-- Wire from lower plate to bottom wire -->
          <line x1="380" y1="105" x2="380" y2="160" stroke="#475569" stroke-width="2" />

          <!-- CAPACITOR PARALLEL PLATES (HORIZONTAL AS PER REF PICTURE) -->
          <g id="capacitor">
            <!-- Upper plate -->
            <line
              x1="340"
              y1="75"
              x2="420"
              y2="75"
              :stroke="upperPlateColor"
              stroke-width="4.5"
              stroke-linecap="round"
            />
            <!-- Lower plate -->
            <line
              x1="340"
              y1="105"
              x2="420"
              y2="105"
              :stroke="lowerPlateColor"
              stroke-width="4.5"
              stroke-linecap="round"
            />

            <!-- Label C -->
            <text
              x="332"
              y="94"
              font-size="11"
              font-family="sans-serif"
              font-weight="bold"
              fill="#94a3b8"
              text-anchor="end"
            >
              电容器
            </text>

            <!-- Charging indicator signs / static representation -->

            <!-- Color text legends as requested to indicate polarity colors -->
          </g>

          <!-- ANIMATED ELECTRON FLOW (e) ALONG BOTH WIRES OF THE CAPACITOR -->
          <!-- Upper line horizontal segment (x: 280 to 380 at y=55) -->
          <!-- Charging: electrons move AWAY from upper plate (Right to Left: 380 -> 280) -->
          <g v-if="state === 'charging'">
            <g
              v-for="i in 3"
              :key="'ue-c-' + i"
              :transform="`translate(${380 - ((electronOffset + i * 35) % 100)}, 55)`"
            >
              <circle cx="0" cy="0" r="3" fill="#3b82f6" class="shadow-sm" />
              <text
                x="0"
                y="-5"
                font-size="10"
                font-family="Georgia, 'Times New Roman', serif"
                font-style="italic"
                fill="#60a5fa"
                text-anchor="middle"
              >
                e
              </text>
            </g>
          </g>
          <!-- Discharging: electrons move TOWARDS upper plate (Left to Right: 280 -> 380) -->
          <g v-if="state === 'discharging'">
            <g
              v-for="i in 3"
              :key="'ue-d-' + i"
              :transform="`translate(${280 + ((electronOffset + i * 35) % 100)}, 55)`"
            >
              <circle cx="0" cy="0" r="3" fill="#ef4444" />
              <text
                x="0"
                y="-5"
                font-size="10"
                font-family="Georgia, 'Times New Roman', serif"
                font-style="italic"
                fill="#f87171"
                text-anchor="middle"
              >
                e
              </text>
            </g>
          </g>

          <!-- Bottom line horizontal segment (x: 314 to 380 at y=160) -->
          <!-- Charging: electrons move TOWARDS lower plate (Left to Right: 314 -> 380) -->
          <g v-if="state === 'charging'">
            <g
              v-for="i in 2"
              :key="'le-c-' + i"
              :transform="`translate(${314 + ((electronOffset + i * 30) % 66)}, 160)`"
            >
              <circle cx="0" cy="0" r="3" fill="#3b82f6" />
              <text
                x="0"
                y="-5"
                font-size="10"
                font-family="Georgia, 'Times New Roman', serif"
                font-style="italic"
                fill="#60a5fa"
                text-anchor="middle"
              >
                e
              </text>
            </g>
          </g>
          <!-- Discharging: electrons move AWAY from lower plate (Right to Left: 380 -> 314) -->
          <g v-if="state === 'discharging'">
            <g
              v-for="i in 2"
              :key="'le-d-' + i"
              :transform="`translate(${380 - ((electronOffset + i * 30) % 66)}, 160)`"
            >
              <circle cx="0" cy="0" r="3" fill="#ef4444" />
              <text
                x="0"
                y="-5"
                font-size="10"
                font-family="Georgia, 'Times New Roman', serif"
                font-style="italic"
                fill="#f87171"
                text-anchor="middle"
              >
                e
              </text>
            </g>
          </g>

          <!-- OSCILLOSCOPE I-t GRAPH PANEL (REPLACES DIAGNOSTIC PANEL) -->
          <g id="i-t-chart-panel">
            <!-- Grid container -->
            <rect
              x="440"
              y="25"
              width="260"
              height="160"
              rx="4"
              fill="#020617"
              stroke="#334155"
              stroke-width="1.2"
            />

            <!-- Grid lines -->
            <!-- I=0 midline -->
            <line x1="440" y1="105" x2="700" y2="105" stroke="#334155" stroke-dasharray="2,2" />
            <!-- Upper 0.25A grid line -->
            <line x1="440" y1="65" x2="700" y2="65" stroke="#1e293b" stroke-dasharray="1,2" />
            <!-- Lower -0.25A grid line -->
            <line x1="440" y1="145" x2="700" y2="145" stroke="#1e293b" stroke-dasharray="1,2" />

            <!-- Axis Labels -->
            <text
              x="428"
              y="40"
              font-size="11"
              font-family="Georgia, 'Times New Roman', serif"
              font-style="italic"
              fill="#ef4444"
              font-weight="bold"
              text-anchor="end"
            >
              I
            </text>
            <text
              x="428"
              y="170"
              font-size="11"
              font-family="Georgia, 'Times New Roman', serif"
              font-style="italic"
              fill="#3b82f6"
              font-weight="bold"
              text-anchor="end"
            >
              I
            </text>
            <text
              x="705"
              y="109"
              font-size="11"
              font-family="Georgia, 'Times New Roman', serif"
              font-style="italic"
              fill="#64748b"
              font-weight="bold"
              text-anchor="end"
            >
              t
            </text>
            <text
              x="570"
              y="17"
              font-size="10"
              font-family="sans-serif"
              fill="#94a3b8"
              text-anchor="middle"
              font-weight="bold"
            >
              <tspan font-family="Georgia, 'Times New Roman', serif" font-style="italic">I</tspan> — <tspan font-family="Georgia, 'Times New Roman', serif" font-style="italic">t</tspan> 暂态电流
            </text>

            <!-- Dynamic trace path -->
            <path
              :d="graphPath"
              stroke="#10b981"
              stroke-width="2"
              fill="none"
              stroke-linecap="round"
            />

            <!-- Real-time blinking plot dot at the current tip -->
            <circle
              v-if="state !== 'idle' && currentPoints.length > 0"
              :cx="currentPoints[currentPoints.length - 1].x"
              :cy="currentPoints[currentPoints.length - 1].y"
              r="2.5"
              fill="#34d399"
              style="opacity: 0.8"
            />
          </g>
        </svg>

        <!-- 极性图例（SVG下方，不被图表遮挡） -->
        <div class="flex items-center justify-center gap-6 mt-3 mb-1">
          <span class="inline-flex items-center gap-2 text-sm font-medium opacity-85"
            ><span class="inline-block w-3.5 h-3.5 rounded-sm" style="background: #ef4444"></span>
            正电（红）</span
          >
          <span class="inline-flex items-center gap-2 text-sm font-medium opacity-85"
            ><span class="inline-block w-3.5 h-3.5 rounded-sm" style="background: #3b82f6"></span>
            负电（蓝）</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.circuit-wrap {
  width: 100%;

  margin: 0 auto;
}
.circuit-svg {
  width: 100%;
  height: auto;
  display: block;
}
.clickable {
  cursor: pointer;
}
</style>
