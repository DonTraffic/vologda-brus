import puppeteer from 'puppeteer-core'
const [url, sel] = process.argv.slice(2)
const browser = await puppeteer.launch({ executablePath:'/usr/bin/chromium', headless:'new',
  args:['--no-sandbox','--disable-gpu','--hide-scrollbars'] })
const page = await browser.newPage()
await page.setViewport({ width:Number(process.env.W||1200), height:1000 })
await page.goto(url,{waitUntil:'networkidle2',timeout:120000})
await page.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=500){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,80))}window.scrollTo(0,0)})
const out = await page.evaluate((sel)=>{
  const res=[]
  for (const el of document.querySelectorAll(sel)) {
    const r=el.getBoundingClientRect(); const cs=getComputedStyle(el)
    res.push({tag:el.tagName, cls:(el.className||'').toString().slice(0,70),
      x:Math.round(r.left), y:Math.round(r.top+window.scrollY), w:Math.round(r.width), h:Math.round(r.height),
      bgi:cs.backgroundImage.slice(0,110), bgc:cs.backgroundColor, bgsize:cs.backgroundSize, bgpos:cs.backgroundPosition,
      fs:cs.fontSize, fw:cs.fontWeight, color:cs.color, radius:cs.borderRadius, opacity:cs.opacity,
      text:(el.textContent||'').replace(/\s+/g,' ').trim().slice(0,50)})
  }
  return res
}, sel)
for (const o of out) console.log(JSON.stringify(o))
await browser.close()
