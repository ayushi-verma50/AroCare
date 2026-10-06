
function ready(fn){
  if(document.readyState !== 'loading') return fn();
  document.addEventListener('DOMContentLoaded', fn);
}

ready(function(){
  if(!window.proCards){
    console.warn('proCards (cards.js) not available. Ensure cards.js is loaded before script.js');
    return;
  }

  const allDoctors = proCards.doctors || [];
  const select = document.querySelector('.nav-search .search');
  const input = document.querySelector('.nav-search .search-input');
  const gridSelector = '.doctor-grid';

  function normalize(s){ return (s||'').toString().trim().toLowerCase(); }

  function applyFilters(){
    const specialty = (select && select.value) ? normalize(select.value) : 'all';
    const q = input ? normalize(input.value) : '';

    let filtered = allDoctors.slice();
    if(specialty && specialty !== 'all'){
      filtered = filtered.filter(d => normalize(d.specialty).includes(specialty));
    }
    if(q){
      filtered = filtered.filter(d => normalize(d.name).includes(q) || normalize(d.specialty).includes(q) || (d.phone||'').includes(q));
    }

    proCards.renderDoctors(gridSelector, filtered);
  }

  if(select) select.addEventListener('change', applyFilters);
  if(input) input.addEventListener('input', debounce(applyFilters, 200));

  function debounce(fn, wait){
    let t;
    return function(){
      clearTimeout(t);
      const args = arguments;
      t = setTimeout(() => fn.apply(this, args), wait);
    }
  }
  applyFilters();

  document.addEventListener('keydown', function(e){
    if(e.key === '/' && document.activeElement !== input){
      if(input){ input.focus(); e.preventDefault(); }
    }
  });
  function createModalElement(){
    const overlay = document.createElement('div');
    overlay.className = 'doctor-modal-overlay';
    overlay.innerHTML = `
      <div class="doctor-modal" role="dialog" aria-modal="true">
        <button class="modal-close" aria-label="Close">&times;</button>
            <div class="modal-body">
              <div class="photo-wrap modal-wrap"><img class="modal-photo" src="" alt="Doctor photo"></div>
              <div class="modal-info">
            <h3 class="modal-name"></h3>
            <p class="modal-specialty"></p>
            <p class="modal-phone"></p>
            <p class="modal-experience"></p>
            <p class="modal-availability"></p>
            <div class="modal-actions"><button class="modal-book">Book Appointment</button></div>
          </div>
        </div>
      </div>`;

    document.body.appendChild(overlay);

    // close handlers
    overlay.querySelector('.modal-close').addEventListener('click', ()=> overlay.remove());
    overlay.addEventListener('click', (e)=> { if(e.target === overlay) overlay.remove(); });

    // booking from modal
    overlay.querySelector('.modal-book').addEventListener('click', ()=>{
      const id = overlay.dataset.doc;
      const doc = allDoctors.find(d=>d.id == id);
      if(doc){
        alert('Booking appointment with ' + doc.name + ' (demo).');
      }
    });

    return overlay;
  }

  let modalEl = null;
  function showDoctorModal(doc){
    if(!modalEl) modalEl = createModalElement();
    modalEl.dataset.doc = doc.id;
    const photoSrc = doc.photo || doc.avatar || '';
    modalEl.querySelector('.modal-photo').src = photoSrc;
    modalEl.querySelector('.modal-photo').alt = doc.name;
    modalEl.querySelector('.modal-name').textContent = doc.name;
    modalEl.querySelector('.modal-specialty').textContent = doc.specialty || '';
    modalEl.querySelector('.modal-phone').textContent = 'Contact: ' + (doc.phone || 'N/A');
    modalEl.querySelector('.modal-experience').textContent = 'Experience: ' + (doc.experience || 'N/A');
    modalEl.querySelector('.modal-availability').textContent = 'Available: ' + (doc.availability || 'N/A');
    modalEl.style.display = 'flex';
  }

  // open modal when user clicks a view button inside a rendered card
  document.addEventListener('click', function(e){
    const btn = e.target.closest('.view-btn');
    if(!btn) return;
    const card = btn.closest('.doctor-card');
    if(!card) return;
    const id = card.dataset.id;
    const doc = allDoctors.find(d=>d.id == id);
    if(doc) showDoctorModal(doc);
  });

  // Expose for debugging
  window.proUI = { applyFilters, showDoctorModal };
});
