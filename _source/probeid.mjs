import puppeteer from 'puppeteer-core'
const [url, sel] = process.argv.slice(2)
const b = await puppeteer.launch({ executablePath:'/usr/bin/chromium', headless:'new', args:['--no-sandbox','--disable-gpu','--hide-scrollbars'] })
const p = await b.newPage()
await p.setViewport({ width:Number(process.env.W||1200), height:1000 })
await p.goto(url,{waitUntil:'networkidle2',timeout:120000})
await p.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=300){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,120))}window.scrollTo(0,0)})
const out = await p.evaluate((sel)=>[...document.querySelectorAll(sel)].map(el=>{
  const r=el.getBoundingClientRect(); const cs=getComputedStyle(el)
  return {id:el.id||'', tag:el.tagName, cls:(el.className||'').toString().slice(0,34),
    x:Math.round(r.left), y:Math.round(r.top+window.scrollY), w:Math.round(r.width), h:Math.round(r.height),
    bgi:cs.backgroundImage.slice(0,60), fs:cs.fontSize, text:(el.textContent||'').replace(/\s+/g,' ').trim().slice(0,40)}
}), sel)
for (const o of out) console.log(JSON.stringify(o))
await b.close()
