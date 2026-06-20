const STORAGE_KEY = 'globalTravelPlannerV11';
const blankTrip = () => ({
  name: '', destination: '', startDate: '', endDate: '', travelers: 1, tripType: 'משפחה', notes: '',
  flights: [], stays: [], days: [], activities: [], documents: []
});
const demoTrip = () => ({
  name: 'Family Trip Example', destination: 'Global Destination', startDate: '2026-08-01', endDate: '2026-08-10', travelers: 5, tripType: 'משפחה',
  notes: 'זהו דמו נקי ללא מידע אישי. החלף את הכול דרך השאלון.',
  flights: [{date:'2026-08-01', title:'Outbound flight', details:'TLV → Connection → Destination', link:''},{date:'2026-08-10', title:'Return flight', details:'Destination → Connection → TLV', link:''}],
  stays: [{name:'Sample Beach Resort', area:'City / Area', checkin:'2026-08-01', checkout:'2026-08-05', link:''},{name:'Sample City Hotel', area:'City Center', checkin:'2026-08-05', checkout:'2026-08-10', link:''}],
  days: [{date:'2026-08-01', title:'Arrival', text:'נחיתה, הגעה למלון, התארגנות.'},{date:'2026-08-02', title:'Easy day', text:'סיור קל באזור, ארוחת ערב, קניות בסיסיות.'}],
  activities: [{name:'Rainy Day Option', area:'Indoor', price:'$', link:'', notes:'אטרקציה לדוגמה.'},{name:'Family Adventure', area:'Outdoor', price:'$$', link:'', notes:'להחליף באטרקציה אמיתית.'}],
  documents: []
});
let trip = loadTrip();
function loadTrip(){ try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || demoTrip(); } catch { return demoTrip(); }}
function saveTrip(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(trip)); renderAll(); }
function $(s){ return document.querySelector(s); }
function $all(s){ return [...document.querySelectorAll(s)]; }

