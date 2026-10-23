// Полный кадр страницы целиком. Прокручивает до конца — иначе отложенные
// картинки Тильды не грузятся, — прячет баннер cookie и снимает всю высоту.
import puppeteer from 'puppeteer-core'
import { mkdir } from 'node:fs/promises'
import { dirname } from 'node:path'

const [url, out, w = '1200'] = process.argv.slice(2)
await mkdir(dirname(out), { recursive: true })
const browser = await puppeteer.launch({
  executablePath: '/usr/bin/chromium', headless: 'new',
  args: ['--no-sandbox', '--disable-gpu', '--hide-scrollbars'],
})
const page = await browser.newPage()
await page.setViewport({ width: Number(w), height: 1000 })
await page.goto(url, { waitUntil: 'networkidle2', timeout: 120000 })
await page.evaluate(async () => {
  for (let y = 0; y < document.body.scrollHeight; y += 500) {
    window.scrollTo(0, y); await new Promise(r => setTimeout(r, 80))
  }
  window.scrollTo(0, 0); await new Promise(r => setTimeout(r, 700))
})
await page.evaluate(() => {
  for (const el of document.querySelectorAll('div,aside,section')) {
    const t = (el.textContent || '').slice(0, 80)
    if (/cookie/i.test(t) && el.getBoundingClientRect().height < 240) el.style.display = 'none'
  }
})
// Блоки с появлением по прокрутке на снимке должны быть видимыми:
// добираем всё, что наблюдатель не успел проявить при быстрой прокрутке.
await page.evaluate(() => {
  for (const el of document.querySelectorAll('.reveal')) el.classList.add('is-revealed')
})
await new Promise(r => setTimeout(r, 300))

// Снимок всей страницы перерисовывает её целиком, и отложенные картинки
// успевают не всегда. Переводим их в обычную загрузку и ждём декодирования.
await page.evaluate(async () => {
  const imgs = [...document.images]
  for (const i of imgs) i.loading = 'eager'
  await Promise.all(imgs.map(i => i.decode().catch(() => {})))
})
await new Promise(r => setTimeout(r, 400))
const h = await page.evaluate(() => document.body.scrollHeight)
await page.screenshot({ path: out, fullPage: true })
console.log(`${out}  ${w}×${h}`)
await browser.close()
