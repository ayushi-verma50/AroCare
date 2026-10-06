// pro/doctor.js — render doctor details page
function qs(name){
  const params = new URLSearchParams(location.search);
  return params.get(name);
}

document.addEventListener('DOMContentLoaded', function(){
  const id = qs('id');
  // wait for proCards to be available (cards.js sets window.proCards)
  function render(){
    const detail = document.getElementById('doctorDetail');
    const notFound = document.getElementById('notFound');
    if(!window.proCards){
      // if cards.js not loaded yet, try again shortly
      setTimeout(render, 50);
      return;
    }
    const doctors = proCards.doctors || [];
    const doc = doctors.find(d=>String(d.id) === String(id));
    if(!doc){
      detail.style.display = 'none';
      notFound.style.display = 'block';
      return;
    }
    // fill fields
    const photo = document.getElementById('docPhoto');
    const nameEl = document.getElementById('docName');
    const spec = document.getElementById('docSpecialty');
    const phone = document.getElementById('docPhone');
    const exp = document.getElementById('docExperience');
    const avail = document.getElementById('docAvailability');

    photo.src = doc.photo || doc.avatar || '';
    photo.alt = doc.name || 'Doctor photo';
    nameEl.textContent = doc.name || '';
    spec.textContent = doc.specialty || '';
    phone.innerHTML = '<strong>Contact:</strong> ' + (doc.phone || 'N/A');
    exp.innerHTML = '<strong>Experience:</strong> ' + (doc.experience || 'N/A');
    avail.innerHTML = '<strong>Available:</strong> ' + (doc.availability || 'N/A');

    // Book button demo
    document.getElementById('bookBtn').addEventListener('click', function(){
      alert('Booking appointment (demo) with ' + (doc.name || 'this doctor'));
    });
  }
  render();
});
