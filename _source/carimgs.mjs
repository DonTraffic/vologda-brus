import puppeteer from 'puppeteer-core'
const b = await puppeteer.launch({ executablePath:'/usr/bin/chromium', headless:'new', args:['--no-sandbox','--disable-gpu','--hide-scrollbars'] })
const p = await b.newPage()
await p.setViewport({ width:1920, height:1000 })
await p.goto('https://xn--80acbef4bubwkv.xn--p1ai/',{waitUntil:'networkidle2',timeout:120000})
await p.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=300){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,120))}})
const out = await p.evaluate(()=>[...document.querySelectorAll('#rec2436754391 .t1148__img-wrapper img, #rec2436754391 .t1148__item img')].map(i=>({src:(i.currentSrc||i.src||i.dataset.original||'').split('/').pop(), w:Math.round(i.getBoundingClientRect().width), h:Math.round(i.getBoundingClientRect().height)})))
console.log(JSON.stringify(out,null,0))
await b.close()
