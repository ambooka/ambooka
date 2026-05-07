import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
const banned=[new RegExp(['x','ray'].join(''),'i'),new RegExp(['x','-ray'].join(''),'i'),new RegExp(['code',' reveal'].join(''),'i'),new RegExp(['Code','Reveal','Overlay'].join(''))]
const allowed=new Set(['scripts/verify-no-playful-overlay.mjs'])
const roots=['src','docs','README.md']
function walk(path){const st=statSync(path); if(st.isDirectory()) return readdirSync(path).flatMap(n=>walk(join(path,n))); return [path]}
const files=roots.flatMap(r=>walk(r)).filter(f=>/\.(ts|tsx|md|css|txt)$/.test(f)&&!allowed.has(f))
const hits=[]
for(const file of files){const text=readFileSync(file,'utf8'); for(const pattern of banned){if(pattern.test(text)) hits.push(`${file}: ${pattern}`)}}
if(hits.length){console.error('Banned playful overlay references found:'); console.error(hits.join('\n')); process.exit(1)}
console.log('No banned playful overlay references found.')
