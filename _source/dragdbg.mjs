import puppeteer from 'puppeteer-core'
const b = await puppeteer.launch({ executablePath:'/usr/bin/chromium', headless:'new', args:['--no-sandbox','--disable-gpu','--hide-scrollbars'] })
const p = await b.newPage()
p.on('console', m => console.log('[page]', m.text().slice(0,160)))
await p.setViewport({ width:1920, height:1000 })
await p.goto('http://127.0.0.1:8181/',{waitUntil:'networkidle2',timeout:120000})
await p.evaluate(()=>{
  const r = document.querySelector('.pr__track').getBoundingClientRect()
  window.scrollTo({ top: window.scrollY + r.top - 250, behavior: 'instant' })
})
await new Promise(r=>setTimeout(r,800))
console.log(await p.evaluate(()=>{
  const t=document.querySelector('.pr__track'), s=document.querySelector('.ps__strip')
  return { prCursor: t.style.cursor, psCursor: s.style.cursor,
           prScrollW: t.scrollWidth, prClientW: t.clientWidth }
}))
await p.evaluate(()=>{
  const t=document.querySelector('.pr__track')
  for (const ev of ['pointerdown','pointermove','pointerup']) t.addEventListener(ev, e=>console.log('EV', ev, e.pointerType, Math.round(e.clientX)))
})
const pt = await p.evaluate(()=>{
  const r = document.querySelector('.pr__track').getBoundingClientRect()
  return { x: Math.round(r.left + 600), y: Math.round(r.top + r.height/2) }
})
console.log('точка', pt)
await p.mouse.move(pt.x, pt.y)
await p.mouse.down()
for (let i=1;i<=8;i++) await p.mouse.move(pt.x - i*30, pt.y)
await p.mouse.up()
console.log('scrollLeft:', await p.evaluate(()=>document.querySelector('.pr__track').scrollLeft))
await b.close()
