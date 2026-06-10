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
defaults:
  layout: default
  transition: fade
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

<div class="card card-highlight mt-4">
  <div class="text-2xl font-semibold">我们如何把电荷<span class="text-accent">存</span>起来？</div>
</div>

<v-click>

<div class="mt-5">

## 我们已经学过三种起电方式

<div class="grid grid-cols-3 gap-4 mt-6">
  <div class="card">
    <div class="font-semibold text-xl">摩擦起电</div>
    <div class="text-sm opacity-60 mt-1">通过摩擦使电子转移</div>
  </div>
  <div class="card">
    <div class="font-semibold text-xl">接触起电</div>
    <div class="text-sm opacity-60 mt-1">带电体接触使电荷转移</div>
  </div>
  <div class="card">
    <div class="font-semibold text-xl">感应起电</div>
    <div class="text-sm opacity-60 mt-1">电场作用下电荷重新分布</div>
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

<div class="tag-icon mb-4"><mdi-lightbulb-on-outline /> 电容器：储存电荷的容器</div>

<v-clicks>

<div class="card card-highlight">
  <div class="text-2xl font-semibold">
    定义：<span class="text-accent">相互靠近</span>且<span class="text-accent">彼此绝缘</span>的两个导体，构成电容器
  </div>
</div>

<div class="grid grid-cols-2 gap-3 mt-3">
  <div class="card">
    <div class="font-semibold text-lg">相互靠近</div>
    <div class="text-sm opacity-50 mt-1">电荷相互吸引，不会流失</div>
  </div>
  <div class="card">
    <div class="font-semibold text-lg">彼此绝缘</div>
    <div class="text-sm opacity-50 mt-1">没有导电通路，电荷无法逃逸</div>
  </div>
</div>

</v-clicks>

---
layout: default
---

# 哪些东西可以看成电容器？

<div class="grid grid-cols-2 gap-3 mt-6">

<v-clicks>

<div class="card">
  <div class="flex items-center gap-2 mb-1"><mdi-earth class="text-accent-2 text-xl" /><span class="font-semibold text-lg">地球 与 火星</span></div>
  <div class="text-sm opacity-50">真空绝缘，彼此靠近</div>
</div>

<div class="card">
  <div class="flex items-center gap-2 mb-1"><mdi-account class="text-accent-2 text-xl" /><span class="font-semibold text-lg">人 与 金属板</span></div>
  <div class="text-sm opacity-50">不接触即构成电容器</div>
</div>

<div class="card">
  <div class="flex items-center gap-2 mb-1"><mdi-weather-lightning class="text-accent-2 text-xl" /><span class="font-semibold text-lg">云层 与 大地</span></div>
  <div class="text-sm opacity-50">云层带电，大地感应</div>
</div>

<div class="card">
  <div class="flex items-center gap-2 mb-1"><mdi-all-inclusive class="text-accent-2 text-xl" /><span class="font-semibold text-lg">任意两个导体</span></div>
  <div class="text-sm opacity-50">靠近 + 绝缘 = 电容器</div>
</div>

</v-clicks>

</div>

---
layout: default
---

# 常见电容器

<div class="grid grid-cols-3 gap-3 mt-4">

<div class="card text-center">
  <img src="/images/陶瓷.png" alt="陶瓷电容器" class="placeholder-img" />
  <div class="font-semibold text-lg mt-2">陶瓷电容器</div>
  <div class="text-sm opacity-50 mt-1">固定电容 · 电路板常用</div>
</div>

<div class="card text-center">
  <img src="/images/电解.png" alt="电解电容器" class="placeholder-img" />
  <div class="font-semibold text-lg mt-2">电解电容器</div>
  <div class="text-sm opacity-50 mt-1">固定电容 · 大容量 · 有极性</div>
</div>

<div class="card text-center">
  <img src="/images/可变.png" alt="可变电容器" class="placeholder-img" />
  <div class="font-semibold text-lg mt-2">可变电容器</div>
  <div class="text-sm opacity-50 mt-1">旋转调节 · 改变正对面积</div>
</div>

</div>

---
layout: default
---

# 充电与放电 · 交互演示

<CapacitorCircuit />

---
layout: default
---

# 充放电过程

<div class="grid grid-cols-2 gap-4 mt-4">

<div class="card">
  <div class="flex items-center gap-2 mb-3"><mdi-battery-charging class="text-accent-2 text-xl" /><span class="font-semibold text-lg">充电</span></div>
  <v-clicks>

  <div class="mb-2 text-sm">与正极相连的极板<span class="text-red-400">失去电子 → 带正电</span></div>
  <div class="mb-2 text-sm">与负极相连的极板<span class="text-accent-2">获得电子 → 带负电</span></div>
  <div class="mb-2 text-sm">两极板间<span class="text-accent">电势差逐渐升高</span>，直至等于电源电压</div>
  <div class="text-sm opacity-60 mt-2">充电完成，电源的能量 → 储存在电容器中</div>

  </v-clicks>
</div>

