import puppeteer from 'puppeteer-core'
const b = await puppeteer.launch({ executablePath:'/usr/bin/chromium', headless:'new', args:['--no-sandbox','--disable-gpu','--hide-scrollbars'] })
const p = await b.newPage()
await p.setViewport({ width:1920, height:1000 })
await p.goto('http://127.0.0.1:8181/',{waitUntil:'networkidle2',timeout:120000})
await new Promise(r=>setTimeout(r,800))
console.log(await p.evaluate(()=>{
  const el=document.querySelector('.ps__strip'); const cs=getComputedStyle(el)
  return { scrollLeft: el.scrollLeft, padLeft: cs.paddingLeft, width: el.clientWidth, firstX: el.firstElementChild.getBoundingClientRect().left }
}))
await b.close()
