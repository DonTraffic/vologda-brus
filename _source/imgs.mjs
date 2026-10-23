import puppeteer from 'puppeteer-core'
const [url] = process.argv.slice(2)
const browser = await puppeteer.launch({ executablePath: '/usr/bin/chromium', headless: 'new',
  args: ['--no-sandbox','--disable-gpu','--hide-scrollbars'] })
const page = await browser.newPage()
await page.setViewport({ width: 1200, height: 1000 })
await page.goto(url, { waitUntil: 'networkidle2', timeout: 120000 })
await page.evaluate(async () => {
  for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise(r=>setTimeout(r,80)) }
})
const out = await page.evaluate(() => {
  const seen = new Set()
  for (const el of document.querySelectorAll('*')) {
    if (el.tagName === 'IMG' && el.currentSrc) seen.add('IMG  ' + el.currentSrc)
    const bg = getComputedStyle(el).backgroundImage
    if (bg && bg !== 'none') for (const m of bg.matchAll(/url\("?([^")]+)"?\)/g)) seen.add('BG   ' + m[1])
  }
  return [...seen]
})
console.log(out.join('\n'))
await browser.close()
