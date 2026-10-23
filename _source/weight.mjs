import puppeteer from 'puppeteer-core'
const b = await puppeteer.launch({ executablePath:'/usr/bin/chromium', headless:'new', args:['--no-sandbox','--disable-gpu','--hide-scrollbars'] })
const p = await b.newPage()
const by = {}
p.on('response', async r => {
  const t = r.request().resourceType()
  try { const len = (await r.buffer()).length; by[t] = (by[t]||0) + len } catch {}
})
await p.setViewport({ width:1440, height:900 })
await p.goto('http://127.0.0.1:8181/',{waitUntil:'networkidle2',timeout:120000})
console.log('--- первый экран ---')
for (const [k,v] of Object.entries(by)) console.log(`  ${k}: ${(v/1024).toFixed(0)} КБ`)
const first = Object.values(by).reduce((a,c)=>a+c,0)
await p.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=400){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,90))}})
await new Promise(r=>setTimeout(r,3000))
const all = Object.values(by).reduce((a,c)=>a+c,0)
console.log(`итого при загрузке: ${(first/1024/1024).toFixed(2)} МБ`)
console.log(`итого после полной прокрутки: ${(all/1024/1024).toFixed(2)} МБ`)
await b.close()
