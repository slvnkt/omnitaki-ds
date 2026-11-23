// Guards against comment text like "status/*/secondary": "*/" closes a CSS comment early and
// the browser silently drops the next rule. Run: npm run lint:css
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

const files = []
const walk = dir => readdirSync(dir).forEach(f => { const p = join(dir, f); statSync(p).isDirectory() ? walk(p) : p.endsWith('.css') && files.push(p) })
walk('src')
const bad = files.flatMap(f => readFileSync(f, 'utf8').split('\n').map((l, i) => [f, i + 1, l]).filter(([, , l]) => /\/\*\//.test(l)))
if (bad.length) {
  console.error('Premature CSS comment terminator ("/*/"):\n' + bad.map(([f, n, l]) => `  ${f}:${n}  ${l.trim()}`).join('\n'))
  process.exit(1)
}
console.log(`CSS comments OK (${files.length} files)`)