<div class="card">
  <div class="flex items-center gap-2 mb-3"><mdi-lightbulb-on-outline class="text-accent text-xl" /><span class="font-semibold text-lg">放电</span></div>
  <v-clicks>

  <div class="mb-2 text-sm">用导线连接两极板</div>
  <div class="mb-2 text-sm">电子从<span class="text-accent-2">负极板</span>经导线流向<span class="text-red-400">正极板</span></div>
  <div class="mb-2 text-sm">两极板电荷逐渐中和，<span class="text-accent">电势差降低</span></div>
  <div class="text-sm opacity-60 mt-2">电容器储存的能量 → 释放到电路中</div>

  </v-clicks>
</div>

</div>

<v-click>

<div class="card card-highlight mt-4 text-center">
  <span class="text-accent font-semibold">电荷守恒</span>：充电不是创造电荷，放电不是消灭电荷——只是<span class="text-accent-2">转移</span>
</div>

</v-click>

---
layout: default
---

# 为什么能保持电荷？

<div class="card card-highlight">
  <div class="text-xl font-semibold">
    如果将充好电的电容器的<span class="text-red-400">负极接地</span>，电荷会流失吗？
  </div>
</div>

<v-clicks>

<div class="card mt-3">
  <div class="font-semibold text-lg mb-1">不会。因为——</div>
  <div class="text-sm opacity-70">负极板上的负电荷与正极板上的正电荷<span class="text-accent">相互吸引</span>，正极板上的电荷被"拉住"，几乎不会流入大地。</div>
</div>

<div class="card mt-3">
  <div class="font-semibold text-lg mb-1">进一步——</div>
  <div class="text-sm opacity-70">即使把导线、电阻接在正极和负极两端，只要<span class="text-accent-2">不构成闭合回路</span>，两极板之间的相互吸引力仍然会让大部分电荷保留下来。</div>
</div>

<div class="card card-highlight mt-3">
  <div class="text-center text-lg">
    <span class="text-accent">相互靠近</span> + <span class="text-accent">彼此绝缘</span> → 电容器能够储存电荷
  </div>
</div>

</v-clicks>

---
layout: default
---

# 电容器的带电量

<div class="card card-highlight">
  <div class="text-xl font-semibold">
    充放电是电荷在两极板之间<span class="text-accent">转移</span>——那么，电容器的带电量如何计算？
  </div>
</div>

<v-click>

<div class="card card-highlight mt-3 text-center">

当一个极板带电量为 $+Q$ 时，另一个极板必然带电 $-Q$

<div class="text-lg">

电容器的带电量 = <span class="text-accent-2 font-bold">一个极板带电的绝对值</span> $Q$

</div>

</div>

</v-click>

---
layout: default
---

# 充电与放电中的能量转化

<div class="grid grid-cols-2 gap-3 mt-4">

<div class="card">
  <div class="text-xl font-semibold mb-3 text-center">充电</div>
  <v-clicks>

  <div class="mb-1">两极板间<span class="text-accent">电势差逐渐增大</span></div>
  <div class="mb-1">电势差 → 电源电压</div>
  <div class="card-highlight rounded-lg p-2 mt-2 text-center">
    <span class="text-accent-2 font-semibold">电能</span> → 储存于电容器
  </div>

  </v-clicks>
</div>

<div class="card">
  <div class="text-xl font-semibold mb-3 text-center">放电</div>
  <v-clicks>

  <div class="mb-1">两极板间<span class="text-red-400">电势差逐渐减小</span></div>
  <div class="mb-1">电流通过用电器</div>
  <div class="card-highlight rounded-lg p-2 mt-2 text-center">
    储存能量 → <span class="text-accent font-semibold">其他形式</span>能量
  </div>

  </v-clicks>
</div>

</div>

<v-click>

<div class="card card-highlight mt-4 text-center font-semibold text-lg">
  电容器，不仅可以储存<span class="text-accent">电荷</span>，还同时存储了<span class="text-accent-2">能量</span>
</div>

</v-click>

---
layout: default
---

<div class="text-center mt-10 text-3xl font-semibold leading-relaxed">

不同电容器的储存本领<br/>是否一样？如何量化？

</div>

---
layout: default
---

<ChargeSharingCircuit />

---
layout: default
---

# 实验结论

<v-clicks>

<div class="card card-highlight">

电容器所带电荷量 $Q$ 与两极板间电势差 $U$ 的关系：

</div>

<div class="card mt-3">

同一个电容器，$Q$ 与 $U$ 的比值是一个<span class="text-accent">定值</span>

</div>

<div class="card mt-3">

不同电容器，这个比值<span class="text-accent-2">不同</span>——反映了电容器储存电荷的本领

</div>

</v-clicks>

---
layout: default
---

# 水桶类比

<div class="grid grid-cols-2 gap-4 mt-4">

<div class="card text-center">

<div class="text-5xl mb-3">🪣</div>
<div class="font-semibold text-lg mb-2">水桶装水</div>

<v-clicks>

