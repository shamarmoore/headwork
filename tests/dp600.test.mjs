import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL,fileURLToPath} from 'node:url';
import {bank} from '../tools/dp600-content.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const html=fs.readFileSync(path.join(root,'app/index.html'),'utf8');
const sources=JSON.parse(fs.readFileSync(path.join(root,'tools/dp600-source-index.json')));
test('all source questions and exhibits are accounted for, and graded answers are structurally valid',()=>{
 assert.equal(sources.length,198);
 assert.deepEqual(sources.map(x=>x.n),Array.from({length:198},(_,i)=>i+1));
 assert.equal(bank.length,60);
 assert.equal(new Set(bank.map(q=>q.id)).size,bank.length);
 for(const s of sources)for(const p of s.pages)assert.ok(fs.statSync(path.join(root,`app/dp600-source/page-${p}.webp`)).size>1000);
 for(const q of bank){
  assert.ok(['maintain','prepare','model'].includes(q.d));
  assert.ok(q.hints.length>=2);assert.ok(q.why);assert.ok(q.refs.every(r=>r.startsWith('https://')));
  assert.ok(q.source.every(n=>sources.some(s=>s.n===n)));
  if(q.type==='yn'){assert.equal(q.stmts.length,q.a.length);assert.ok(q.a.every(a=>typeof a==='boolean'));}
  else {const answers=Array.isArray(q.a)?q.a:[q.a],opts=q.items||q.opts;assert.equal(new Set(answers).size,answers.length);assert.ok(answers.every(a=>Number.isInteger(a)&&a>=0&&a<opts.length));if(q.type==='multi')assert.equal(q.pick,q.a.length);}
 }
 for(const match of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g))new Function(match[1]);
 const embedded=JSON.parse(html.match(/const DP_PDF = ([\s\S]*?);\nconst DP_SOURCE/)[1]);
 assert.deepEqual(embedded,bank,'Run npm run build:dp600 after editing content');
});

