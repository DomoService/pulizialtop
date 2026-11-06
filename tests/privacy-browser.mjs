// Run with Bun and PLAYWRIGHT_MODULE pointing to an operator-installed playwright.
// Uses the real component and SDK injector. Next routing is stubbed; analytics server
// is intercepted, so these tests do NOT prove the provider's live collection behavior.
import assert from "node:assert/strict"
import { fileURLToPath } from "node:url"
import path from "node:path"
const root = fileURLToPath(new URL("..", import.meta.url))
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || "playwright")
const react = path.join(root, "node_modules/react/index.js")
const built = await Bun.build({
  entrypoints: [path.join(root,"tests/privacy-consent-browser.tsx")], target:"browser",
  define: {"process.env.NODE_ENV": JSON.stringify("production")},
  plugins:[{name:"isolated-next", setup(b){
    b.onResolve({filter:/^next\/(navigation(?:\.js)?|link)$/},a=>({path:a.path,namespace:"fixture"}))
    b.onLoad({filter:/.*/,namespace:"fixture"},a=>({loader:"js",contents:a.path.includes("link") ?
      `import React from ${JSON.stringify(react)};export default function Link(p){return React.createElement('a',p,p.children)}` :
      `import {useSyncExternalStore} from ${JSON.stringify(react)};export function usePathname(){return useSyncExternalStore(cb=>{addEventListener('popstate',cb);return()=>removeEventListener('popstate',cb)},()=>location.pathname)};export function useParams(){return {}};export function useSearchParams(){return new URLSearchParams(location.search)}`
    }))
  }}]
})
assert(built.success, String(built.logs))
const bundle = await built.outputs[0].text()
const server=Bun.serve({port:0,fetch(req){return new Response(new URL(req.url).pathname==="/fixture.js"?bundle:'<!doctype html><html lang="it"><meta name="viewport" content="width=device-width, initial-scale=1"><div id="root"></div><script type="module" src="/fixture.js"></script></html>',{headers:{"content-type":new URL(req.url).pathname==="/fixture.js"?"application/javascript":"text/html"}})}})
const origin=`http://localhost:${server.port}`
const browser=await chromium.launch({headless:true})
try {
 for(const viewport of [{width:1280,height:800},{width:390,height:844}]) {
  const context=await browser.newContext({viewport})
  const page=await context.newPage();page.setDefaultTimeout(10000);page.setDefaultNavigationTimeout(10000);page.on("pageerror",e=>console.error("FIXTURE",e.stack));const sdk=[]
  await page.route('**/_vercel/insights/**',r=>{sdk.push(r.request().url());return r.fulfill({status:200,body:'/* SDK transport intentionally isolated */',contentType:'application/javascript'})})
  console.log("Testing viewport",viewport.width,origin);await page.goto(origin);await page.getByRole('dialog').waitFor()
  assert.equal(sdk.length,0,'no SDK request before choice')
  await page.getByRole('button',{name:'Personalizza',exact:true}).click()
  assert.equal(await page.getByRole('checkbox').isChecked(),false)
  await page.getByRole('button',{name:'Salva preferenze',exact:true}).click()
  await page.reload();assert.equal(await page.getByRole('dialog').count(),0)
  assert.equal(sdk.length,0,'refusal persists across reload')
  let record=await page.evaluate(()=>JSON.parse(localStorage.getItem('pulizialtop-consent-v1')))
  assert.equal(record.analytics,false);assert(record.savedAt);assert(record.expires>record.savedAt)
  await page.getByRole('button',{name:'Preferenze cookie',exact:true}).click()
  await page.getByRole('checkbox').check()
  await page.getByRole('button',{name:'Salva preferenze',exact:true}).click()
  await page.waitForFunction(()=>window.vaq?.length>0)
  await page.waitForTimeout(200);assert(sdk.length>0,'SDK request only after explicit opt-in')
  const event=()=>page.evaluate(()=>{const cb=window.vaq.filter(x=>x[0]==='beforeSend').at(-1)[1];return cb({type:'pageview',url:location.origin+'/?secret=value#token'})})
  assert.equal((await event()).url,origin+'/')
  await page.evaluate(()=>{history.pushState({},'', '/agenzia/login');dispatchEvent(new PopStateEvent('popstate'))})
  assert.equal(await event(),null,'already loaded SDK blocks sensitive navigation')
  await page.evaluate(()=>{history.pushState({},'', '/');dispatchEvent(new PopStateEvent('popstate'));document.cookie='_ga=legacy; path=/'})
  await page.getByRole('button',{name:'Preferenze cookie',exact:true}).click()
  await page.getByRole('button',{name:'Rifiuta non necessari',exact:true}).click()
  await page.waitForTimeout(500)
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('pulizialtop-consent-v1')).analytics),false)
  assert(!((await context.cookies()).some(c=>c.name==='_ga')))
  const count=sdk.length;await page.reload();await page.waitForTimeout(150);assert.equal(sdk.length,count,'no script reload after withdrawal')
  await page.getByRole('button',{name:'Preferenze cookie',exact:true}).click()
  await page.getByRole('button',{name:'Accetta tutti',exact:true}).click()
  await page.getByRole('button',{name:'Preferenze cookie',exact:true}).click()
  await page.getByRole('button',{name:'Chiudi: solo strumenti necessari',exact:true}).click()
  await page.waitForTimeout(400)
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('pulizialtop-consent-v1')).analytics),false)
  await page.evaluate(()=>localStorage.clear());await page.reload()
  await page.getByRole('dialog').waitFor();await page.keyboard.press('Escape')
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('pulizialtop-consent-v1')).analytics),false)
  await context.close()
  const technical=await browser.newPage({viewport});await technical.goto(origin+'?technical')
  await technical.getByRole('button',{name:'Preferenze cookie',exact:true}).waitFor()
  assert.equal(await technical.getByRole('dialog').count(),0)
  await technical.getByRole('button',{name:'Preferenze cookie',exact:true}).click()
  assert.equal(await technical.getByRole('checkbox').count(),0,'no unused optional category')
  await technical.close()
  console.log(`PASS consent browser ${viewport.width}x${viewport.height}: first visit, refusal, selective opt-in, accept, private route, revoke, cleanup, X, Escape, technical only`)
 }
} finally {await browser.close();server.stop()}
