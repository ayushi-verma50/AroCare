// report.js — lab report checklist + generate printable report
(function(){
  const DEFAULT_TESTS = [
    'Complete Blood Count (CBC)',
    'Basic Metabolic Panel (BMP)',
    'Liver Function Tests (LFT)',
    'Lipid Profile',
    'Thyroid Profile (TSH, T3, T4)',
    'Urinalysis',
    'Fasting Blood Sugar (FBS)',
    'HbA1c',
    'ECG',
    'Chest X-Ray',
    'Ultrasound Abdomen',
    'C-Reactive Protein (CRP)',
    'Erythrocyte Sedimentation Rate (ESR)',
    'Vitamin D',
    'COVID-19 PCR'
  ];

  const STORAGE_KEY = 'labReport_v1';

  function qs(id){ return document.getElementById(id); }

  const doctorName = qs('doctorName');
  const patientName = qs('patientName');
  const reportDate = qs('reportDate');
  const notes = qs('notes');
  const testsList = qs('testsList');
  const newTestInput = qs('newTestInput');
  const addTestBtn = qs('addTestBtn');
  const markAllBtn = qs('markAll');
  const clearAllBtn = qs('clearAll');
  const generateBtn = qs('generate');
  const saveBtn = qs('save');
  const reportOutput = qs('reportOutput');

  let state = { tests: [], meta: {} };

  function load(){
    try{
      const raw = localStorage.getItem(STORAGE_KEY);
      if(raw) state = JSON.parse(raw);
    }catch(e){ console.warn('Could not load saved report', e); }
    if(!state.tests || !state.tests.length){
      state.tests = DEFAULT_TESTS.map(t=>({ name: t, done: false }));
    }
    // fill meta
    doctorName.value = state.meta.doctor || '';
    patientName.value = state.meta.patient || '';
    reportDate.value = state.meta.date || (new Date().toISOString().slice(0,10));
    notes.value = state.meta.notes || '';
  }

  function save(){
    state.meta = { doctor: doctorName.value.trim(), patient: patientName.value.trim(), date: reportDate.value, notes: notes.value };
    try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }catch(e){ console.warn('Could not save', e); }
    showToast('Saved');
  }

  function renderTests(){
    testsList.innerHTML = '';
    state.tests.forEach((t, i)=>{
      const row = document.createElement('div');
      row.className = 'test-item' + (t.done ? ' done' : '');

      const cb = document.createElement('input'); cb.type='checkbox'; cb.checked = !!t.done; cb.id = 'testcb_' + i;
      cb.addEventListener('change', ()=>{ t.done = cb.checked; row.classList.toggle('done', t.done); save(); });

      const label = document.createElement('label'); label.htmlFor = cb.id; label.textContent = t.name; label.style.cursor='pointer';
      label.addEventListener('click', ()=>{ cb.checked = !cb.checked; cb.dispatchEvent(new Event('change')); });

      const spacer = document.createElement('div'); spacer.style.flex = '1';

      const remove = document.createElement('button'); remove.className='btn ghost'; remove.type='button'; remove.textContent='Remove';
      remove.addEventListener('click', ()=>{ state.tests.splice(i,1); renderTests(); save(); });

      row.appendChild(cb); row.appendChild(label); row.appendChild(spacer); row.appendChild(remove);
      testsList.appendChild(row);
    });
  }

  function addTest(name){
    if(!name || !name.trim()) return;
    state.tests.push({ name: name.trim(), done: true });
    newTestInput.value = '';
    renderTests(); save();
  }

  function markAll(){ state.tests.forEach(t=>t.done = true); renderTests(); save(); }
  function clearAll(){ state.tests.forEach(t=>t.done = false); renderTests(); save(); }

  function generateReport(){
    const done = state.tests.filter(t=>t.done).map(t=>t.name);
    const pending = state.tests.filter(t=>!t.done).map(t=>t.name);
    const meta = { doctor: doctorName.value.trim(), patient: patientName.value.trim(), date: reportDate.value, notes: notes.value };

    const out = document.createElement('div');
    out.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <div>
          <h3>Lab Report</h3>
          <div><strong>Doctor:</strong> ${escapeHtml(meta.doctor || '')}</div>
          <div><strong>Patient:</strong> ${escapeHtml(meta.patient || '')}</div>
          <div><strong>Date:</strong> ${escapeHtml(meta.date || '')}</div>
        </div>
        <div><button id="printBtn" class="btn primary">Print</button></div>
      </div>
      <hr>
      <div style="display:flex;gap:18px;">
        <div style="flex:1">
          <h4>Completed Tests (${done.length})</h4>
          <ul>
            ${done.map(d=>`<li>${escapeHtml(d)}</li>`).join('')}
          </ul>
        </div>
        <div style="flex:1">
          <h4>Pending Tests (${pending.length})</h4>
          <ul>
            ${pending.map(d=>`<li>${escapeHtml(d)}</li>`).join('')}
          </ul>
        </div>
      </div>
      <hr>
      <div><strong>Notes / Instructions:</strong><div style="margin-top:8px">${escapeHtml(meta.notes || '')}</div></div>
    `;

    reportOutput.innerHTML = '';
    reportOutput.appendChild(out);
    reportOutput.style.display = 'block';

    // hook print
    const printBtn = qs('printBtn');
    if(printBtn) printBtn.addEventListener('click', ()=>{ window.print(); });
  }

  function escapeHtml(s){ return (s||'').toString().replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\"/g,'&quot;'); }

  function showToast(msg){
    const t = document.createElement('div');
    t.textContent = msg;
    t.style.position='fixed'; t.style.right='18px'; t.style.bottom='18px'; t.style.background='#222'; t.style.color='#fff'; t.style.padding='8px 12px'; t.style.borderRadius='8px'; t.style.boxShadow='0 6px 18px rgba(0,0,0,0.2)';
    document.body.appendChild(t);
    setTimeout(()=> t.remove(), 1600);
  }

  document.addEventListener('DOMContentLoaded', function(){
    load(); renderTests();

    addTestBtn.addEventListener('click', ()=> addTest(newTestInput.value));
    newTestInput.addEventListener('keydown', function(e){ if(e.key==='Enter'){ e.preventDefault(); addTest(newTestInput.value); } });
    markAllBtn.addEventListener('click', markAll);
    clearAllBtn.addEventListener('click', clearAll);
    saveBtn.addEventListener('click', save);
    generateBtn.addEventListener('click', generateReport);
  });
})();
