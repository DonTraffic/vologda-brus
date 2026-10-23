import puppeteer from 'puppeteer-core'
const W = Number(process.env.W || 1454)
const b = await puppeteer.launch({ executablePath:'/usr/bin/chromium', headless:'new', args:['--no-sandbox','--disable-gpu','--hide-scrollbars'] })
const p = await b.newPage()
await p.setViewport({ width:W, height:900 })
await p.goto('http://127.0.0.1:8181/',{waitUntil:'networkidle2',timeout:120000})
await p.evaluate(()=>{ const r=document.querySelector('.pr__track').getBoundingClientRect(); window.scrollTo({top: window.scrollY + r.top - 150, behavior:'instant'}) })
await new Promise(r=>setTimeout(r,700))
console.log(await p.evaluate(()=>{ const t=document.querySelector('.pr__track'); return { client:t.clientWidth, scrollW:t.scrollWidth, max:t.scrollWidth-t.clientWidth, padL:getComputedStyle(t).paddingLeft } }))
const pt = await p.evaluate(()=>{ const r=document.querySelector('.pr__track').getBoundingClientRect(); return {x:Math.round(r.left+r.width*0.5), y:Math.round(r.top+r.height*0.35)} })
await p.mouse.move(pt.x, pt.y); await p.mouse.down()
for (let i=1;i<=12;i++) await p.mouse.move(pt.x - i*40, pt.y)
await p.mouse.up()
await new Promise(r=>setTimeout(r,300))
console.log('после перетаскивания на 480:', await p.evaluate(()=>document.querySelector('.pr__track').scrollLeft))
// форма консультации
console.log('консультация:', await p.evaluate(()=>{
  const t=document.querySelector('.cs__title'); const r=t.getBoundingClientRect()
  return { left: Math.round(r.left), right: Math.round(window.innerWidth - r.right), w: Math.round(r.width) }
}))
await b.close()
