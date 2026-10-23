import puppeteer from 'puppeteer-core'
const b = await puppeteer.launch({ executablePath:'/usr/bin/chromium', headless:'new',
  args:['--no-sandbox','--hide-scrollbars','--use-gl=swiftshader','--enable-unsafe-swiftshader'] })
const p = await b.newPage()
p.on('pageerror', e => console.log('[err]', String(e).slice(0,200)))
p.on('console', m => { if (m.type()==='error') console.log('[console]', m.text().slice(0,200)) });p.on('requestfailed', r=>console.log('[netfail]', r.url().slice(0,120), r.failure()?.errorText));p.on('response', r=>{ if(r.status()>=400) console.log('[http]', r.status(), r.url().slice(0,120)) })
await p.setViewport({ width:1920, height:1000 })
await p.goto('http://127.0.0.1:8181/',{waitUntil:'networkidle2',timeout:120000})
await p.evaluate(async()=>{ window.scrollTo(0, document.body.scrollHeight); })
await new Promise(r=>setTimeout(r,6000))
console.log(await p.evaluate(()=>({
  webgl: !!document.createElement('canvas').getContext('webgl2'),
  canvas: !!document.querySelector('.cm__map canvas'),
  pin: !!document.querySelector('.cm__pin'),
  mapH: document.querySelector('.cm__map')?.getBoundingClientRect().height,
})))
await p.screenshot({ path: '_source/cmp/m-map-live.png' })
await b.close()
