// Slidev 52 的 click handler (play.vue) 只响应点击在
// #slide-container 自身的事件，不响应子元素。
// 实际使用中文字和卡片会挡住 container，导致点击无反应。
// 这里补一个 document 级别的 pointerdown 监听。

export default () => {
  document.addEventListener('pointerdown', (e: PointerEvent) => {
    if (e.button !== 0) return

    const target = e.target as HTMLElement
    if (target.closest('button, a, input, textarea, select, [role="button"]')) return
    if (target.closest('.slidev-nav-controls')) return

    const nav = (window as any).__slidev__?.nav
    if (!nav) return

    if (e.clientX / window.innerWidth > 0.5)
      nav.next()
    else
      nav.prev()
  })
}
