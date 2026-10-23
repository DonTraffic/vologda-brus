import puppeteer from 'puppeteer-core'
const b = await puppeteer.launch({ executablePath:'/usr/bin/chromium', headless:'new', args:['--no-sandbox','--disable-gpu','--hide-scrollbars'] })
const p = await b.newPage()
await p.setViewport({ width:Number(process.env.W||375), height:800 })
await p.goto(process.argv[2],{waitUntil:'networkidle2',timeout:120000})
await new Promise(r=>setTimeout(r,800))
const out = await p.evaluate(()=>{
  const vw = document.documentElement.clientWidth
  const bad=[]
  for (const el of document.querySelectorAll('*')) {
    const r = el.getBoundingClientRect()
    if (r.width === 0) continue
    if (r.right > vw + 1 || r.left < -1) bad.push({cls:(el.className||'').toString().slice(0,40), tag:el.tagName, left:Math.round(r.left), right:Math.round(r.right), w:Math.round(r.width)})
  }
  return bad.slice(0,12)
})
console.log('ширина окна:', await p.evaluate(()=>document.documentElement.clientWidth))
for (const o of out) console.log(JSON.stringify(o))
await b.close()