test('Socratic drills, retries, mock review, source library and saved progress work in a browser',async()=>{
 const {chromium}=await import(process.env.HEADWORK_PLAYWRIGHT || 'playwright');
 const executablePath=process.env.HEADWORK_BROWSER;
 const browser=await chromium.launch({headless:true,...(executablePath?{executablePath}:{})});
 try{
  const context=await browser.newContext({viewport:{width:390,height:844}});
  const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.route('https://**/*',route=>route.abort());
  await page.goto(pathToFileURL(path.join(root,'app/index.html')).href);
  await page.waitForFunction(()=>!!window.HWHub);
  assert.equal(await page.evaluate(()=>HWHub.DPQ.length),235);
  const act=(name,arg)=>page.locator(`#dpView [data-act="${name}"]${arg===undefined?'':`[data-arg="${arg}"]`}`).first();
  async function selectQuestion(id){
   await page.evaluate(id=>{HWHub.go('dp','drill');const s=HWHub.dpsess();const q=HWHub.DPQ.find(q=>q.id===id);Object.keys(s).forEach(k=>delete s[k]);Object.assign(s,{q,order:Array.from({length:(q.opts||q.items||[]).length},(_,i)=>i),chosen:null,sel:[],yn:(q.stmts||[]).map(()=>null),seq:[],done:false});HWHub.go('dp','drill');},id);
  }
  async function choose(q,correct,prefix='dp',scope=page.locator('#dpView')){
   const click=(a,b)=>scope.locator(`[data-act="${prefix}${a}"][data-arg="${b}"]`).click();
   if(q.type==='mc')await click('pick',correct?q.a:(q.a+1)%q.opts.length);
   else if(q.type==='multi'){
    const picks=correct?q.a:[...q.a.slice(1),q.opts.findIndex((_,i)=>!q.a.includes(i))];
    for(const a of picks)await click('tog',a);
    await scope.locator(`[data-act="${prefix==='mr'?'mrsubmit':'dpsubmit'}"]`).click();
   }else if(q.type==='yn'){
    for(let i=0;i<q.a.length;i++)await click('yn',`${i}:${(i===0&&!correct?!q.a[i]:q.a[i])?1:0}`);
    await scope.locator(`[data-act="${prefix==='mr'?'mrsubmit':'dpsubmit'}"]`).click();
   }else{
    for(const a of (correct?q.a:[...q.a].reverse()))await click('ord',a);
    await scope.locator(`[data-act="${prefix==='mr'?'mrsubmit':'dpsubmit'}"]`).click();
   }
  }
  for(const id of ['pdf72-2','pdf72-1','pdf72-83','pdf72-186']){
   const q=bank.find(q=>q.id===id);await selectQuestion(id);await choose(q,false);
   assert.equal(await page.locator('#dpView .right, #dpView .yn-fix').count(),0,'No correct answer leaks before reveal');
   assert.ok(await page.locator('.dp-coach').isVisible());
   assert.ok(!(await page.locator('.dp-coach').innerText()).includes(q.why));
   const before=await page.evaluate(id=>JSON.stringify(HWHub.state().dp.q[id]),id);
   await act('dpcoach','drill:hint').click();
   await act('dpcoach','drill:retry').click();await choose(q,false);
   assert.ok((await page.locator('.dp-coach').innerText()).includes('still misses'));
   await act('dpcoach','drill:retry').click();await choose(q,true);
   assert.ok((await page.locator('.dp-coach').innerText()).includes(q.why));
   assert.equal(await page.evaluate(id=>JSON.stringify(HWHub.state().dp.q[id]),id),before,'Guided attempts cannot change score or scheduling');
  }
  await selectQuestion('m1');await act('dppick','0').click();assert.ok(await page.locator('.dp-coach').isVisible());await act('dpcoach','drill:reveal').click();
  await selectQuestion('pdf72-7');await choose(bank.find(q=>q.id==='pdf72-7'),true);assert.equal(await page.locator('.dp-coach').count(),0);
  await act('dppool','pdf').click();assert.ok(await page.evaluate(()=>HWHub.dpsess().q.source));
  await page.evaluate(()=>HWHub.go('dp','source'));
  await page.locator('#dpSourceSelect').selectOption('198');
  const images=page.locator('.dp-source-page img');await images.last().scrollIntoViewIfNeeded();
  await page.waitForFunction(()=>[...document.querySelectorAll('.dp-source-page img')].every(i=>i.complete&&i.naturalWidth>0));
  await page.locator('#dpSourceNote').fill('My reasoning <script>must stay text</script>');
  const backup=await page.evaluate(()=>JSON.parse(HWHub.backupText()));assert.equal(backup.data['hw.state'].dp.sourceNotes['198'],'My reasoning <script>must stay text</script>');
  await page.reload();await page.evaluate(()=>HWHub.go('dp','source'));await page.locator('#dpSourceSelect').selectOption('198');assert.match(await page.locator('#dpSourceNote').inputValue(),/must stay text/);
  await act('dpsourcezoom').click();assert.ok(await page.locator('.dp-source-page.zoom').first().isVisible());
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Mobile page must not overflow');
  await page.locator('#dpSourceSearch').fill('zzznomatches');await act('dpsourcesearch').click();assert.equal(await page.locator('#dpSourceSelect option').count(),1);
  await page.locator('#dpSourceSearch').fill('83');await page.locator('#dpSourceSearch').press('Enter');assert.equal(await page.locator('#dpSourceSelect option').count(),1);assert.equal(await page.locator('#dpSourceSelect').inputValue(),'83');
  await page.locator('#dpSourceSearch').fill('');await act('dpsourcesearch').click();
  await page.locator('#dpSourceSelect').selectOption('2');await act('dpsourcepractice','pdf72-2').click();assert.equal(await page.evaluate(()=>HWHub.dpsess().q.id),'pdf72-2');
  await page.evaluate(()=>HWHub.go('dp','mock'));await act('mockstart','quick').click();
  assert.equal(await page.locator('.dp-coach').count(),0);
  // Use each supported format in a deterministic completed mock. The production renderer and event handlers are unchanged.
  await page.evaluate(()=>{const m=HWHub.mocksess();m.qs=m.qs.slice(0,4);['pdf72-2','pdf72-1','pdf72-83','pdf72-186'].forEach((id,i)=>{const q=HWHub.DPQ.find(q=>q.id===id);Object.assign(m.qs[i],{q,order:Array.from({length:(q.opts||q.items||[]).length},(_,i)=>i),chosen:null,sel:[],yn:(q.stmts||[]).map(()=>null),seq:[],done:false});});});
  await act('mockend').click();const original=await page.evaluate(()=>JSON.stringify({q:HWHub.state().dp.q,mocks:HWHub.state().dp.mocks}));
  for(let i=0;i<4;i++){
   const q=bank.find(q=>q.id===['pdf72-2','pdf72-1','pdf72-83','pdf72-186'][i]);
   await act('dpcoach',`${i}:retry`).click();await choose(q,true,'mr',page.locator('#dpView .rv').nth(i));
  }
  assert.equal(await page.evaluate(()=>JSON.stringify({q:HWHub.state().dp.q,mocks:HWHub.state().dp.mocks})),original,'Mock remediation preserves original score');
  assert.equal(await page.locator('.dp-coach').count(),4,'Recovered answers remain listed as first-attempt misses');
  for(const tab of ['today','quant','es','bda','dp'])await page.evaluate(tab=>HWHub.go(tab),tab);
  assert.deepEqual(errors,[]);
  if(process.env.HEADWORK_SCREENSHOTS){
   fs.mkdirSync(process.env.HEADWORK_SCREENSHOTS,{recursive:true});
   await selectQuestion('pdf72-2');await choose(bank.find(q=>q.id==='pdf72-2'),false);await page.screenshot({path:path.join(process.env.HEADWORK_SCREENSHOTS,'mobile-coach.png'),fullPage:true});
   await page.setViewportSize({width:1280,height:900});await page.screenshot({path:path.join(process.env.HEADWORK_SCREENSHOTS,'desktop-coach.png'),fullPage:true});
   await page.evaluate(()=>HWHub.go('dp','source'));await page.locator('#dpSourceSelect').selectOption('2');await page.screenshot({path:path.join(process.env.HEADWORK_SCREENSHOTS,'source-library.png'),fullPage:true});
  }
 }finally{await browser.close();}
});
