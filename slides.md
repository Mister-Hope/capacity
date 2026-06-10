---
theme: default
title: 电容器的电容
titleTemplate: '%s'
highlighter: shiki
transition: fade
mdc: true
layout: cover
colorSchema: dark
fonts:
  sans: Nunito Sans
  mono: Fira Code
  provider: none
---

<h1 class="cover-title">电容器的电容</h1>

<div class="cover-subtitle">
  <span>授课教师：张伯望</span>
</div>

<div class="cover-decoration abs-br m-8" aria-hidden="true">
  <svg viewBox="0 0 200 140" width="240" xmlns="http://www.w3.org/2000/svg">
    <line x1="30" y1="60" x2="85" y2="60" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
    <rect x="85" y="8" width="10" height="104" rx="5" fill="none" stroke="currentColor" stroke-width="3"/>
    <rect x="105" y="8" width="10" height="104" rx="5" fill="none" stroke="currentColor" stroke-width="3"/>
    <line x1="115" y1="60" x2="170" y2="60" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
    <line x1="50" y1="20" x2="50" y2="100" stroke="currentColor" stroke-width="1.5" stroke-dasharray="6 4" opacity="0.35"/>
    <line x1="150" y1="20" x2="150" y2="100" stroke="currentColor" stroke-width="1.5" stroke-dasharray="6 4" opacity="0.35"/>
    <text x="100" y="134" text-anchor="middle" style="font-size:13px" fill="#94a3b8" opacity="0.7">平行板电容器</text>
  </svg>
</div>

---
layout: default
---

# 提出问题

<div class="card card-highlight mt-8">
  <div class="text-2xl font-semibold mb-4">我们如何把电荷<span class="text-accent">存</span>起来？</div>
</div>

<v-click>

<div class="mt-8">

## 我们已经学过三种起电方式

<div class="grid grid-cols-3 gap-4 mt-6">
  <div class="card">
    <div class="text-4xl mb-3">⚡</div>
    <div class="font-semibold">摩擦起电</div>
    <div class="text-sm opacity-60 mt-1">电子转移</div>
  </div>
  <div class="card">
    <div class="text-4xl mb-3">🤝</div>
    <div class="font-semibold">接触起电</div>
    <div class="text-sm opacity-60 mt-1">电荷传导</div>
  </div>
  <div class="card">
    <div class="text-4xl mb-3">🧲</div>
    <div class="font-semibold">感应起电</div>
    <div class="text-sm opacity-60 mt-1">静电感应</div>
  </div>
</div>

</div>

</v-click>

<v-click>

<div class="mt-6 text-center opacity-70">
但这些方法只能让物体<span class="text-accent">带电</span>——<br/>
<span class="font-semibold text-accent-2">如何把电荷储存起来？</span>
</div>

</v-click>

---
layout: default
---

# 电容器

<div class="card card-highlight mt-6">
  <div class="text-2xl font-semibold mb-2">定义</div>
  <div class="text-3xl leading-relaxed">
    <span class="text-accent">相互靠近</span>且<span class="text-accent">彼此绝缘</span>的两个导体<br/>构成电容器
  </div>
</div>

<v-click>

<div class="mt-8 text-lg opacity-70">两个条件：</div>

<div class="grid grid-cols-2 gap-4 mt-4">
  <div class="card">
    <div class="text-2xl mb-2">📍</div>
    <div class="font-semibold text-xl">相互靠近</div>
    <div class="text-sm opacity-50 mt-1">电荷才能相互吸引</div>
  </div>
  <div class="card">
    <div class="text-2xl mb-2">🧱</div>
    <div class="font-semibold text-xl">彼此绝缘</div>
    <div class="text-sm opacity-50 mt-1">电荷不会逃走</div>
  </div>
</div>

</v-click>

---
layout: default
---

# 哪些东西可以看成电容器？

<div class="grid grid-cols-2 gap-5 mt-6">

