import puppeteer from 'puppeteer-core'
const b = await puppeteer.launch({ executablePath:'/usr/bin/chromium', headless:'new', args:['--no-sandbox','--disable-gpu','--hide-scrollbars'] })
const p = await b.newPage()
p.on('requestfailed', r => { if (/images/.test(r.url())) console.log('FAIL', r.url(), r.failure()?.errorText) })
p.on('response', r => { if (/post-0/.test(r.url())) console.log('RESP', r.status(), r.url()) })
await p.setViewport({ width:1200, height:1000 })
await p.goto('http://127.0.0.1:8181/',{waitUntil:'networkidle2',timeout:120000})
await p.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=400){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,150))}})
await new Promise(r=>setTimeout(r,2000))
const info = await p.evaluate(()=>[...document.querySelectorAll('.bl__thumb img')].map(i=>({
  src:i.getAttribute('src'), loading:i.loading, complete:i.complete, nw:i.naturalWidth,
  cs:i.currentSrc, rect:i.getBoundingClientRect().top, srcset:(i.previousElementSibling?.getAttribute('srcset')||'').slice(0,60)})))
console.log(JSON.stringify(info,null,1))
await b.close()
