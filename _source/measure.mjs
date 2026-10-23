// Снимает геометрию и оформление всех видимых текстов и картинок
// прямо с живой страницы. Ширина 1200 — масштаб Тильды равен единице,
// значит числа сразу в координатах макета.
import puppeteer from 'puppeteer-core'
import { writeFile } from 'node:fs/promises'

const [url, out, w = '1200'] = process.argv.slice(2)
const browser = await puppeteer.launch({
  executablePath: '/usr/bin/chromium', headless: 'new',
  args: ['--no-sandbox', '--disable-gpu', '--hide-scrollbars'],
})
const page = await browser.newPage()
await page.setViewport({ width: Number(w), height: 1000 })
await page.goto(url, { waitUntil: 'networkidle2', timeout: 120000 })
await page.evaluate(async () => {
  for (let y = 0; y < document.body.scrollHeight; y += 600) {
    window.scrollTo(0, y); await new Promise(r => setTimeout(r, 70))
  }
  window.scrollTo(0, 0); await new Promise(r => setTimeout(r, 500))
})

const data = await page.evaluate(() => {
  const vis = el => {
    const cs = getComputedStyle(el)
    return cs.display !== 'none' && cs.visibility !== 'hidden' && cs.opacity !== '0'
  }
  // собственный текст узла, без текста вложенных блоков
  const ownText = el => {
    let t = ''
    for (const n of el.childNodes) {
      if (n.nodeType === 3) t += n.textContent
      else if (n.nodeType === 1 && /^(BR)$/.test(n.tagName)) t += ' / '
      else if (n.nodeType === 1 && /^(SPAN|B|STRONG|EM|I|A|U)$/.test(n.tagName)) t += n.textContent
    }
    return t.replace(/\s+/g, ' ').trim()
  }
  const blocks = []
  for (const rec of document.querySelectorAll('[id^="rec"]')) {
    const rb = rec.getBoundingClientRect()
    if (rb.height < 40 || !vis(rec)) continue
    const items = []
    for (const el of rec.querySelectorAll('*')) {
      if (/^(STYLE|SCRIPT|BR)$/.test(el.tagName)) continue
      if (!vis(el)) continue
      const r = el.getBoundingClientRect()
      if (r.width < 3 || r.height < 3) continue
      const isImg = el.tagName === 'IMG'
      const t = isImg ? '' : ownText(el)
      const cs = getComputedStyle(el)
      // Берём не только тексты и картинки, но и заметные прямоугольники:
      // карточки, плашки и рамки — у них своего текста нет.
      const hasBg = cs.backgroundColor && !/rgba\(0, 0, 0, 0\)|transparent/.test(cs.backgroundColor)
      const hasBd = cs.borderTopWidth !== '0px' || cs.borderLeftWidth !== '0px'
      const isBox = (hasBg || hasBd) && r.width >= 24 && r.height >= 12
      if (!t && !isImg && !isBox) continue
      items.push({
        x: Math.round(r.left - rb.left), y: Math.round(r.top - rb.top),
        w: Math.round(r.width), h: Math.round(r.height),
        fs: Math.round(parseFloat(cs.fontSize) || 0), fw: cs.fontWeight,
        lh: cs.lineHeight, ls: cs.letterSpacing === 'normal' ? '' : cs.letterSpacing,
        color: cs.color, bg: cs.backgroundColor,
        border: cs.borderTopWidth === '0px' ? '' : `${cs.borderTopWidth} ${cs.borderTopColor}`,
        radius: cs.borderRadius === '0px' ? '' : cs.borderRadius,
        align: cs.textAlign, tag: el.tagName.toLowerCase(),
        text: t.slice(0, 110),
        box: (!t && !isImg) ? 1 : 0,
        img: isImg ? (el.currentSrc || el.src || '').split('/').pop() : '',
      })
    }
    // убираем обёртки: если у родителя тот же текст и близкая рамка
    const keep = items.filter((a, i) =>
      a.box || !items.some((b, j) => j !== i && b.text === a.text && b.text && !b.box &&
        b.w <= a.w && b.h <= a.h && (b.w < a.w || b.h < a.h)))
    blocks.push({
      id: rec.id, h: Math.round(rb.height),
      bg: getComputedStyle(rec.querySelector('.t396__artboard') || rec).backgroundColor,
      items: keep,
    })
  }
  return blocks
})
await writeFile(out, JSON.stringify(data, null, 1), 'utf8')
console.log(`блоков ${data.length}, элементов ${data.reduce((s, b) => s + b.items.length, 0)} → ${out}`)
await browser.close()