$all('.nav').forEach(btn=>btn.addEventListener('click',()=>{ $all('.nav').forEach(b=>b.classList.remove('active')); btn.classList.add('active'); $all('.view').forEach(v=>v.classList.remove('active')); $('#'+btn.dataset.view).classList.add('active'); renderAll(); }));
$('#newTripBtn').onclick=()=>{ trip=blankTrip(); fillForm(); renderEditors(); saveTrip(); };
$('#demoBtn').onclick=()=>{ trip=demoTrip(); fillForm(); renderEditors(); saveTrip(); };
$('#saveWizardBtn').onclick=()=>{ readForm(); saveTrip(); };
$('#clearBtn').onclick=()=>{ localStorage.removeItem(STORAGE_KEY); trip=blankTrip(); fillForm(); renderEditors(); renderAll(); };
$('#exportBtn').onclick=()=>{ readForm(); const blob=new Blob([JSON.stringify(trip,null,2)],{type:'application/json'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=(trip.name||'travel-plan')+'.json'; a.click(); };
$('#importFile').onchange=e=>{ const f=e.target.files[0]; if(!f)return; const r=new FileReader(); r.onload=()=>{ trip=JSON.parse(r.result); saveTrip(); fillForm(); renderEditors(); }; r.readAsText(f); };

function fillForm(){ const f=$('#tripForm'); ['name','destination','startDate','endDate','travelers','tripType','notes'].forEach(k=>f.elements[k].value=trip[k]||''); }
function readForm(){ const f=$('#tripForm'); ['name','destination','startDate','endDate','travelers','tripType','notes'].forEach(k=>trip[k]=f.elements[k].value); readEditors(); }
function fieldsFor(type){
  return ({
    flights:[['date','date','תאריך'],['title','text','כותרת'],['details','text','פרטים'],['link','url','קישור']],
    stays:[['name','text','שם מלון'],['area','text','אזור'],['checkin','date','צ׳ק אין'],['checkout','date','צ׳ק אאוט'],['link','url','קישור']],
    days:[['date','date','תאריך'],['title','text','כותרת'],['text','textarea','פירוט']],
    activities:[['name','text','שם'],['area','text','אזור'],['price','text','עלות'],['link','url','קישור'],['notes','textarea','הערות']]
  })[type];
}
function renderEditors(){ ['flights','stays','days','activities'].forEach(type=>{ const box=$('#'+type+'Editor'); box.innerHTML=''; trip[type].forEach((item,i)=>box.appendChild(itemForm(type,item,i))); }); }
function itemForm(type,item,i){ const div=document.createElement('div'); div.className='mini-form'; div.dataset.type=type; div.dataset.index=i; fieldsFor(type).forEach(([k,t,label])=>{ const l=document.createElement('label'); if(t==='textarea'){l.className='full'; l.innerHTML=`${label}<textarea data-key="${k}">${item[k]||''}</textarea>`} else {l.innerHTML=`${label}<input type="${t}" data-key="${k}" value="${escapeHtml(item[k]||'')}">`} div.appendChild(l); }); const b=document.createElement('button'); b.type='button'; b.className='remove'; b.textContent='מחק'; b.onclick=()=>{ trip[type].splice(i,1); renderEditors(); saveTrip(); }; div.appendChild(b); return div; }
function readEditors(){ ['flights','stays','days','activities'].forEach(type=>{ trip[type]=[...document.querySelectorAll(`[data-type="${type}"]`)].map(form=>{ const o={}; form.querySelectorAll('[data-key]').forEach(el=>o[el.dataset.key]=el.value); return o; }); }); }
$all('[data-add]').forEach(b=>b.onclick=()=>{ readForm(); const type=b.dataset.add; const empty=Object.fromEntries(fieldsFor(type).map(f=>[f[0],''])); trip[type].push(empty); renderEditors(); saveTrip(); });
function renderAll(){ $('#appTitle').textContent=trip.name||'מתכנן טיולים גלובלי'; $('#appSubtitle').textContent=[trip.destination, trip.startDate&&trip.endDate?`${trip.startDate} עד ${trip.endDate}`:'', trip.travelers?`${trip.travelers} נוסעים`:'' ].filter(Boolean).join(' · ') || 'מלאו שאלון כדי להתחיל.'; renderDashboard(); renderTimeline(); renderStays(); renderActivities(); renderDocs(); }
function renderDashboard(){ $('#dashboard').innerHTML=`<div class="card hero"><div><h2>${escapeHtml(trip.name||'טיול חדש')}</h2><p>${escapeHtml(trip.notes||'אין הערות עדיין.')}</p></div><div><span class="pill">${escapeHtml(trip.destination||'יעד לא הוגדר')}</span><br><span class="pill">${escapeHtml(trip.tripType||'')}</span></div></div><div class="cards">${stat('טיסות',trip.flights.length)}${stat('מלונות',trip.stays.length)}${stat('ימי לו״ז',trip.days.length)}${stat('אטרקציות',trip.activities.length)}${stat('מסמכים',trip.documents.length)}</div>`; }
function stat(t,n){return `<div class="trip-card"><h3>${t}</h3><div class="pill">${n}</div></div>`}
function renderTimeline(){ $('#timeline').innerHTML=`<div class="card"><h2>לו״ז</h2>${trip.days.length?trip.days.map(d=>`<div class="timeline-day"><b>${escapeHtml(d.date||'')}</b><div><h3>${escapeHtml(d.title||'יום')}</h3><p>${escapeHtml(d.text||'')}</p></div></div>`).join(''):'<p>אין ימים בלו״ז.</p>'}</div>`; }
function renderStays(){ $('#stays').innerHTML=`<div class="card"><h2>מלונות</h2><div class="cards">${trip.stays.map(s=>card(s.name,s.area,`${s.checkin||''} → ${s.checkout||''}`,s.link)).join('')||'<p>אין מלונות.</p>'}</div></div>`; }
function renderActivities(){ $('#activities').innerHTML=`<div class="card"><h2>אטרקציות</h2><div class="cards">${trip.activities.map(a=>card(a.name,a.area,`${a.price||''}<br>${escapeHtml(a.notes||'')}`,a.link)).join('')||'<p>אין אטרקציות.</p>'}</div></div>`; }
function card(title,sub,body,link){ return `<div class="trip-card"><h3>${escapeHtml(title||'ללא שם')}</h3><span class="pill">${escapeHtml(sub||'')}</span><p>${body||''}</p>${link?`<a target="_blank" href="${escapeHtml(link)}">פתח קישור</a>`:''}</div>`; }
$('#docUpload').onchange=e=>{ [...e.target.files].forEach(file=>trip.documents.push({name:file.name,type:file.type,size:file.size,added:new Date().toISOString()})); saveTrip(); };
function renderDocs(){ const el=$('#docsList'); if(!el)return; el.innerHTML=trip.documents.map((d,i)=>`<div class="trip-card"><h3>${escapeHtml(d.name)}</h3><p>${escapeHtml(d.type||'file')} · ${Math.round((d.size||0)/1024)}KB</p><button onclick="removeDoc(${i})" class="remove">מחק</button></div>`).join('')||'<p>אין מסמכים.</p>'; }
window.removeDoc=i=>{ trip.documents.splice(i,1); saveTrip(); };
$('#remoteCopyBtn').onclick=()=>{ const h=$('#remoteHost').value.trim()||'<host>'; const u=$('#remoteUser').value.trim(); $('#remoteCommand').textContent=`mstsc /v:${h}${u?' /prompt':''}`; navigator.clipboard?.writeText($('#remoteCommand').textContent); };
function escapeHtml(s){ return String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }
fillForm(); renderEditors(); renderAll();
