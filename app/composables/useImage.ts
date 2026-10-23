import manifestModule from '~/data/images.json'

export interface ImageMeta {
  widths: number[]
  w: number
  h: number
  ext: string
}

// JSON приходит как модуль с единственным ключом default, поэтому обращение
// к ключам напрямую даёт undefined. Разворачиваем оба варианта, чтобы код
// не зависел от того, как сборщик обработает импорт.
const images = ((manifestModule as { default?: Record<string, ImageMeta> }).default
  ?? manifestModule) as Record<string, ImageMeta>

/**
 * Собирает данные для <picture> по имени картинки.
 *
 * Каждая картинка заранее пережата в несколько ширин (640/1024/1600) в WebP
 * плюс JPEG для подстраховки. Манифест знает, какие ширины реально есть,
 * поэтому в srcset не попадают ссылки на несуществующие файлы — на текущем
 * сайте srcset отсутствует вовсе и на телефон уезжает десктопная картинка.
 */
export function useImage(name: string) {
  const meta = images[name]

  if (!meta) {
    // Молча подставить пустоту хуже, чем заметить опечатку в имени на сборке.
    if (import.meta.dev) console.warn(`[useImage] нет картинки «${name}» в манифесте`)
    return { src: '', srcset: '', widths: [] as number[], w: 0, h: 0, isSvg: false }
  }

  if (meta.ext === 'svg') {
    return { src: `/images/${name}.svg`, srcset: '', widths: [], w: meta.w, h: meta.h, isSvg: true }
  }

  const srcset = meta.widths.map(w => `/images/${name}-${w}.webp ${w}w`).join(', ')

  return {
    // JPEG нужного размера как запасной вариант для старых браузеров
    src: `/images/${name}.jpg`,
    srcset,
    widths: meta.widths,
    w: meta.w,
    h: meta.h,
    isSvg: false,
  }
}
