import puppeteer from 'puppeteer-core'
const b = await puppeteer.launch({ executablePath:'/usr/bin/chromium', headless:'new', args:['--no-sandbox','--disable-gpu','--hide-scrollbars'] })
const p = await b.newPage()
await p.setViewport({ width:1920, height:1000 })
await p.goto('https://xn--80acbef4bubwkv.xn--p1ai/',{waitUntil:'networkidle2',timeout:120000})
const r = await p.evaluate(() => [...document.querySelectorAll('[data-animate-style=zoomin]')].slice(0,3).map(el => {
  const cs = getComputedStyle(el)
  return { style: el.getAttribute('data-animate-style'), opacity: cs.opacity, transform: cs.transform, dur: cs.transitionDuration, tf: cs.transitionTimingFunction }
}))
console.log(JSON.stringify(r, null, 1))
await b.close()
