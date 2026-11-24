import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import {bank} from './dp600-content.mjs';
const root = new URL('../', import.meta.url);
const source = JSON.parse(fs.readFileSync(new URL('dp600-source-index.json', import.meta.url)));
const ids=new Set();
for(const q of bank){
 if(ids.has(q.id))throw Error(`Duplicate id: ${q.id}`);ids.add(q.id);
 if(!q.hints?.length || !q.refs?.length)throw Error(`Missing guidance: ${q.id}`);
 for(const n of q.source)if(!source.some(x=>x.n===n))throw Error(`Unknown source: ${n}`);
}
const block='/* DP600_PDF_START */\nconst DP_PDF = '+JSON.stringify(bank,null,2)+';\nconst DP_SOURCE = '+JSON.stringify(source)+';\n/* DP600_PDF_END */';
const file=new URL('app/index.html',root);
let html=fs.readFileSync(file,'utf8');
if(html.includes('/* DP600_PDF_START */'))html=html.replace(/\/\* DP600_PDF_START \*\/[\s\S]*?\/\* DP600_PDF_END \*\//,()=>block);
else html=html.replace('/* ---------- DP-600 ---------- */',()=>block+'\n\n/* ---------- DP-600 ---------- */');
fs.writeFileSync(file,html);
console.log(`Embedded ${bank.length} practice adaptations and ${source.length} source questions in ${fileURLToPath(file)}`);
