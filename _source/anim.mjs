import puppeteer from 'puppeteer-core'
const b = await puppeteer.launch({ executablePath:'/usr/bin/chromium', headless:'new', args:['--no-sandbox','--disable-gpu','--hide-scrollbars'] })
const p = await b.newPage()
await p.setViewport({ width:1920, height:1000 })
await p.goto('https://xn--80acbef4bubwkv.xn--p1ai/',{waitUntil:'networkidle2',timeout:120000})
// элементы ещё не в зоне видимости — состояние «до»
const before = await p.evaluate(() => [...document.querySelectorAll('.t-animate')].slice(0,6).map(el => {
  const cs = getComputedStyle(el)
  return { cls: el.className.slice(0,46), style: el.getAttribute('data-animate-style'),
    opacity: cs.opacity, transform: cs.transform, transition: cs.transitionProperty + ' / ' + cs.transitionDuration + ' / ' + cs.transitionTimingFunction + ' / ' + cs.transitionDelay }
}))
console.log('--- ДО появления ---')
for (const o of before) console.log(JSON.stringify(o))
await p.evaluate(async () => { for (let y=0;y<document.body.scrollHeight;y+=400){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,60))} })
await new Promise(r=>setTimeout(r,1500))
const after = await p.evaluate(() => [...document.querySelectorAll('.t-animate')].slice(0,6).map(el => {
  const cs = getComputedStyle(el)
  return { cls: el.className.slice(0,46), opacity: cs.opacity, transform: cs.transform }
}))
console.log('--- ПОСЛЕ ---')
for (const o of after) console.log(JSON.stringify(o))
await b.close()
