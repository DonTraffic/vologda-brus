import puppeteer from 'puppeteer-core'
const b = await puppeteer.launch({ executablePath:'/usr/bin/chromium', headless:'new', args:['--no-sandbox','--disable-gpu','--hide-scrollbars'] })
const p = await b.newPage()
await p.setViewport({ width:1920, height:1000 })
await p.goto('https://xn--80acbef4bubwkv.xn--p1ai/',{waitUntil:'networkidle2',timeout:120000})
await p.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=300){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,120))}})
const recs = ['rec2146458161','rec2146461191','rec2417623781','rec2146461981','rec2311200651','rec2311212331']
const out = await p.evaluate((recs)=>recs.map(id=>{
  const el=document.getElementById(id); if(!el) return {id, urls:[]}
  const seen=[]
  const push=u=>{ if(u && !seen.includes(u)) seen.push(u) }
  for (const n of el.querySelectorAll('*')) {
    if (n.tagName==='IMG') push(n.dataset.original||n.currentSrc||n.src)
    const bg=getComputedStyle(n).backgroundImage
    if (bg && bg!=='none') for (const m of bg.matchAll(/url\("?([^")]+)"?\)/g)) push(m[1])
    if (n.dataset && n.dataset.original) push(n.dataset.original)
  }
  return {id, urls:seen}
}), recs)
for (const o of out) { console.log(`\n${o.id} (${o.urls.length})`); for(const u of o.urls) console.log('   ', u) }
await b.close()
