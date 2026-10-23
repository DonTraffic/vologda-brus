import puppeteer from 'puppeteer-core'
import { writeFile } from 'node:fs/promises'
const [url, sel, out] = process.argv.slice(2)
const browser = await puppeteer.launch({ executablePath:'/usr/bin/chromium', headless:'new',
  args:['--no-sandbox','--disable-gpu','--hide-scrollbars'] })
const page = await browser.newPage()
await page.setViewport({ width:1200, height:1000 })
await page.goto(url,{waitUntil:'networkidle2',timeout:120000})
await page.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=500){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,80))}window.scrollTo(0,0)})
const html = await page.$eval(sel, el => el.outerHTML)
await writeFile(out, html, 'utf8')
console.log(out, html.length)
await browser.close()
