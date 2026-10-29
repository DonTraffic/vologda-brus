type RevealStyle = 'fade' | 'right' | 'left' | 'zoom'
type RevealValue = RevealStyle | { style?: RevealStyle; delay?: number } | undefined

export default defineNuxtPlugin((nuxtApp) => {
  let observer: IntersectionObserver | null = null

  const watcher = () => {
    if (!observer) {
      observer = new IntersectionObserver((entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          e.target.classList.add('is-revealed')
          observer!.unobserve(e.target)
        }
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0 })
    }
    return observer
  }

  nuxtApp.vueApp.directive('reveal', {
    mounted(el: HTMLElement, binding: { value: RevealValue }) {
      if (!import.meta.client || !('IntersectionObserver' in window)) return
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      const v = binding.value
      const style: RevealStyle = (typeof v === 'string' ? v : v?.style) ?? 'fade'
      const delay = (typeof v === 'object' ? v?.delay : 0) ?? 0

      if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return

      el.classList.add('reveal', `reveal--${style}`)
      if (delay) el.style.transitionDelay = `${delay}s`
      watcher().observe(el)
    },

    unmounted(el: HTMLElement) {
      observer?.unobserve(el)
    },
  })
})
