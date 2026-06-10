<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue';

// State definition
const qA = ref<number>(0); // Charge on Cap 1 (voltage range 0 to 8 V)
const qB = ref<number>(0); // Charge on Cap 2
const s1Pos = ref<'open' | '1' | '2'>('open'); // Switch 1 position
const s2Closed = ref<boolean>(false); // Switch 2 closed/open status

const simState = ref<'idle' | 'charging_A' | 'sharing' | 'discharging_B' | 'discharging_A_and_B'>('idle');
const electronOffset = ref<number>(0);

let timerId: any = null;

// Color helper function
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

// Compute colors based on voltages (charge size, where 8.0 is max)
const aUpperColor = computed(() => interpolateColor('#475569', '#ef4444', Math.min(1, qA.value / 8.0)));
const aLowerColor = computed(() => interpolateColor('#475569', '#3b82f6', Math.min(1, qA.value / 8.0)));
const bUpperColor = computed(() => interpolateColor('#475569', '#ef4444', Math.min(1, qB.value / 8.0)));
const bLowerColor = computed(() => interpolateColor('#475569', '#3b82f6', Math.min(1, qB.value / 8.0)));

// Switch 1 Target - Mathematically exact rotation of length L = 72
const s1Target = computed(() => {
  if (s1Pos.value === '1') return { x: 252.3, y: 45.5 };     // Length = 72 at 160.1 degrees
  if (s1Pos.value === '2') return { x: 252.3, y: 94.5 };     // Length = 72 at 199.9 degrees
  return { x: 248.0, y: 70.0 };                              // Length = 72 at 180 degrees
});

// Switch 2 Target - Mathematically exact rotation of length L = 81
const s2Target = computed(() => {
  return s2Closed.value 
    ? { x: 240, y: 99 }      // Closed: straight pointing up to Terminal 2 (240, 99)
    : { x: 199.5, y: 110 };  // Open: 30 degrees to the left (199.5, 110)
});

// Simple and literal status texts requested by user
const s1StatusText = computed(() => {
  if (s1Pos.value === '1') return '接通电源';
  if (s1Pos.value === '2') return '连接另一电容器';
  return '断开';
});

const s2StatusText = computed(() => {
  return s2Closed.value ? '接通' : '断开';
});

// Trigger simulation logic when switches are operated
function toggleS1(pos: 'open' | '1' | '2') {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
  s1Pos.value = pos;
  runPhysicsStep();
}

function toggleS2() {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
  s2Closed.value = !s2Closed.value;
  runPhysicsStep();
}

function runPhysicsStep() {
  // Case 1: S1 to 1 (Charge A up to battery 8.0 V)
  if (s1Pos.value === '1') {
    simState.value = 'charging_A';
    const startA = qA.value;
    const steps = 15;
    let step = 0;
    
    timerId = setInterval(() => {
      step++;
      electronOffset.value += 5;
      qA.value = startA + (8.0 - startA) * (step / steps);
      
      if (step >= steps) {
        clearInterval(timerId);
        timerId = null;
        qA.value = 8.0;
        simState.value = 'idle';
      }
    }, 25);
  }
  
  // Case 2: S1 to 2 (Parallel / Sharing)
  else if (s1Pos.value === '2') {
    // Subcase 2a: S2 is closed -> any connected charge immediately shorts to ground!
    if (s2Closed.value) {
      simState.value = qA.value > 0 || qB.value > 0 ? 'discharging_A_and_B' : 'idle';
      const startA = qA.value;
      const startB = qB.value;
      const steps = 15;
      let step = 0;
      
      timerId = setInterval(() => {
        step++;
        electronOffset.value += 6;
        qA.value = startA * (1 - step / steps);
        qB.value = startB * (1 - step / steps);
        
        if (step >= steps) {
          clearInterval(timerId);
          timerId = null;
          qA.value = 0;
          qB.value = 0;
          simState.value = 'idle';
        }
      }, 25);
    } 
    // Subcase 2b: S2 is open -> dynamic charge sharing between A and B!
    else {
      const avgExchange = (qA.value + qB.value) / 2;
      const diff = Math.abs(qA.value - qB.value);
      if (diff < 0.02) {
        simState.value = 'idle';
        return;
      }
      
      simState.value = 'sharing';
      const startA = qA.value;
      const startB = qB.value;
      const steps = 15;
      let step = 0;
      
      timerId = setInterval(() => {
        step++;
        electronOffset.value += 5;
        qA.value = startA + (avgExchange - startA) * (step / steps);
        qB.value = startB + (avgExchange - startB) * (step / steps);
        
        if (step >= steps) {
          clearInterval(timerId);
          timerId = null;
          qA.value = avgExchange;
          qB.value = avgExchange;
          simState.value = 'idle';
        }
      }, 25);
    }
  }
  
  // Case 3: S1 is open (separated)
  else if (s1Pos.value === 'open') {
    // If S2 is closed, B discharges immediately
    if (s2Closed.value && qB.value > 0) {
      simState.value = 'discharging_B';
      const startB = qB.value;
      const steps = 10;
      let step = 0;
      
      timerId = setInterval(() => {
        step++;
        electronOffset.value += 8;
        qB.value = startB * (1 - step / steps);
        
        if (step >= steps) {
          clearInterval(timerId);
          timerId = null;
          qB.value = 0;
          simState.value = 'idle';
        }
      }, 25);
    } else {
      simState.value = 'idle';
    }
  }
}

