<template>
  <div class="global-top">
    <span class="global-top-title">电容器的电容</span>
    <img src="/logo.png" alt="东北育才学校" class="global-top-logo" />
  </div>
</template>

<style scoped>
.global-top {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 3.5rem;
  z-index: 100;
  pointer-events: none;
}

.global-top-title {
  font-size: 0.75rem;
  font-weight: 600;
  color: rgba(241, 245, 249, 0.5);
  letter-spacing: 0.06em;
}

.global-top-logo {
  height: 2rem;
  width: auto;
  opacity: 0.8;
}
</style>
