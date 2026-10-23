import puppeteer from 'puppeteer-core'
const b = await puppeteer.launch({ executablePath:'/usr/bin/chromium', headless:'new', args:['--no-sandbox','--disable-gpu','--hide-scrollbars'] })
const p = await b.newPage()
await p.setViewport({ width:1920, height:1000 })
await p.goto('http://127.0.0.1:8181/',{waitUntil:'networkidle2',timeout:120000})
await p.evaluate(()=>document.querySelector('.pr__track')?.scrollIntoView({block:'center'}))
await new Promise(r=>setTimeout(r,600))

const before = await p.evaluate(()=>document.querySelector('.pr__track').scrollLeft)
// перетаскивание мышью
const box = await (await p.$('.pr__track')).boundingBox()
await p.mouse.move(box.x + box.width*0.6, box.y + box.height/2)
await p.mouse.down()
for (let i=1;i<=10;i++) await p.mouse.move(box.x + box.width*0.6 - i*25, box.y + box.height/2)
await p.mouse.up()
const afterDrag = await p.evaluate(()=>document.querySelector('.pr__track').scrollLeft)

// автопрокрутка: уводим курсор, ждём два такта
await p.mouse.move(5, 5)
const s0 = await p.evaluate(()=>document.querySelector('.ps__strip').scrollLeft)
await new Promise(r=>setTimeout(r,11000))
const s1 = await p.evaluate(()=>document.querySelector('.ps__strip').scrollLeft)

console.log('продукция: до', before, '→ после перетаскивания', afterDrag, '| сдвиг', afterDrag-before)
console.log('лента производства: до', s0, '→ через 11 с', s1, '| сдвиг', s1-s0)
await b.close()
