import puppeteer from 'puppeteer-core'
const [url, sel, props] = process.argv.slice(2)
const browser = await puppeteer.launch({ executablePath:'/usr/bin/chromium', headless:'new', args:['--no-sandbox','--disable-gpu','--hide-scrollbars'] })
const page = await browser.newPage()
await page.setViewport({ width:1200, height:1000 })
await page.goto(url,{waitUntil:'networkidle2',timeout:120000})
await page.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=500){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,60))}window.scrollTo(0,0)})
const out = await page.evaluate((sel, props)=>{
  const ps = props.split(',')
  return [...document.querySelectorAll(sel)].slice(0,8).map(el=>{
    const cs=getComputedStyle(el); const o={cls:(el.className||'').toString().slice(0,34)}
    for (const p of ps) o[p]=cs.getPropertyValue(p)
    return o
  })
}, sel, props)
for (const o of out) console.log(JSON.stringify(o))
await browser.close()
