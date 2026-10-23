import { readFile } from 'node:fs/promises'
const data = JSON.parse(await readFile('_source/ref-measure.json', 'utf8'))
const want = process.argv.slice(2)
for (const b of data) {
  if (want.length && !want.includes(b.id)) continue
  console.log(`\n${'='.repeat(74)}\n${b.id}   высота ${b.h}px   фон ${b.bg}`)
  for (const i of [...b.items].sort((a, c) => a.y - c.y || a.x - c.x)) {
    const geo = `x${String(i.x).padStart(4)} y${String(i.y).padStart(4)} ${String(i.w).padStart(4)}×${String(i.h).padStart(3)}`
    const typ = i.fs ? `${i.fs}/${i.fw}${i.ls ? ' ls' + i.ls : ''} lh${i.lh}` : ''
    const col = i.color && i.color !== 'rgb(0, 0, 0)' ? i.color.replace(/\s/g, '') : ''
    const bg = i.bg && !/rgba\(0, 0, 0, 0\)/.test(i.bg) ? ` bg${i.bg.replace(/\s/g, '')}` : ''
    const bd = i.border ? ` bd[${i.border.replace(/\s+/g, ' ')}]` : ''
    const what = i.img ? `[img ${i.img}]` : (i.text || '·')
    console.log(`  ${geo} ${typ.padEnd(22)} ${col}${bg}${bd}  ${what.slice(0, 54)}`)
  }
}