<v-clicks>

<div class="card">
  <div class="text-3xl mb-2">🌍 ↔ 🔴</div>
  <div class="font-semibold text-xl">地球 与 火星</div>
  <div class="text-sm opacity-50 mt-1">真空绝缘，彼此靠近</div>
</div>

<div class="card">
  <div class="text-3xl mb-2">🧑 ↔ 🪨</div>
  <div class="font-semibold text-xl">人 与 金属板</div>
  <div class="text-sm opacity-50 mt-1">不接触即构成电容器</div>
</div>

<div class="card">
  <div class="text-3xl mb-2">☁️ ↔ 🌏</div>
  <div class="font-semibold text-xl">云层 与 大地</div>
  <div class="text-sm opacity-50 mt-1">云层带电，大地感应</div>
</div>

<div class="card">
  <div class="text-3xl mb-2">💡</div>
  <div class="font-semibold text-xl">任意两个导体</div>
  <div class="text-sm opacity-50 mt-1">靠近 + 绝缘 = 电容器</div>
</div>

</v-clicks>

</div>

---
layout: default
---

# 常见电容器

<div class="text-sm opacity-40 mb-4">⚠️ 待补充实物照片</div>

<div class="grid grid-cols-3 gap-5 mt-6">

<div class="card text-center">
  <img src="/images/capacitor-bucket.svg" alt="桶状电容器" class="placeholder-img" />
  <div class="font-semibold text-xl mt-3">桶状电容器</div>
  <div class="text-sm opacity-50 mt-1">高压电力设备</div>
</div>

<div class="card text-center">
  <img src="/images/capacitor-ceramic.svg" alt="陶瓷电容器" class="placeholder-img" />
  <div class="font-semibold text-xl mt-3">陶瓷电容器</div>
  <div class="text-sm opacity-50 mt-1">电路板常用</div>
</div>

<div class="card text-center">
  <img src="/images/capacitor-electrolytic.svg" alt="铝电解电容器" class="placeholder-img" />
  <div class="font-semibold text-xl mt-3">铝电解电容器</div>
  <div class="text-sm opacity-50 mt-1">大容量滤波</div>
</div>

</div>

---
layout: default
---

# 充电过程

<div class="grid grid-cols-2 gap-8 mt-4">
<div>

## 实验装置

<div class="card mt-4">
  <div class="text-center text-5xl my-6">
    <span class="text-red-400">⊖ 电源 ⊕</span>
  </div>
  <div class="text-center text-sm opacity-50">
    开关闭合 → 电荷转移
  </div>
</div>

</div>
<div>

<v-clicks>

<div class="card mb-3">
  <div class="font-semibold">① 接电源</div>
  <div class="text-sm opacity-60">两平行金属板接入电源两端</div>
</div>

<div class="card mb-3">
  <div class="font-semibold">② 电子移动</div>
  <div class="text-sm opacity-60">负极附近极板<span class="text-accent-2">获得</span>电子</div>
  <div class="text-sm opacity-60">正极附近极板<span class="text-red-400">失去</span>电子</div>
</div>

<div class="card mb-3">
  <div class="font-semibold">③ 完成充电</div>
  <div class="text-sm opacity-60">一板带正电，一板带负电</div>
</div>

</v-clicks>

</div>
</div>

---
layout: default
---

# 放电过程

<div class="grid grid-cols-2 gap-8 mt-4">
<div>

## 实验装置

<div class="card mt-4">
  <div class="text-center text-5xl my-6">
    <span class="text-accent">⊖ 💡 ⊕</span>
  </div>
  <div class="text-center text-sm opacity-50">
    替换电源 → 接入小灯泡
  </div>
</div>

</div>
<div>

<v-clicks>

<div class="card mb-3">
  <div class="font-semibold">① 接入负载</div>
  <div class="text-sm opacity-60">用灯泡替代电源，闭合开关</div>
</div>

