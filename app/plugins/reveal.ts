/**
 * Появление блоков при прокрутке — как на действующем сайте.
 *
 * Тильда делает это скриптом tilda-animation: элемент ждёт своей очереди
 * с нулевой прозрачностью и сдвигом, а когда попадает в окно — съезжает на
 * место за 0,5 с кривой cubic-bezier(.19,1,.22,1). Параметры сняты оттуда:
 *   right — приезжает слева, translateX(-100px), 0,5 с
 *   left  — приезжает справа, translateX(100px),  0,5 с
 *   zoom  — scale(0.9),                           0,5 с
 *   fade  — только прозрачность,                  1 с
 *
 * Отличие от Тильды в одном: прятать содержимое умеет только браузер с
 * работающим скриптом. В разметку прячущий класс не попадает, поэтому при
 * выключенном JS страница просто показывает всё сразу, а не остаётся пустой.
 *
 * Плагин универсальный, а не только браузерный: на сборке директиву всё равно
 * нужно объявить, иначе шаблон со v-reveal не отрисуется на сервере.
 */
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

      // Что уже на виду, не прячем: иначе первый экран моргнёт при загрузке
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
