import puppeteer from 'puppeteer-core'
const b = await puppeteer.launch({ executablePath:'/usr/bin/chromium', headless:'new', args:['--no-sandbox','--disable-gpu','--hide-scrollbars'] })
const p = await b.newPage()
await p.setViewport({ width:1454, height:900 })
await p.goto('http://127.0.0.1:8181/',{waitUntil:'networkidle2',timeout:120000})
await p.evaluate(()=>{ const r=document.querySelector('.pr__track').getBoundingClientRect(); window.scrollTo({top: window.scrollY + r.top - 120, behavior:'instant'}) })
await new Promise(r=>setTimeout(r,600))
const ok = await p.evaluate(()=>{
  const a = [...document.querySelectorAll('.pr__cta')].find(e=>e.tagName==='A')
  if (!a) return 'ссылки нет'
  a.scrollIntoView({block:'center'}); return a.getAttribute('href') + ' | ' + a.textContent.trim()
})
console.log('ссылка-карточка:', ok)
await b.close()
