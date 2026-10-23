import puppeteer from 'puppeteer-core'
const b = await puppeteer.launch({ executablePath:'/usr/bin/chromium', headless:'new', args:['--no-sandbox','--disable-gpu','--hide-scrollbars'] })
const p = await b.newPage()
await p.setViewport({ width:1920, height:1000 })
await p.goto('https://xn--80acbef4bubwkv.xn--p1ai/',{waitUntil:'networkidle2',timeout:120000})
await p.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=300){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,120))}})
const recs = ['rec2146458161','rec2146461191','rec2417623781','rec2146461981','rec2311200651','rec2311212331']
const out = await p.evaluate((recs)=>recs.map(id=>{
  const el=document.getElementById(id); if(!el) return {id, imgs:[], title:''}
  const seen=[]
  for (const i of el.querySelectorAll('img')) {
    const s=(i.dataset.original||i.currentSrc||i.src||'').split('/').pop().replace(/\.webp$/,'')
    if (s && !seen.includes(s)) seen.push(s)
  }
  const t=el.querySelector('.t764__title'); const d=el.querySelector('.t764__descr')
  return {id, title:t?t.textContent.trim():'', descr:d?d.textContent.replace(/\s+/g,' ').trim().slice(0,120):'', imgs:seen}
}), recs)
for (const o of out) { console.log(`\n${o.id}  «${o.title}»  (${o.imgs.length})`); console.log('   ', o.descr); for(const i of o.imgs) console.log('    ·', i) }
await b.close()
