/**
 * Горизонтальная лента: перелистывание кнопками, перетаскивание мышью
 * и автопрокрутка.
 *
 * Пальцем лента и так листается — браузер сам прокручивает по касанию.
 * Мышью этого не происходит, поэтому тянем за указатель вручную, а чтобы
 * клик по карточке не срабатывал после перетаскивания, в конце жеста
 * гасим ближайшее событие click.
 */
export interface CarouselOptions {
  /** Пауза между шагами автопрокрутки, мс. 0 — автопрокрутки нет. */
  interval?: number
  /** Промежуток между карточками, чтобы шаг совпадал с шириной карточки. */
  gap?: number
}

export function useCarousel(options: CarouselOptions = {}) {
  const { interval = 4000, gap = 40 } = options

  const el = ref<HTMLElement | null>(null)
  let timer: ReturnType<typeof setInterval> | null = null
  let paused = false

  const step = () => {
    const node = el.value
    if (!node) return 400
    const card = node.firstElementChild as HTMLElement | null
    return card ? card.offsetWidth + gap : Math.round(node.clientWidth * 0.8)
  }

  function scrollByCards(dir: number) {
    el.value?.scrollBy({ left: dir * step(), behavior: 'smooth' })
  }

  // --- перетаскивание мышью ---------------------------------------------
  let dragging = false
  let moved = false
  let startX = 0
  let startScroll = 0

  function onPointerDown(e: PointerEvent) {
    if (e.pointerType === 'touch' || e.button !== 0) return
    const node = el.value
    if (!node) return
    dragging = true
    moved = false
    startX = e.clientX
    startScroll = node.scrollLeft
    node.style.scrollBehavior = 'auto'
  }

  function onPointerMove(e: PointerEvent) {
    const node = el.value
    if (!dragging || !node) return
    const dx = e.clientX - startX
    if (!moved && Math.abs(dx) <= 4) return

    // Захват указателя ставим только когда жест действительно начался.
    // Если сделать это сразу на pointerdown, все последующие события —
    // включая click — уходят ленте, и кнопки внутри карточек перестают
    // нажиматься: простой клик до них просто не доходит.
    if (!moved) {
      moved = true
      node.setPointerCapture(e.pointerId)
      node.style.cursor = 'grabbing'
    }
    node.scrollLeft = startScroll - dx
  }

  function endDrag(e: PointerEvent) {
    const node = el.value
    if (!dragging || !node) return
    dragging = false
    if (moved && node.hasPointerCapture?.(e.pointerId)) node.releasePointerCapture(e.pointerId)
    node.style.cursor = ''
    node.style.scrollBehavior = ''
    if (moved) {
      // Жест закончился перетаскиванием — клик по карточке не нужен
      const swallow = (ev: MouseEvent) => { ev.preventDefault(); ev.stopPropagation() }
      node.addEventListener('click', swallow, { capture: true, once: true })
      setTimeout(() => node.removeEventListener('click', swallow, { capture: true } as never), 0)
    }
  }

  // --- колесо мыши -------------------------------------------------------
  // Над лентой вертикальное колесо листает её вбок. Пока лента не упёрлась
  // в край, прокрутку забираем себе; на краю отдаём странице, иначе
  // страница «залипает» на блоке.
  function onWheel(e: WheelEvent) {
    const node = el.value
    if (!node) return
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return

    const max = node.scrollWidth - node.clientWidth
    if (max <= 0) return
    if (e.deltaY < 0 && node.scrollLeft <= 0) return
    if (e.deltaY > 0 && node.scrollLeft >= max - 1) return

    e.preventDefault()
    node.scrollLeft = Math.max(0, Math.min(max, node.scrollLeft + e.deltaY))
  }

  // --- автопрокрутка -----------------------------------------------------
  function tick() {
    const node = el.value
    if (!node || paused || dragging) return
    if (document.hidden) return
    const atEnd = node.scrollLeft + node.clientWidth >= node.scrollWidth - 2
    node.scrollBy({ left: atEnd ? -node.scrollLeft : step(), behavior: 'smooth' })
  }

  const pause = () => { paused = true }
  const resume = () => { paused = false }

  onMounted(() => {
    const node = el.value
    if (!node) return
    node.style.cursor = 'grab'
    node.addEventListener('wheel', onWheel, { passive: false })
    node.addEventListener('pointerdown', onPointerDown)
    node.addEventListener('pointermove', onPointerMove)
    node.addEventListener('pointerup', endDrag)
    node.addEventListener('pointercancel', endDrag)
    node.addEventListener('mouseenter', pause)
    node.addEventListener('mouseleave', resume)
    node.addEventListener('focusin', pause)

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (interval > 0 && !reduce) timer = setInterval(tick, interval)
  })

  onBeforeUnmount(() => {
    const node = el.value
    if (timer) clearInterval(timer)
    if (!node) return
    node.removeEventListener('wheel', onWheel)
    node.removeEventListener('pointerdown', onPointerDown)
    node.removeEventListener('pointermove', onPointerMove)
    node.removeEventListener('pointerup', endDrag)
    node.removeEventListener('pointercancel', endDrag)
    node.removeEventListener('mouseenter', pause)
    node.removeEventListener('mouseleave', resume)
    node.removeEventListener('focusin', pause)
  })

  return { el, scrollByCards, pause, resume }
}
