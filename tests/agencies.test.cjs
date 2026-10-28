const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const agencies = JSON.parse(fs.readFileSync('data/agencies.json'));
test('new agencies have sources, unique identities and no invented ratings or prices', () => {
  assert.equal(new Set(agencies.map(a => a.id)).size, agencies.length);
  assert.equal(new Set(agencies.map(a => a.nome_commerciale)).size, agencies.length);
  const added = agencies.filter(a => a.fonte);
  assert.equal(added.length, 4);
  for (const a of added) {
    assert.equal(a.rating, null);
    assert.equal(a.fascia_prezzo, null);
    assert.equal(a.fonte, a.sito_web);
    assert.ok(a.telefono);
  }
});
test('render supports missing ratings, contacts and province/rating filters', async () => {
  const elements = Object.fromEntries(['q','regione','provincia','comune','prezzo','rating','results','count'].map(id => [id,{value:'',innerHTML:'',innerText:'',children:[],appendChild(x){this.children.push(x)}}]));
  const context = {window:{},document:{getElementById:id=>elements[id],createElement:()=>({}),addEventListener(){}},fetch:async()=>({json:async()=>agencies})};
  vm.createContext(context);
  vm.runInContext(fs.readFileSync('assets/js/main.js','utf8'),context);
  await context.loadAgencies();
  assert.equal(elements.count.innerText, '6 agenzie');
  assert.match(elements.results.innerHTML, /Recensioni non disponibili/);
  assert.doesNotMatch(elements.results.innerHTML, /mailto:null/);
  assert.equal(elements.provincia.children.length,4);
  elements.provincia.value='NU'; context.render();
  assert.equal(elements.count.innerText,'1 agenzie');
  assert.match(elements.results.innerHTML,/Fois Marianna/);
  elements.rating.value='4'; context.render();
  assert.equal(elements.count.innerText,'0 agenzie');
  elements.provincia.value=''; context.render();
  assert.equal(elements.count.innerText,'2 agenzie');
});
