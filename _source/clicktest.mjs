import puppeteer from 'puppeteer-core'
const b = await puppeteer.launch({ executablePath:'/usr/bin/chromium', headless:'new', args:['--no-sandbox','--disable-gpu','--hide-scrollbars'] })
const p = await b.newPage()
await p.setViewport({ width:1454, height:900 })
await p.goto('http://127.0.0.1:8181/',{waitUntil:'networkidle2',timeout:120000})
await p.evaluate(()=>{ const r=document.querySelector('.pr__track').getBoundingClientRect(); window.scrollTo({top: window.scrollY + r.top - 120, behavior:'instant'}) })
await new Promise(r=>setTimeout(r,700))

// 1. обычный клик по кнопке карточки — должен открыть окно мессенджеров
const btn = await p.evaluate(()=>{ const b=document.querySelector('.pr__cta'); const r=b.getBoundingClientRect(); return {x:Math.round(r.left+r.width/2), y:Math.round(r.top+r.height/2), text:b.textContent.trim()} })
await p.mouse.click(btn.x, btn.y)
await new Promise(r=>setTimeout(r,500))
console.log(`клик по «${btn.text}» → окно мессенджеров:`, await p.evaluate(()=>!!document.querySelector('[class*=msg], [role=dialog]')))
await p.keyboard.press('Escape')
await new Promise(r=>setTimeout(r,400))

// 2. перетаскивание по-прежнему работает и клик после него не срабатывает
const before = await p.evaluate(()=>document.querySelector('.pr__track').scrollLeft)
const pt = await p.evaluate(()=>{ const r=document.querySelector('.pr__track').getBoundingClientRect(); return {x:Math.round(r.left+r.width*0.5), y:Math.round(r.top+r.height*0.35)} })
await p.mouse.move(pt.x, pt.y); await p.mouse.down()
for (let i=1;i<=10;i++) await p.mouse.move(pt.x - i*40, pt.y)
await p.mouse.up()
await new Promise(r=>setTimeout(r,400))
console.log('перетаскивание на 400 →', await p.evaluate(()=>document.querySelector('.pr__track').scrollLeft) - before)
console.log('окно после перетаскивания (должно быть false):', await p.evaluate(()=>!!document.querySelector('[role=dialog]')))
await b.close()
