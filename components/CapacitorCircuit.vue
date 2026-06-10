<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue';

// State rules
// plateCharge goes from 0 (uncharged) to 1 (fully charged)
const plateCharge = ref<number>(0);
const current = ref<number>(0); 
const state = ref<'idle' | 'charging' | 'discharging'>('idle');
const electronOffset = ref<number>(0);

// We keep a history of points for the real-time I-t graph
const currentPoints = ref<{ x: number; y: number }[]>([]);

let intervalId: any = null;
let startChargeVal = 0;
let stepCounter = 0;

// Color interpolation function
function interpolateColor(color1: string, color2: string, factor: number) {
  const parseHex = (hex: string) => {
    const match = hex.replace('#', '');
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
  return interpolateColor('#475569', '#ef4444', plateCharge.value); // Positive (Red)
});

const lowerPlateColor = computed(() => {
  return interpolateColor('#475569', '#3b82f6', plateCharge.value); // Negative (Blue)
});

// Switch handle target coordinate
const switchTarget = computed(() => {
  if (state.value === 'charging') return { x: 220, y: 15 };
  if (state.value === 'discharging') return { x: 220, y: 65 };
  return { x: 220, y: 40 }; // hanging open
});

// Computed SVG path for the live I-t graph
const graphPath = computed(() => {
  if (currentPoints.value.length === 0) {
    // Return empty or zero line
    return 'M 440 65 L 700 65';
  }
  return currentPoints.value.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
});

// Actions
function startCharging() {
  if (state.value === 'charging') return;
  
  if (intervalId) clearInterval(intervalId);
  
  state.value = 'charging';
  currentPoints.value = []; // Reset chart
  stepCounter = 0;
  
  intervalId = setInterval(() => {
    electronOffset.value += 4;
    stepCounter++;
    
    // Step charge upward from current value
    plateCharge.value = Math.min(1, plateCharge.value + 0.025);
    
    // Smooth exponential decay: I = 0.5 * e^(-4 * progress)
    const progress = plateCharge.value;
    current.value = 0.5 * Math.exp(-4 * progress);
    
    // Record I-t graph point
    const x = 440 + (stepCounter / 40) * 260;
    const y = 65 - (current.value / 0.5) * 35;
    currentPoints.value.push({ x, y });
    
    if (plateCharge.value >= 1) {
      clearInterval(intervalId);
      current.value = 0;
      state.value = 'idle';
      // Fill the rest of the chart with zero
      while (stepCounter < 40) {
        stepCounter++;
        currentPoints.value.push({ x: 440 + (stepCounter / 40) * 260, y: 65 });
      }
    }
  }, 40);
}

function startDischarging() {
  if (state.value === 'discharging') return;
  if (plateCharge.value <= 0.05) return;
  
  if (intervalId) clearInterval(intervalId);
  
  state.value = 'discharging';
  currentPoints.value = []; // Reset chart
  startChargeVal = plateCharge.value;
  stepCounter = 0;
  
  intervalId = setInterval(() => {
    electronOffset.value += 4;
    stepCounter++;
    
    // Discharge stepping
    plateCharge.value = Math.max(0, plateCharge.value - 0.025);
    
    // Discharging current in opposite direction (negative)
    const progress = (startChargeVal - plateCharge.value) / startChargeVal;
    current.value = -0.5 * Math.exp(-4 * progress);
    
    // Record I-t graph point
    const x = 440 + (stepCounter / 40) * 260;
    const y = 65 - (current.value / 0.5) * 35;
    currentPoints.value.push({ x, y });
    
    if (plateCharge.value <= 0) {
      clearInterval(intervalId);
      current.value = 0;
      state.value = 'idle';
      // Fill the rest with zero
      while (stepCounter < 40) {
        stepCounter++;
        currentPoints.value.push({ x: 440 + (stepCounter / 40) * 260, y: 65 });
      }
    }
  }, 40);
}

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
});
</script>

