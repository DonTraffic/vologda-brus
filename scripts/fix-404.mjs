import { copyFile, stat, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { existsSync } from 'node:fs'

const DIST = existsSync('.output/public') ? '.output/public' : 'dist'

if (existsSync('.output/server/index.mjs')) {
  console.log('404.html: не нужен — приложение серверное, несуществующие адреса обрабатывает сам Nuxt')
  process.exit(0)
}
const SOURCE = join(DIST, '404', 'index.html')
const TARGET = join(DIST, '404.html')

try {
  const before = await stat(TARGET).then(s => s.size).catch(() => 0)
  const html = await readFile(SOURCE, 'utf8')

  if (!/noindex/i.test(html)) {
    throw new Error('в 404/index.html нет пометки noindex — проверьте app/pages/404.vue')
  }
  if (html.length < 4000) {
    throw new Error(`404/index.html подозрительно мал (${html.length} Б) — похоже, это оболочка, а не страница`)
  }

  await copyFile(SOURCE, TARGET)
  const after = await stat(TARGET).then(s => s.size)
  console.log(`404.html: заменён настоящей страницей, ${before} → ${after} Б`)
  console.log('   не забудьте выключить «SPA Fallback» в настройках приложения —')
  console.log('   без этого хостинг продолжит отдавать копию главной с кодом 200')
}
catch (e) {
  console.error('404.html: не удалось подготовить —', e.message)
  process.exitCode = 1
}