<div class="text-sm opacity-70">水位高度 $h$ ← 水龙头高度</div>
<div class="text-sm opacity-70">水的体积 $V$ ← 水桶容量</div>
<div class="card-highlight rounded-lg p-2 mt-2">
  <span class="text-accent">横截面积</span> $S = V/h$
</div>
<div class="text-sm opacity-50 mt-1">反映装水本领</div>

</v-clicks>

</div>

<div class="card text-center">

<div class="text-5xl mb-3">⚡</div>
<div class="font-semibold text-lg mb-2">电容器充电</div>

<v-clicks>

<div class="text-sm opacity-70">电势差 $U$ ← 电源电压</div>
<div class="text-sm opacity-70">电荷量 $Q$ ← 电容器容量</div>
<div class="card-highlight rounded-lg p-2 mt-2">
  <span class="text-accent-2">电容</span> $C = Q/U$
</div>
<div class="text-sm opacity-50 mt-1">反映储存电荷的本领</div>

</v-clicks>

</div>

</div>

---
layout: default
---

# 电容

<div class="card card-highlight">

## 定义

<div class="text-2xl font-semibold mt-2">

$$C = \frac{Q}{U}$$

</div>

<div class="mt-3 text-lg opacity-70">
电容器所带电荷量 $Q$ 与两极板间电势差 $U$ 的比值
</div>

</div>

<v-click>

<div class="card mt-3">

## 单位：法拉（F）

<div class="text-xl mt-2">$1\,\text{F} = 1\,\text{C/V}$</div>

<div class="grid grid-cols-2 gap-3 mt-3">
  <div class="text-sm">$1\,\mu\text{F} = 10^{-6}\,\text{F}$ <span class="opacity-50">微法</span></div>
  <div class="text-sm">$1\,\text{pF} = 10^{-12}\,\text{F}$ <span class="opacity-50">皮法</span></div>
</div>

<div class="text-sm opacity-50 mt-2">1 F 是非常大的单位，常见电容器都是 μF 或 pF 级别</div>

</div>

</v-click>

---
layout: default
---

# 工作电压与击穿

<v-clicks>

<div class="card card-highlight">

电容器上标的电压是什么？

<div class="mt-2 text-lg opacity-70">——<span class="text-accent">额定工作电压</span></div>

</div>

<div class="card mt-3">

<div class="font-semibold text-lg mb-1">回顾：云层与大地</div>
<div class="text-sm opacity-70">电势差过大 → 空气<span class="text-red-400">击穿</span> → 闪电放电</div>

</div>

<div class="card mt-3">

<div class="font-semibold text-lg mb-1">对电容器的启示</div>
<div class="text-sm opacity-70">两极板间电压超过介质承受能力 → 介质<span class="text-red-400">击穿</span> → 电容器损坏</div>
<div class="text-sm opacity-50 mt-1">额定工作电压 < 击穿电压，留有安全裕度</div>

</div>

</v-clicks>

---
layout: default
---

# 平行板电容器的电容

<div class="card card-highlight">

平行板电容器的电容由<span class="text-accent">结构参数</span>决定：

</div>

<v-clicks>

<div class="card mt-3">

$$C = \frac{\varepsilon_r S}{4\pi k d}$$

<div class="grid grid-cols-3 gap-3 mt-3 text-sm opacity-70">
  <div>$S$ — 极板正对面积</div>
  <div>$d$ — 极板间距</div>
  <div>$\varepsilon_r$ — 介质相对介电常数</div>
</div>

</div>

<div class="card mt-3">
  <div class="text-sm opacity-70">$S \uparrow$ 电容 ↑ &nbsp;&nbsp;|&nbsp;&nbsp; $d \uparrow$ 电容 ↓ &nbsp;&nbsp;|&nbsp;&nbsp; $\varepsilon_r \uparrow$ 电容 ↑</div>
</div>

</v-clicks>

---
layout: center
class: text-center
---

# 课堂小结

<div class="grid grid-cols-2 gap-4 mt-6 text-left">

<div class="card">
  <div class="font-semibold text-lg mb-2">电容器</div>
  <div class="text-sm opacity-70">相互靠近 + 彼此绝缘的导体</div>
  <div class="text-sm opacity-70 mt-1">充电：电能→储存 | 放电：储存→释放</div>
</div>

<div class="card">
  <div class="font-semibold text-lg mb-2">电容 $C = Q/U$</div>
  <div class="text-sm opacity-70">反映储存电荷的本领</div>
  <div class="text-sm opacity-70 mt-1">单位：法拉 F，常用 μF、pF</div>
</div>

<div class="card">
  <div class="font-semibold text-lg mb-2">工作电压</div>
  <div class="text-sm opacity-70">电压过高 → 介质击穿 → 损坏</div>
</div>

<div class="card">
  <div class="font-semibold text-lg mb-2">平行板电容器</div>
  <div class="text-sm opacity-70">$C = \varepsilon_r S / (4\pi k d)$</div>
  <div class="text-sm opacity-70 mt-1">$S \uparrow C \uparrow$，$d \uparrow C \downarrow$</div>
</div>

</div>
