// Собирает sitemap.xml после nuxt generate — из того, что реально
// попало в сборку, а не из списка, который легко забыть обновить.
import { readdir, writeFile, stat, readFile } from 'node:fs/promises'
import { join, relative } from 'node:path'
import { existsSync } from 'node:fs'

// Папка собранной статики.
//
// Раньше здесь стояло 'dist' — это символическая ссылка на .output/public,
// которая лежит только на машине разработчика: она в .gitignore и ведёт по
// абсолютному пути. На сборке из GitHub (App Platform в Timeweb Cloud)
// такой папки нет, скрипт падал, и sitemap.xml не создавался вовсе — именно
// поэтому на сайте его нет, хотя в ТЗ он значится сделанным.
// Берём настоящий путь сборки, а ссылку оставляем как запасной вариант.
const DIST = existsSync('.output/public') ? '.output/public' : 'dist'
const SITE = (process.env.NUXT_PUBLIC_SITE_URL || 'https://vologda-brus.ru').replace(/\/$/, '')
const SKIP = new Set(['200.html', '404.html'])

/** Страницу, которая сама просит себя не индексировать, в карту не кладём. */
const isNoindex = async f => /<meta[^>]+name="robots"[^>]*noindex/i.test(await readFile(f, 'utf8'))

async function walk(dir, acc = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name === '_nuxt' || entry.name === 'images') continue
      await walk(p, acc)
    } else if (entry.name === 'index.html' || entry.name.endsWith('.html')) {
      acc.push(p)
    }
  }
  return acc
}

const files = await walk(DIST)
const urls = []

for (const f of files) {
  const rel = relative(DIST, f).replaceAll('\\', '/')
  if (SKIP.has(rel)) continue
  if (await isNoindex(f)) continue
  // Адреса со слешем на конце — в том виде, в котором их отдаёт хостинг и в
  // котором они стоят в canonical. Без слеша веб-сервер App Platform
  // переадресует запрос кодом 308, и в карте оказались бы адреса,
  // переадресующие на другие.
  const route = rel === 'index.html'
    ? '/'
    : '/' + rel.replace(/\/index\.html$/, '').replace(/\.html$/, '') + '/'
  const { mtime } = await stat(f)
  urls.push({ loc: `${SITE}${route}`, lastmod: mtime.toISOString().slice(0, 10) })
}

urls.sort((a, b) => a.loc.length - b.loc.length)

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${u.lastmod}</lastmod>\n  </url>`).join('\n')}
</urlset>
`

await writeFile(join(DIST, 'sitemap.xml'), xml, 'utf8')
console.log(`sitemap.xml: ${urls.length} адресов`)
for (const u of urls) console.log('  ', u.loc)
