import puppeteer from 'puppeteer-core'
const b = await puppeteer.launch({ executablePath:'/usr/bin/chromium', headless:'new', args:['--no-sandbox','--disable-gpu','--hide-scrollbars'] })
const p = await b.newPage()
await p.setViewport({ width:1920, height:1000 })
await p.goto(process.argv[2] || 'https://xn--80acbef4bubwkv.xn--p1ai/',{waitUntil:'networkidle2',timeout:120000})
if (process.env.SCROLL) {
  await p.evaluate(async () => { for (let y=0;y<document.body.scrollHeight;y+=400){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,60))} })
  await new Promise(r=>setTimeout(r,1200))
}
const rows = await p.evaluate(() => [...document.querySelectorAll('[data-animate-style]')].map(el => {
  const rec = el.closest('[id^=rec]')
  return { rec: rec ? rec.id : '?', cls: el.className.replace(/\s+/g,' ').slice(0,40),
    style: el.getAttribute('data-animate-style'), chain: el.getAttribute('data-animate-chain'),
    group: el.getAttribute('data-animate-group'), order: el.getAttribute('data-animate-order'),
    delay: el.style.transitionDelay || '0s', text: (el.textContent||'').replace(/\s+/g,' ').trim().slice(0,30) }
}))
for (const r of rows) console.log(`${r.rec}  ${String(r.style).padEnd(12)} chain=${r.chain||'-'} group=${r.group||'-'} order=${r.order||'-'} delay=${r.delay}  ${r.text}`)
await b.close()