<div class="card mb-3">
  <div class="font-semibold">② 电子回流</div>
  <div class="text-sm opacity-60">电子从<span class="text-red-400">负极板</span>经灯泡 → <span class="text-accent-2">正极板</span></div>
</div>

<div class="card mb-3">
  <div class="font-semibold">③ 中和完毕</div>
  <div class="text-sm opacity-60">两板电荷完全中和，灯泡熄灭</div>
</div>

</v-clicks>

</div>
</div>

---
layout: default
---

# 为什么能保持电荷？

<div class="card card-highlight mt-6 mb-6">
  <div class="text-xl font-semibold mb-3">关键实验：负极接地</div>
  <div class="text-lg leading-relaxed opacity-80">
    充电后将<span class="text-red-400">负极接地</span>，正极板上的电荷<span class="text-accent">几乎不流失</span>
  </div>
</div>

<v-clicks>

<div class="card mb-3">
  <div class="font-semibold text-xl">🧲 静电引力</div>
  <div class="text-sm opacity-60 mt-1">负极板上的负电荷吸引正极板上的正电荷，正电荷不会流入大地</div>
</div>

<div class="card mb-3">
  <div class="font-semibold text-xl">🔗 开路状态</div>
  <div class="text-sm opacity-60 mt-1">即使外接导线和电阻，只要不构成闭合回路，电荷仍大部分保留</div>
</div>

<div class="card card-highlight mt-4">
  <div class="text-center text-xl">
    <span class="text-accent">相互靠近</span> + <span class="text-accent">彼此绝缘</span> → 有效储存电荷 ✓
  </div>
</div>

</v-clicks>

---
layout: default
---

# 电容器的带电量

<div class="card card-highlight mt-6">
  <div class="text-xl font-semibold mb-4">核心规律</div>
  <div class="text-2xl leading-relaxed">
    充电/放电本质是电荷的<span class="text-accent">转移</span><br/>
    不是创造，不是消灭 —— <span class="text-accent-2">电荷守恒</span>
  </div>
</div>

<v-click>

<div class="mt-8">
  <div class="text-lg opacity-70 mb-3">因此：</div>

  <div class="card card-highlight">
    <div class="text-center">
      <div class="text-lg opacity-70 mb-2">当一个极板带电量为 <span class="katex-inline">+Q</span> 时</div>
      <div class="text-2xl text-accent font-semibold">另一个极板必然带电 −Q</div>
      <div class="mt-4 text-xl">
        电容器的带电量 = <span class="text-accent-2 font-bold">一个极板带电的绝对值</span>
      </div>
      <div class="text-2xl mt-2 font-mono">Q</div>
    </div>
  </div>
</div>

</v-click>

---
layout: default
---

# 充电与放电中的能量转化

<div class="grid grid-cols-2 gap-8 mt-8">

<div class="card">
  <div class="text-2xl mb-4 text-center">⚡ 充电</div>
  <v-clicks>

  <div class="text-lg mb-2">电场强度<span class="text-accent">逐渐增大</span></div>
  <div class="text-lg mb-2">电势差 → 电源电压</div>
  <div class="card-highlight rounded-lg p-3 mt-3 text-center text-xl">
    <span class="text-accent-2">电能</span> → 储存于电容器
  </div>

  </v-clicks>
</div>

<div class="card">
  <div class="text-2xl mb-4 text-center">💡 放电</div>
  <v-clicks>

  <div class="text-lg mb-2">电场强度<span class="text-red-400">逐渐减小</span></div>
  <div class="text-lg mb-2">电流通过用电器</div>
  <div class="card-highlight rounded-lg p-3 mt-3 text-center text-xl">
    储存能量 → <span class="text-accent">其他形式</span>能量
  </div>

  </v-clicks>
</div>

</div>

<v-click>

<div class="card card-highlight mt-6 text-center text-xl">
  电容器是<span class="text-accent">电场储能</span>元件
</div>

</v-click>
