import puppeteer from 'puppeteer-core'
const b = await puppeteer.launch({ executablePath:'/usr/bin/chromium', headless:'new', args:['--no-sandbox','--disable-gpu','--hide-scrollbars'] })
for (const W of [1454, 1920, 2560, 3384]) {
  const p = await b.newPage()
  await p.setViewport({ width:W, height:900 })
  await p.goto('http://127.0.0.1:8181/',{waitUntil:'networkidle2',timeout:120000})
  await new Promise(r=>setTimeout(r,400))
  const r = await p.evaluate(()=>{
    const out = {}
    for (const [k, sel] of [['продукция','.pr__track'], ['производство','.ps__strip']]) {
      const t = document.querySelector(sel)
      t.scrollLeft = 1e6
      const atEnd = t.scrollLeft
      const last = t.lastElementChild.getBoundingClientRect()
      const cont = document.querySelector('.pr__head').getBoundingClientRect()
      out[k] = { max: Math.round(t.scrollWidth - t.clientWidth), lastRight: Math.round(last.right), contRight: Math.round(cont.right) }
      t.scrollLeft = 0
    }
    return out
  })
  console.log(`${W}px → продукция: ход ${r['продукция'].max}, последняя карточка кончается на ${r['продукция'].lastRight} (край колонки ${r['продукция'].contRight}) | лента: ход ${r['производство'].max}`)
  await p.close()
}
await b.close()