<template>
  <div class="circuit-wrap">
    <div class="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl text-slate-100 flex flex-col items-center select-none">
      
      <!-- SVG Drawing -->
      <div id="capacitor-circuit-svg-container" class="w-full relative bg-slate-950/40 rounded-lg p-2 border border-slate-900 overflow-hidden">
        <svg viewBox="0 0 720 140" class="circuit-svg">
          
          <!-- LEFT VERTICAL WIRE SECTION WITH EMBEDDED VERTICAL BATTERY (AS PER REF PICTURE) -->
          <line x1="45" y1="15" x2="45" y2="58" stroke="#475569" stroke-width="2" />
          <line x1="45" y1="72" x2="45" y2="120" stroke="#475569" stroke-width="2" />
          
          <!-- VERTICAL BATTERY SYMBOL -->
          <!-- Long positive plate (thin blue line) -->
          <line x1="33" y1="58" x2="57" y2="58" stroke="#3b82f6" stroke-width="2.5" />
          <!-- Short negative plate (thick slate line) -->
          <line x1="39" y1="66" x2="51" y2="66" stroke="#475569" stroke-width="4.5" />

          <!-- UPPER WIRE BUS: y=15 -->
          <line x1="45" y1="15" x2="220" y2="15" stroke="#475569" stroke-width="2" />

          <!-- LOWER WIRE BUS: y=120 -->
          <line x1="45" y1="120" x2="286" y2="120" stroke="#475569" stroke-width="2" />
          <line x1="314" y1="120" x2="380" y2="120" stroke="#475569" stroke-width="2" />

          <!-- VERTICAL SHUNT WIRE (DISCHARGE BRANCH) -->
          <line x1="220" y1="65" x2="220" y2="120" stroke="#475569" stroke-width="2" />

          <!-- AMMETER (A) - ON THE BOTTOM WIRE -->
          <g id="ammeter">
            <circle cx="300" cy="120" r="14" fill="#1e293b" stroke="#475569" stroke-width="2" />
            <text x="300" y="124" font-size="11" font-family="sans-serif" font-weight="900" fill="#94a3b8" text-anchor="middle">A</text>
          </g>

          <!-- SPDT SWITCH TERMINALS -->
          <!-- Upper Terminal (Charge) -->
          <circle cx="220" cy="15" r="4" fill="#1e293b" stroke="#475569" stroke-width="1.5" />
          <!-- Lower Terminal (Discharge) -->
          <circle cx="220" cy="65" r="4" fill="#1e293b" stroke="#475569" stroke-width="1.5" />
          <!-- Knife Pivot Point -->
          <circle cx="280" cy="40" r="4" fill="#e2a846" stroke="#1e293b" stroke-width="1.5" />
          
          <!-- Switch Knife blade (Line) -->
          <line 
            x1="280" 
            y1="40" 
            :x2="switchTarget.x" 
            :y2="switchTarget.y" 
            stroke="#e2a846" 
            stroke-width="3" 
            stroke-linecap="round" 
            class="transition-all duration-300 ease-out" 
          />

          <!-- INTERACTIVE CONTROLLER BUTTONS FOR THE SWITCH -->
          <g id="btn-charge" class="clickable group" @click="startCharging">
            <rect x="155" y="8" width="45" height="20" rx="4" fill="#1e293b" stroke="#334155" stroke-width="1.2" class="group-hover:stroke-amber-400 group-hover:fill-slate-800 transition" />
            <text x="177" y="22" text-anchor="middle" font-size="11" font-family="sans-serif" font-weight="bold" :fill="state === 'charging' ? '#ef4444' : '#94a3b8'">充</text>
          </g>

          <g id="btn-discharge" class="clickable group" @click="startDischarging" :style="{ opacity: plateCharge > 0.05 ? 1 : 0.4 }">
            <rect x="155" y="65" width="45" height="20" rx="4" fill="#1e293b" stroke="#334155" stroke-width="1.2" class="group-hover:stroke-amber-400 group-hover:fill-slate-800 transition" />
            <text x="177" y="79" text-anchor="middle" font-size="11" font-family="sans-serif" font-weight="bold" :fill="state === 'discharging' ? '#38bdf8' : '#94a3b8'">放</text>
          </g>

          <!-- CAPACITOR PARALLEL PLATES WIRES -->
          <!-- Wire from switch pivot to upper plate -->
          <line x1="280" y1="40" x2="380" y2="40" stroke="#475569" stroke-width="2" />
          <line x1="380" y1="40" x2="380" y2="55" stroke="#475569" stroke-width="2" />
          
          <!-- Wire from lower plate to bottom wire -->
          <line x1="380" y1="80" x2="380" y2="120" stroke="#475569" stroke-width="2" />

          <!-- CAPACITOR PARALLEL PLATES (HORIZONTAL AS PER REF PICTURE) -->
          <g id="capacitor">
            <!-- Upper plate -->
            <line x1="340" y1="55" x2="420" y2="55" :stroke="upperPlateColor" stroke-width="4.5" stroke-linecap="round" />
            <!-- Lower plate -->
            <line x1="340" y1="80" x2="420" y2="80" :stroke="lowerPlateColor" stroke-width="4.5" stroke-linecap="round" />
            
            <!-- Label C -->
            <text x="330" y="71" font-size="11" font-family="sans-serif" font-weight="bold" fill="#94a3b8" text-anchor="middle">C</text>

            <!-- Charging indicator signs / static representation -->

            <!-- Color text legends as requested to indicate polarity colors -->
          </g>

          <!-- ANIMATED ELECTRON FLOW (e⁻) ALONG BOTH WIRES OF THE CAPACITOR -->
          <!-- Upper line horizontal segment (x: 280 to 380 at y=40) -->
          <!-- Charging: electrons move AWAY from upper plate (Right to Left: 380 -> 280) -->
          <g v-if="state === 'charging'">
            <g v-for="i in 3" :key="'ue-c-' + i" :transform="`translate(${380 - ((electronOffset + i * 35) % 100)}, 40)`">
              <circle cx="0" cy="0" r="3" fill="#3b82f6" class="shadow-sm" />
              <text x="0" y="-5" font-size="8" font-family="sans-serif" fill="#60a5fa" text-anchor="middle">e⁻</text>
            </g>
          </g>
          <!-- Discharging: electrons move TOWARDS upper plate (Left to Right: 280 -> 380) -->
          <g v-if="state === 'discharging'">
            <g v-for="i in 3" :key="'ue-d-' + i" :transform="`translate(${280 + ((electronOffset + i * 35) % 100)}, 40)`">
              <circle cx="0" cy="0" r="3" fill="#ef4444" />
              <text x="0" y="-5" font-size="8" font-family="sans-serif" fill="#f87171" text-anchor="middle">e⁻</text>
            </g>
          </g>

          <!-- Bottom line horizontal segment (x: 314 to 380 at y=120) -->
          <!-- Charging: electrons move TOWARDS lower plate (Left to Right: 314 -> 380) -->
          <g v-if="state === 'charging'">
            <g v-for="i in 2" :key="'le-c-' + i" :transform="`translate(${314 + ((electronOffset + i * 30) % 66)}, 120)`">
              <circle cx="0" cy="0" r="3" fill="#3b82f6" />
              <text x="0" y="-5" font-size="8" font-family="sans-serif" fill="#60a5fa" text-anchor="middle">e⁻</text>
            </g>
          </g>
          <!-- Discharging: electrons move AWAY from lower plate (Right to Left: 380 -> 314) -->
          <g v-if="state === 'discharging'">
            <g v-for="i in 2" :key="'le-d-' + i" :transform="`translate(${380 - ((electronOffset + i * 30) % 66)}, 120)`">
              <circle cx="0" cy="0" r="3" fill="#ef4444" />
              <text x="0" y="-5" font-size="8" font-family="sans-serif" fill="#f87171" text-anchor="middle">e⁻</text>
            </g>
          </g>

          <!-- OSCILLOSCOPE I-t GRAPH PANEL (REPLACES DIAGNOSTIC PANEL) -->
          <g id="i-t-chart-panel">
            <!-- Grid container -->
            <rect x="440" y="20" width="260" height="90" rx="4" fill="#020617" stroke="#334155" stroke-width="1.2" />
            
            <!-- Grid lines -->
            <!-- I=0 midline -->
            <line x1="440" y1="65" x2="700" y2="65" stroke="#334155" stroke-dasharray="2,2" />
            <!-- Upper 0.25A grid line -->
            <line x1="440" y1="42" x2="700" y2="42" stroke="#1e293b" stroke-dasharray="1,2" />
            <!-- Lower -0.25A grid line -->
            <line x1="440" y1="88" x2="700" y2="88" stroke="#1e293b" stroke-dasharray="1,2" />

            <!-- Axis Labels -->
            <text x="428" y="42" font-size="8" font-family="sans-serif" fill="#ef4444" font-weight="bold" text-anchor="end">I</text>
            <text x="428" y="88" font-size="8" font-family="sans-serif" fill="#3b82f6" font-weight="bold" text-anchor="end">I</text>
            <text x="700" y="61" font-size="8" font-family="sans-serif" fill="#64748b" text-anchor="end">t</text>
            <text x="560" y="18" font-size="9" font-family="sans-serif" fill="#94a3b8" text-anchor="middle" font-weight="bold">I — t</text>

            <!-- Dynamic trace path -->
            <path :d="graphPath" stroke="#10b981" stroke-width="2" fill="none" stroke-linecap="round" />
            
            <!-- Real-time blinking plot dot at the current tip -->
            <circle 
              v-if="state !== 'idle' && currentPoints.length > 0"
              :cx="currentPoints[currentPoints.length - 1].x"
              :cy="currentPoints[currentPoints.length - 1].y"
              r="2.5"
              fill="#34d399"
              style="opacity:0.8"
            />
          </g>

        </svg>

        <!-- 极性图例（SVG下方，不被图表遮挡） -->
        <div class="flex items-center justify-center gap-4 mt-2">
          <span class="inline-flex items-center gap-1 text-xs opacity-60"><span class="inline-block w-2.5 h-2.5 rounded-sm" style="background:#ef4444"></span> 正电（红）</span>
          <span class="inline-flex items-center gap-1 text-xs opacity-60"><span class="inline-block w-2.5 h-2.5 rounded-sm" style="background:#3b82f6"></span> 负电（蓝）</span>
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
