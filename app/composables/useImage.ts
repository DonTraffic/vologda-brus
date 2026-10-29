import manifestModule from '~/data/images.json'

export interface ImageMeta {
  widths: number[]
  w: number
  h: number
  ext: string
}

const images = ((manifestModule as { default?: Record<string, ImageMeta> }).default
  ?? manifestModule) as Record<string, ImageMeta>

export function useImage(name: string) {
  const meta = images[name]

  if (!meta) {

    if (import.meta.dev) console.warn(`[useImage] нет картинки «${name}» в манифесте`)
    return { src: '', srcset: '', widths: [] as number[], w: 0, h: 0, isSvg: false }
  }

  if (meta.ext === 'svg') {
    return { src: `/images/${name}.svg`, srcset: '', widths: [], w: meta.w, h: meta.h, isSvg: true }
  }

  const srcset = meta.widths.map(w => `/images/${name}-${w}.webp ${w}w`).join(', ')

  return {

    src: `/images/${name}.jpg`,
    srcset,
    widths: meta.widths,
    w: meta.w,
    h: meta.h,
    isSvg: false,
  }
}
