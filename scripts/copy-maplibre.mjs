import { mkdir, copyFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const root = new URL('..', import.meta.url)
const from = new URL('node_modules/maplibre-gl/dist/maplibre-gl-worker.mjs', root)
const dir = new URL('public/vendor/', root)
const to = new URL('maplibre-gl-worker.mjs', dir)

await mkdir(fileURLToPath(dir), { recursive: true })
await copyFile(fileURLToPath(from), fileURLToPath(to))
console.log('maplibre-gl-worker.mjs → public/vendor/')
