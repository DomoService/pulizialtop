
async function loadAgencies(){
  const res = await fetch('./data/agencies.json');
  const all = await res.json();
  window.__AGENCIES__ = all;
  const province = [...new Set(all.map(a => a.provincia))].sort();
  const select = document.getElementById('provincia');
  province.forEach(provincia => {
    const option = document.createElement('option');
    option.value = provincia;
    option.textContent = provincia;
    select.appendChild(option);
  });
  render();
}
function getVal(id){return document.getElementById(id).value.trim()}
function render(){
  const q = getVal('q').toLowerCase();
  const regione = getVal('regione');
  const provincia = getVal('provincia');
  const comune = getVal('comune');
  const prezzo = getVal('prezzo');
  const minRating = parseFloat(getVal('rating')||0);

  const root = document.getElementById('results');
  const all = window.__AGENCIES__ || [];
  const filtered = all.filter(a=>{
    const text = (a.nome_commerciale+' '+a.ragione_sociale+' '+(a.servizi_offerti||[]).join(' ')+' '+a.comune+' '+a.provincia+' '+a.regione).toLowerCase();
    if(q && !text.includes(q)) return false;
    if(regione && a.regione!==regione) return false;
    if(provincia && a.provincia!==provincia) return false;
    if(comune && a.comune.toLowerCase()!==comune.toLowerCase()) return false;
    if(prezzo && a.fascia_prezzo!==prezzo) return false;
    if(minRating > 0 && (!Number.isFinite(a.rating) || a.rating < minRating)) return false;
    return true;
  });

  root.innerHTML = filtered.map(a=>`
    <div class="card">
      <h3>${a.nome_commerciale} <small class="muted">— ${a.comune} (${a.provincia})</small></h3>
      <div class="meta">
        <div>⭐ ${Number.isFinite(a.rating) ? a.rating.toFixed(1) + ' · ' + a.recensioni + ' recensioni' : 'Recensioni non disponibili'}</div>
        <div>${a.fascia_prezzo || 'Prezzo su preventivo'}</div>
        <div>${(a.servizi_offerti||[]).join(' · ')}</div>
      </div>
      <div class="badges">
        <span class="badge">${a.regione}</span>
        <span class="badge">${a.comune}</span>
        <span class="badge">${a.provincia}</span>
      </div>
      <div style="margin-top:10px">
        ${a.email ? `<a class="btn" href="mailto:${a.email}?subject=Richiesta informazioni">Contatta</a>` : ''}
        ${a.telefono ? `<a class="btn" href="tel:${a.telefono.replace(/\s/g, '')}">Chiama</a>` : ''}
        ${a.fonte ? `<a class="btn" href="${a.sito_web}" target="_blank" rel="noopener noreferrer">Sito ufficiale</a>` : ''}
        <a class="btn" href="#" onclick="alert('Form recensione in arrivo!');return false;">Lascia recensione</a>
      </div>
      ${a.fonte ? `<p class="muted">Dati dal sito ufficiale · verificati il ${a.data_verifica}</p>` : ''}
    </div>
  `).join('');

  document.getElementById('count').innerText = filtered.length + ' agenzie';
}
document.addEventListener('DOMContentLoaded', ()=>{
  document.querySelectorAll('input,select').forEach(el => el.addEventListener('input', render));
  loadAgencies();
});
