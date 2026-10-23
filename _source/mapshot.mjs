import puppeteer from 'puppeteer-core'
const b = await puppeteer.launch({ executablePath:'/usr/bin/chromium', headless:'new',
  args:['--no-sandbox','--hide-scrollbars','--use-gl=swiftshader','--enable-unsafe-swiftshader'] })
const p = await b.newPage()
await p.setViewport({ width:1920, height:1000 })
await p.goto('http://127.0.0.1:8181/',{waitUntil:'networkidle2',timeout:120000})
await p.evaluate(()=>{ document.querySelector('.cm')?.scrollIntoView({block:'center'}) })
await new Promise(r=>setTimeout(r,7000))
const el = await p.$('.cm')
await el.screenshot({ path: '_source/cmp/m-map-full.png' })
await b.close()
