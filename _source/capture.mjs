// Снимает каждую секцию страницы отдельным кадром.
// Нужен эталон по блокам: одним высоким кадром страницу не снять —
// первый экран задан в единицах высоты окна и растягивается на всю высоту.
import puppeteer from 'puppeteer-core'
import { mkdir } from 'node:fs/promises'

const [url, outDir, selector = '[id^="rec"]', width = '1600'] = process.argv.slice(2)
await mkdir(outDir, { recursive: true })

const browser = await puppeteer.launch({
  executablePath: '/usr/bin/chromium',
  headless: 'new',
  args: ['--no-sandbox', '--disable-gpu', '--hide-scrollbars'],
})
const page = await browser.newPage()
await page.setViewport({ width: Number(width), height: 1000 })
await page.goto(url, { waitUntil: 'networkidle2', timeout: 120000 })

// Прокручиваем до конца и обратно: без этого отложенные картинки не грузятся
await page.evaluate(async () => {
  const step = 600
  for (let y = 0; y < document.body.scrollHeight; y += step) {
    window.scrollTo(0, y)
    await new Promise(r => setTimeout(r, 90))
  }
  window.scrollTo(0, 0)
  await new Promise(r => setTimeout(r, 600))
})
// Прячем баннер cookie — он перекрывает нижние блоки
await page.evaluate(() => {
  for (const el of document.querySelectorAll('div,aside,section')) {
    const t = (el.textContent || '').slice(0, 60)
    if (/cookies/i.test(t) && el.getBoundingClientRect().height < 220) el.style.display = 'none'
  }
})

const items = await page.$$eval(selector, els =>
  els.map((el, i) => {
    const r = el.getBoundingClientRect()
    return {
      i,
      id: el.id || `n${i}`,
      top: r.top + window.scrollY,
      h: Math.round(r.height),
      text: (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 48),
    }
  }).filter(x => x.h > 40),
)

console.log(`секций: ${items.length}`)
for (const it of items) {
  const el = (await page.$$(selector))[it.i]
  if (!el) continue
  try {
    await el.screenshot({ path: `${outDir}/${String(it.i).padStart(2, '0')}-${it.id}.png` })
    console.log(`  ${String(it.i).padStart(2, '0')}-${it.id}  h=${it.h}  ${it.text}`)
  } catch (e) {
    console.log(`  ${it.id} — пропуск (${e.message.slice(0, 50)})`)
  }
}

await browser.close()
