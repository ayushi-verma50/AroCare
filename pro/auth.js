// pro/auth.js — simple client-side sign-in (demo)
(function(){
  const MODAL_ID = 'signinModal';
  const STORAGE_KEY = 'pro_user_v1';

  function qs(id){ return document.getElementById(id); }

  function openModal(){
    const m = qs(MODAL_ID);
    if(!m) return;
    m.style.display = 'flex';
    m.setAttribute('aria-hidden','false');
    qs('siName').focus();
  }
  function closeModal(){
    const m = qs(MODAL_ID);
    if(!m) return;
    m.style.display = 'none';
    m.setAttribute('aria-hidden','true');
  }

  function saveUser(u){
    try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(u)); }catch(e){}
  }
  function clearUser(){
    try{ localStorage.removeItem(STORAGE_KEY); }catch(e){}
  }
  function loadUser(){
    try{ const raw = localStorage.getItem(STORAGE_KEY); return raw?JSON.parse(raw):null; }catch(e){ return null; }
  }

  function updateNav(user){
    const nav = qs('navSignin');
    if(!nav) return;
    if(user){
      nav.querySelector('.greeting').textContent = 'Hello,';
      nav.querySelector('.greet-action').textContent = user.name || user.email || 'User';
      nav.classList.add('signed-in');
      nav.setAttribute('title','Click to sign out');
    } else {
      nav.querySelector('.greeting').textContent = 'Hello,';
      nav.querySelector('.greet-action').textContent = 'Sign in';
      nav.classList.remove('signed-in');
      nav.setAttribute('title','Sign in');
    }
  }

  function init(){
    const nav = qs('navSignin');
    const modal = qs(MODAL_ID);
    if(!nav || !modal) return;

    // close buttons
    modal.querySelector('.signin-close').addEventListener('click', closeModal);
    qs('siCancel').addEventListener('click', closeModal);

    // open modal
    nav.addEventListener('click', function(){
      const user = loadUser();
      if(user){
        // if signed in, act as sign out
        if(confirm('Sign out ' + (user.name||user.email) + '?')){
          clearUser(); updateNav(null);
        }
      } else {
        openModal();
      }
    });

    // form submit
    qs('signinForm').addEventListener('submit', function(e){
      e.preventDefault();
      const name = qs('siName').value.trim();
      const email = qs('siEmail').value.trim();
      if(!name || !email){ alert('Please provide name and email'); return; }
      const user = { name, email };
      saveUser(user); updateNav(user); closeModal();
    });

    // ESC to close
    document.addEventListener('keydown', function(e){ if(e.key==='Escape'){ closeModal(); } });

    // initial state
    const existing = loadUser();
    updateNav(existing);
  }

  document.addEventListener('DOMContentLoaded', init);
})();