function performReset() {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
  qA.value = 0;
  qB.value = 0;
  s1Pos.value = 'open';
  s2Closed.value = false;
  simState.value = 'idle';
}

onUnmounted(() => {
  if (timerId) clearInterval(timerId);
});
</script>

<template>
  <div class="circuit-container">
    <div class="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl text-slate-100 flex flex-col gap-6 select-none">
      
      <!-- Upper Simulation Graphic & Voltmeter Display Row -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        <!-- SVG Interactive Breadboard Graphic (Col span 8) -->
        <div class="lg:col-span-8 bg-slate-950/60 rounded-xl p-5 border border-slate-950 overflow-hidden relative flex flex-col justify-center">
          
          <!-- Main SVG Drawing with precise constant-length switches and visual guide arcs -->
          <svg viewBox="0 0 580 240" class="sharing-circuit-svg w-full h-auto">
            
            <!-- BOTTOM COMMON RETURN RAIL (GROUND/NEGATIVE) -->
            <line x1="60" y1="180" x2="500" y2="180" stroke="#475569" stroke-width="2.5" />
            
            <!-- BATTERY E (Positive left vertical bus) -->
            <line x1="60" y1="40" x2="60" y2="98" stroke="#475569" stroke-width="2.5" />
            <line x1="60" y1="122" x2="60" y2="180" stroke="#475569" stroke-width="2.5" />
            
            <!-- BATTERY SYMBOL -->
            <line x1="46" y1="98" x2="74" y2="98" stroke="#ef4444" stroke-width="2.5" />
            <line x1="52" y1="106" x2="68" y2="106" stroke="#475569" stroke-width="4" />
            <line x1="46" y1="114" x2="74" y2="114" stroke="#ef4444" stroke-width="2.5" />
            <line x1="52" y1="122" x2="68" y2="122" stroke="#475569" stroke-width="4" />
            
            <!-- Battery Label -->
            <text x="30" y="115" class="svg-text-bold" fill="#ef4444" font-size="11" font-weight="950" text-anchor="middle">E = 8V</text>

            <!-- WIRE PATHS -->
            <line x1="60" y1="40" x2="240" y2="40" stroke="#475569" stroke-width="2.5" />

            <!-- Cap 2 top plate supply wire directly connecting to Terminal 2 -->
            <line x1="150" y1="110" x2="150" y2="99" stroke="#475569" stroke-width="2.5" />
            <line x1="150" y1="99" x2="240" y2="99" stroke="#475569" stroke-width="2.5" />

            <!-- S1 Curved Guide Arc of radius 85 to visually align terminal selectors -->
            <path d="M 240 41 A 85 85 0 0 0 240 99" fill="none" stroke="#334155" stroke-dasharray="3,3" stroke-width="2" />

            <!-- SWITCH S1 DYNAMIC INTERACTIVE GATES ON SVG -->
            <!-- Terminal 1 Contact (Charge) - Positioned at 160 degrees relative to Pivot (320, 70) -->
            <g class="cursor-pointer group" @click="toggleS1('1')">
              <!-- Enlarged click hotspot -->
              <circle cx="240" cy="41" r="16" fill="transparent" />
              <circle cx="240" cy="41" r="10" fill="#1e293b" :stroke="s1Pos === '1' ? '#ef4444' : '#475569'" stroke-width="2.5" />
              <text x="240" y="45" class="svg-text-number" fill="#ef4444" text-anchor="middle">1</text>
            </g>
            
            <!-- Terminal 0 Contact (Neutral) - Positioned at 180 degrees (235, 70) -->
            <g class="cursor-pointer group" @click="toggleS1('open')">
              <!-- Enlarged click hotspot -->
              <circle cx="235" cy="70" r="16" fill="transparent" />
              <circle cx="235" cy="70" r="10" fill="#1e293b" :stroke="s1Pos === 'open' ? '#e2a846' : '#475569'" stroke-width="2.5" />
              <text x="235" y="74" class="svg-text-number" fill="#e2a846" text-anchor="middle">0</text>
            </g>

            <!-- Terminal 2 Contact (Share) - Positioned at 200 degrees (240, 99) -->
            <g class="cursor-pointer group" @click="toggleS1('2')">
              <!-- Enlarged click hotspot -->
              <circle cx="240" cy="99" r="16" fill="transparent" />
              <circle cx="240" cy="99" r="10" fill="#1e293b" :stroke="s1Pos === '2' ? '#a78bfa' : '#475569'" stroke-width="2.5" />
              <text x="240" y="103" class="svg-text-number" fill="#a78bfa" text-anchor="middle">2</text>
            </g>

            <!-- Active Pivot Joint base of S1 -->
            <circle cx="320" cy="70" r="7" fill="#e2a846" stroke="#101827" stroke-width="2" />
            <text x="320" y="52" class="svg-text-bold" fill="#e2a846" font-size="11" text-anchor="middle">S₁</text>

            <!-- Swing arm line representation for switch 1 (Rigidly rotation without deformation, length 72) -->
            <line 
              x1="320" 
              y1="70" 
              :x2="s1Target.x" 
              :y2="s1Target.y" 
              stroke="#e2a846" 
              stroke-width="4.5" 
              stroke-linecap="round" 
              class="transition-all duration-300 ease-in-out cursor-pointer"
              @click="toggleS1(s1Pos === 'open' ? '1' : s1Pos === '1' ? '2' : 'open')"
            />

            <!-- SWITCH S2 DYNAMIC INTERACTIVE (CLICK DIRECTLY TO TOGGLE) -->
            <!-- Merged directly to terminal 2 as requested, eliminating floating connections -->
            <g class="cursor-pointer class-s2-hotspot" @click="toggleS2()">
              <!-- Curved indicator arc for S2 movement guide -->
              <path d="M 240 99 A 81 81 0 0 0 199.5 110" fill="none" stroke="#334155" stroke-dasharray="2,2" stroke-width="1.5" />

              <!-- Bottom ground hinge point -->
              <circle cx="240" cy="180" r="6" fill="#64748b" stroke="#101827" stroke-width="1.5" />
              
              <!-- Switch blade (Constrained length = 81 pixels without deforming, directly touching Terminal 2 when closed) -->
              <line 
                x1="240" 
                y1="180" 
                :x2="s2Target.x" 
                :y2="s2Target.y" 
                stroke="#e2a846" 
                stroke-width="3.5" 
                stroke-linecap="round" 
                class="transition-all duration-200 ease-out" 
              />
              <text x="214" y="146" class="svg-text-bold" fill="#e2a846" font-size="11" text-anchor="middle">S₂</text>

              <!-- Large invisible hover / active clicking hotspot overlay -->
              <circle cx="220" cy="140" r="28" fill="transparent" />
            </g>

            <!-- CAPACITOR 2 SYSTEM -->
            <g id="cap-b-group">
              <!-- Upper Plate -->
              <line x1="120" y1="110" x2="180" y2="110" :stroke="bUpperColor" stroke-width="6" stroke-linecap="round" class="transition-colors duration-300" />
              <!-- Lower Plate -->
              <line x1="120" y1="130" x2="180" y2="130" :stroke="bLowerColor" stroke-width="6" stroke-linecap="round" class="transition-colors duration-300" />
              <!-- Ground connect wire -->
              <line x1="150" y1="130" x2="150" y2="180" stroke="#475569" stroke-width="2.5" />
              
              <text x="150" y="152" class="svg-text-bold font-bold" fill="#60a5fa" font-size="10" text-anchor="middle">电容器 2</text>

              <!-- Dynamic Pluses and Minuses based on Cap 2 charge status -->
              <g v-if="qB > 0.1">
                <text x="130" y="102" class="svg-text-sign font-bold" fill="#ef4444" text-anchor="middle" :fill-opacity="qB/8.0">+</text>
                <text x="150" y="102" class="svg-text-sign font-bold" fill="#ef4444" text-anchor="middle" :fill-opacity="qB/8.0">+</text>
                <text x="170" y="102" class="svg-text-sign font-bold" fill="#ef4444" text-anchor="middle" :fill-opacity="qB/8.0">+</text>
                
                <text x="130" y="142" class="svg-text-sign font-bold" fill="#3b82f6" text-anchor="middle" :fill-opacity="qB/8.0">-</text>
                <text x="150" y="142" class="svg-text-sign font-bold" fill="#3b82f6" text-anchor="middle" :fill-opacity="qB/8.0">-</text>
                <text x="170" y="142" class="svg-text-sign font-bold" fill="#3b82f6" text-anchor="middle" :fill-opacity="qB/8.0">-</text>
              </g>
            </g>

            <!-- WIRE SYSTEM FROM S1 PIVOT TO CAPACITOR 1 -->
            <line x1="320" y1="70" x2="420" y2="70" stroke="#475569" stroke-width="2.5" />
            <line x1="420" y1="70" x2="420" y2="110" stroke="#475569" stroke-width="2.5" />

            <!-- CAPACITOR 1 SYSTEM -->
            <g id="cap-a-group">
              <!-- Upper Plate -->
              <line x1="390" y1="110" x2="450" y2="110" :stroke="aUpperColor" stroke-width="6" stroke-linecap="round" class="transition-colors duration-300" />
              <!-- Lower Plate -->
              <line x1="390" y1="130" x2="450" y2="130" :stroke="aLowerColor" stroke-width="6" stroke-linecap="round" class="transition-colors duration-300" />
              <!-- Ground wire -->
              <line x1="420" y1="130" x2="420" y2="180" stroke="#475569" stroke-width="2.5" />
              
              <text x="420" y="152" class="svg-text-bold font-bold" fill="#34d399" font-size="10" text-anchor="middle">电容器 1</text>

              <!-- Dynamic Charge indicator signs for Cap 1 -->
              <g v-if="qA > 0.1">
                <text x="400" y="102" class="svg-text-sign font-bold" fill="#ef4444" text-anchor="middle" :fill-opacity="qA/8.0">+</text>
                <text x="420" y="102" class="svg-text-sign font-bold" fill="#ef4444" text-anchor="middle" :fill-opacity="qA/8.0">+</text>
                <text x="440" y="102" class="svg-text-sign font-bold" fill="#ef4444" text-anchor="middle" :fill-opacity="qA/8.0">+</text>
                
                <text x="400" y="142" class="svg-text-sign font-bold" fill="#3b82f6" text-anchor="middle" :fill-opacity="qA/8.0">-</text>
                <text x="420" y="142" class="svg-text-sign font-bold" fill="#3b82f6" text-anchor="middle" :fill-opacity="qA/8.0">-</text>
                <text x="440" y="142" class="svg-text-sign font-bold" fill="#3b82f6" text-anchor="middle" :fill-opacity="qA/8.0">-</text>
              </g>
            </g>

            <!-- VOLTMETER SYSTEM IN PARALLEL WITH CAP 1 -->
            <line x1="420" y1="70" x2="500" y2="70" stroke="#475569" stroke-width="2.5" />
            <line x1="500" y1="70" x2="500" y2="95" stroke="#475569" stroke-width="2.5" />
            <line x1="500" y1="145" x2="500" y2="180" stroke="#475569" stroke-width="2.5" />

            <!-- Voltmeter round gauge -->
            <g id="voltmeter-circle" class="cursor-pointer" @click="performReset">
              <circle cx="500" cy="120" r="24" fill="#1e293b" stroke="#34d399" stroke-width="3" />
              <text x="500" y="127" class="svg-text-gauge font-black text-xl" fill="#34d399" text-anchor="middle">V</text>
            </g>

            <!-- ANIMATED ELECTRON (e⁻) PHYSICS TRAJECTORIES ON SVG -->
            <g v-if="simState === 'charging_A'">
              <g v-for="i in 3" :key="'chg-a-' + i" :transform="`translate(${60 + ((electronOffset + i * 40) % 180)}, 40)`">
                <circle cx="0" cy="0" r="4.5" fill="#38bdf8" />
                <text x="0" y="-8" class="svg-electron-text font-black text-[12px]" fill="#60a5fa" text-anchor="middle">e⁻</text>
              </g>
            </g>

            <g v-if="simState === 'sharing'">
              <g v-for="i in 2" :key="'share-e-' + i" :transform="`translate(${240 + ((electronOffset + i * 35) % 80)}, 100)`">
                <circle cx="0" cy="0" r="4.5" fill="#a78bfa" />
                <text x="0" y="-8" class="svg-electron-text font-black text-[12px]" fill="#c084fc" text-anchor="middle">e⁻</text>
              </g>
            </g>

            <g v-if="simState === 'discharging_B'">
              <g v-for="i in 2" :key="'dis-b-' + i" :transform="`translate(240, ${99 + ((electronOffset + i * 25) % 81)})`">
                <circle cx="0" cy="0" r="4.5" fill="#f87171" />
                <text x="12" y="3" class="svg-electron-text font-black text-[12px]" fill="#f87171" text-anchor="start">e⁻</text>
              </g>
            </g>

          </svg>

        </div>

        <!-- High Legibility Voltmeter Reading Panel on the right (Col span 4) -->
        <div class="lg:col-span-4 flex flex-col justify-center gap-4">
          
          <div class="bg-slate-950 p-4 rounded-2xl border-2 border-emerald-500/40 flex flex-col items-center justify-center shadow-inner h-full">
            <span class="text-xs font-black uppercase tracking-wider text-emerald-400 mb-4 font-sans text-center">
              电压表读数
            </span>
            <div class="text-2xl font-mono font-bold text-emerald-300 font-digital select-none transition-all duration-150">
              {{ qA.toFixed(2) }}<span class="text-lg text-emerald-500 ml-1 font-sans font-bold">V</span>
            </div>
            
            <!-- Real-time Level Progress -->
            <div class="w-full bg-slate-900 h-4 rounded-full mt-2 overflow-hidden border border-slate-800">
              <div class="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-300" :style="{ width: `${(qA / 8.0) * 100}%` }"></div>
            </div>
          </div>

        </div>

      </div>

      <!-- Minimal PPT Status Deck with ONLY reset button and state lines -->
      <div class="bg-slate-950 p-5 rounded-xl border border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-6">
        
        <!-- State Indicators side -->
        <div class="flex flex-col sm:flex-row sm:items-center gap-6 text-xs font-bold w-full sm:w-auto">
          <div class="flex items-center gap-2">
            <span class="text-slate-400 font-black">s1:</span>
            <span :class="s1Pos === '1' ? 'text-rose-400' : s1Pos === '2' ? 'text-purple-400' : 'text-amber-400'" class="font-extrabold uppercase">
              {{ s1StatusText }}
            </span>
          </div>

          <div class="flex items-center gap-2">
            <span class="text-slate-400 font-black">s2:</span>
            <span :class="s2Closed ? 'text-emerald-400' : 'text-slate-400'" class="font-extrabold uppercase">
              {{ s2StatusText }}
            </span>
          </div>
        </div>

        <!-- Single Action Control - Reset button only -->
        <div class="flex items-center justify-end w-full sm:w-auto shrink-0">
          <button 
            @click="performReset" 
            class="px-5 py-2 bg-gradient-to-r from-red-800 to-rose-700 hover:from-red-700 hover:to-rose-600 font-black text-white text-sm rounded-xl transition-all shadow-md focus:outline-none w-full sm:w-auto"
          >
            重置实验
          </button>
        </div>

      </div>

    </div>
  </div>
</template>

<style scoped>
.circuit-container {
  width: 100%;
  margin: 0 auto;
}

.sharing-circuit-svg {
  display: block;
}

/* Hardened typography locking for crisp slides display */
.sharing-circuit-svg text {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif !important;
  user-select: none !important;
  pointer-events: none !important;
  line-height: normal !important;
  letter-spacing: normal !important;
  font-weight: bold;
}

.svg-text-bold {
  fill: #94a3b8 !important;
}

.svg-text-number {
  font-size: 13px !important;
  font-weight: 950 !important;
}

.svg-text-gauge {
  font-weight: 950 !important;
}

.svg-text-sign {
  font-size: 14px !important;
  font-weight: 950 !important;
}

.svg-electron-text {
  font-weight: bold;
}

/* high contrast glowing digital font styling */
.font-digital {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace !important;
  text-shadow: 0 0 18px rgba(16, 185, 129, 0.45);
}

.class-s2-hotspot:hover line {
  stroke: #fbbf24 !important;
}
</style>
