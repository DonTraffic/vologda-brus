import puppeteer from 'puppeteer-core'
const b = await puppeteer.launch({ executablePath:'/usr/bin/chromium', headless:'new', args:['--no-sandbox','--disable-gpu','--hide-scrollbars'] })
const p = await b.newPage()
await p.setViewport({ width:1454, height:900 })
await p.goto('http://127.0.0.1:8181/',{waitUntil:'networkidle2',timeout:120000})
await p.evaluate(()=>{ const r=document.querySelector('.pr__track').getBoundingClientRect(); window.scrollTo({top: window.scrollY + r.top - 150, behavior:'instant'}) })
await new Promise(r=>setTimeout(r,700))
const pt = await p.evaluate(()=>{ const r=document.querySelector('.pr__track').getBoundingClientRect(); return {x:Math.round(r.left+r.width*0.5), y:Math.round(r.top+r.height*0.35)} })
await p.mouse.move(pt.x, pt.y)
const pageBefore = await p.evaluate(()=>window.scrollY)
for (let i=0;i<5;i++) { await p.mouse.wheel({ deltaY: 120 }); await new Promise(r=>setTimeout(r,60)) }
console.log('колесо вниз ×5 → лента', await p.evaluate(()=>document.querySelector('.pr__track').scrollLeft), '| страница сдвинулась на', await p.evaluate(()=>window.scrollY) - pageBefore)
await b.close()
