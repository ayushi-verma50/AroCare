

const doctors = [
  {
    id: 'd1',
    name: 'Dr. Ashok Kumar',
    specialty: 'Cardiologist',
    phone: '+911234567890',
    experience: '12 years',
    availability: 'Mon-Fri 10:00 - 14:00',
    photo: 'images/d1.jpg'
  },
  {
    id: 'd2',
    name: 'Dr. Meera Singh',
    specialty: 'Neurologist',
    phone: '+919876543210',
    experience: '9 years',
    availability: 'Tue/Thu 14:00 - 18:00',
    photo: 'images/d2.jpg'
  },
  {
    id: 'd3',
    name: 'Dr. Ramesh Verma',
    specialty: 'Pediatrics',
    phone: '+919112223334',
    experience: '15 years',
    availability: 'Sat 09:00 - 13:00',
    photo: 'images/d3.jpg'
  },
  {
    id: 'd4',
    name: 'Dr. Sima Patel',
    specialty: 'Orthopedic',
    phone: '+919998887776',
    experience: '8 years',
    availability: 'Mon/Wed/Fri 11:00 - 16:00',
    photo: 'images/d4.jpg'
  }
];

function createDoctorCard(doc) {
  const article = document.createElement('article');
  article.className = 'doctor-card';
  article.dataset.id = doc.id;

  const img = document.createElement('img');
  img.className = 'doc-photo';
  img.src = doc.photo;
  img.alt = doc.name;

  // wrap the photo so we can add an animated background / glow
  const photoWrap = document.createElement('div');
  photoWrap.className = 'photo-wrap';
  photoWrap.appendChild(img);

  const h3 = document.createElement('h3');
  h3.textContent = doc.name;

  const sp = document.createElement('p');
  sp.className = 'specialty';
  sp.textContent = doc.specialty;

  const actions = document.createElement('div');
  actions.className = 'card-actions';

  const viewBtn = document.createElement('button');
  viewBtn.className = 'view-btn';
  const viewLink = document.createElement('a');
  viewLink.className = 'view-btn';
  viewLink.textContent = 'View';
  viewLink.href = 'doctor.html?id=' + encodeURIComponent(doc.id);

  const callLink = document.createElement('a');
  callLink.className = 'call-btn';
  callLink.href = 'tel:' + doc.phone;
  callLink.textContent = 'Call';

  actions.appendChild(viewLink);
  actions.appendChild(callLink);

  const details = document.createElement('div');
  details.className = 'details';
  details.hidden = true;
  details.innerHTML = `
    <p><strong>Contact:</strong> ${doc.phone}</p>
    <p><strong>Experience:</strong> ${doc.experience}</p>
    <p><strong>Available:</strong> ${doc.availability}</p>
    <div style="margin-top:8px;"><button class="appt-btn">Book Appointment</button></div>
  `;

  article.appendChild(photoWrap);
  article.appendChild(h3);
  article.appendChild(sp);
  article.appendChild(actions);
  article.appendChild(details);

  return article;
}

function renderDoctors(selector = '.doctor-grid', list = doctors) {
  const container = document.querySelector(selector);
  if (!container) return;
  container.innerHTML = ''; 
  const fragment = document.createDocumentFragment();
  list.forEach(doc => {
    fragment.appendChild(createDoctorCard(doc));
  });
  container.appendChild(fragment);
}

function attachDoctorHandlers(rootSelector = '.doctor-grid') {
  const root = document.querySelector(rootSelector);
  if (!root) return;

  root.addEventListener('click', function (e) {
    if (e.target.matches('.view-btn')) {
      const card = e.target.closest('.doctor-card');
      if (!card) return;
      const details = card.querySelector('.details');
      const btn = e.target;
      if (details.hidden) {
        details.hidden = false;
        btn.textContent = 'Close';
      } else {
        details.hidden = true;
        btn.textContent = 'View';
      }
    }

    if (e.target.matches('.appt-btn')) {
      const card = e.target.closest('.doctor-card');
      const name = card ? (card.querySelector('h3') || {}).textContent : 'Doctor';
      alert('Booking appointment with ' + name + ' (demo).');
    }
  });
}

document.addEventListener('DOMContentLoaded', function () {
  renderDoctors('.doctor-grid');
  attachDoctorHandlers('.doctor-grid');
});

window.proCards = {
  doctors,
  renderDoctors,
  attachDoctorHandlers
};
