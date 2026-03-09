
'use strict';

// ─────────────────────────────────────────────────────────────────
//  BOOKING MODAL  —  public/js/booking.js
//  Depends on: courses.js (defines window.COURSES)
// ─────────────────────────────────────────────────────────────────

const LOCATION = 'Dunfermline, Scotland';

let activeCourse = null;
let activeDate   = null;

// ─────────────────────────────────────────────────────────────────
//  SCREEN MANAGER
//  step1 / step2 use .active class (modal-step)
//  screenProcessing / screenSuccess / screenCancelled use display
// ─────────────────────────────────────────────────────────────────
function showScreen(id) {
  const stepIds   = ['step1', 'step2'];
  const screenIds = ['screenProcessing', 'screenSuccess', 'screenCancelled'];

  stepIds.forEach(sid => {
    const el = document.getElementById(sid);
    if (!el) return;
    el.classList.toggle('active', sid === id);
  });

  screenIds.forEach(sid => {
    const el = document.getElementById(sid);
    if (!el) return;
    el.style.display = (sid === id) ? 'block' : 'none';
  });

  const box = document.querySelector('.modal-box');
  if (box) box.scrollTop = 0;
}

// ─────────────────────────────────────────────────────────────────
//  OPEN MODAL  — called by onclick="openCourseModal('key')"
// ─────────────────────────────────────────────────────────────────
function openCourseModal(key) {
  if (typeof COURSES === 'undefined') {
    console.error('COURSES not defined — ensure courses.js loads before booking.js');
    return;
  }
  activeCourse = COURSES[key];
  if (!activeCourse) { console.error('Unknown course key:', key); return; }

  document.getElementById('mTag').textContent  = activeCourse.tag;
  document.getElementById('mName').textContent = activeCourse.name;
  document.getElementById('mDesc').textContent = activeCourse.desc;

  document.getElementById('mFeatures').innerHTML = activeCourse.features
    .filter(f => f.trim())
    .map(f => `<div class="modal-feat"><i class="fa fa-check"></i>${f}</div>`)
    .join('');

  document.getElementById('mDates').innerHTML = activeCourse.dates.map((d, i) => `
    <div class="date-row">
      <div class="date-row-info">
        <div class="date-row-icon"><i class="fa fa-calendar"></i></div>
        <div>
          <div class="date-label">${d.label}, 2026</div>
          <div class="date-meta">${d.duration} &bull; ${LOCATION}</div>
        </div>
      </div>
      <span class="date-spots ${d.low ? 'low' : ''}">${d.spots}</span>
      <button class="btn-book" onclick="selectDate(${i})">Book Now</button>
    </div>`).join('');

  showScreen('step1');
  document.getElementById('courseModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

// ─────────────────────────────────────────────────────────────────
//  DATE SELECTION  — called by onclick="selectDate(i)"
// ─────────────────────────────────────────────────────────────────
function selectDate(i) {
  activeDate = activeCourse.dates[i];
  document.getElementById('bsCourse').textContent    = activeCourse.name;
  document.getElementById('bsDate').textContent      = `${activeDate.label}, 2026 \u2022 ${activeDate.duration}`;
  document.getElementById('bsPrice').textContent     = activeCourse.price;
  document.getElementById('totalAmount').textContent = activeCourse.price;
  document.getElementById('regSubtitle').textContent = `${activeCourse.name} \u2014 ${activeDate.label}, 2026`;
  hidePayError();
  showScreen('step2');
}

// ─────────────────────────────────────────────────────────────────
//  CLOSE MODAL
// ─────────────────────────────────────────────────────────────────
function closeModal() {
  const modal = document.getElementById('courseModal');
  if (modal) modal.classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(() => {
    ['regFirst','regLast','regEmail','regPhone','regNotes'].forEach(id => {
      const el = document.getElementById(id);
      if (el) { el.value = ''; el.classList.remove('field-error'); }
    });
    hidePayError();
    showScreen('step1');
  }, 320);
}

// ─────────────────────────────────────────────────────────────────
//  ERROR BANNER
// ─────────────────────────────────────────────────────────────────
function showPayError(msg) {
  const box = document.getElementById('payErrorBox');
  const txt = document.getElementById('payErrorMsg');
  if (!box || !txt) return;
  txt.textContent   = msg;
  box.style.display = 'flex';
  const modalBox = document.querySelector('.modal-box');
  if (modalBox) modalBox.scrollTop = 9999;
}

function hidePayError() {
  const box = document.getElementById('payErrorBox');
  if (box) box.style.display = 'none';
}

// ─────────────────────────────────────────────────────────────────
//  PAYMENT HANDLER  — onclick="handleRegisterPay()"
// ─────────────────────────────────────────────────────────────────
async function handleRegisterPay() {
  hidePayError();
  if (!activeCourse || !activeDate) { showPayError('No course selected. Please start again.'); return; }

  const fields = ['regFirst','regLast','regEmail','regPhone'];
  let valid = true;
  fields.forEach(id => {
    const el = document.getElementById(id);
    const empty = !el.value.trim();
    el.classList.toggle('field-error', empty);
    if (empty) valid = false;
  });
  if (!valid) { showPayError('Please fill in all required fields.'); return; }

  const courseKey = Object.keys(COURSES).find(k => COURSES[k] === activeCourse) || '';

  const payload = {
    courseKey,
    course   : activeCourse.name,
    price    : activeCourse.priceNum,
    date     : `${activeDate.label}, 2026`,
    duration : activeDate.duration,
    location : LOCATION,
    customer : {
      firstName : document.getElementById('regFirst').value.trim(),
      lastName  : document.getElementById('regLast').value.trim(),
      email     : document.getElementById('regEmail').value.trim(),
      phone     : document.getElementById('regPhone').value.trim(),
      notes     : (document.getElementById('regNotes').value || '').trim()
    }
  };

  showScreen('screenProcessing');

  try {
    const res = await fetch('/.netlify/functions/create-checkout', {
      method  : 'POST',
      headers : { 'Content-Type': 'application/json' },
      body    : JSON.stringify(payload)
    });
    if (!res.ok) {
      let errMsg = 'Server error ' + res.status;
      try { const e = await res.json(); errMsg = e.error || errMsg; } catch(_) {}
      throw new Error(errMsg);
    }
    const data = await res.json();
    if (!data.url) throw new Error('No checkout URL returned. Please try again.');
    window.location.href = data.url;
  } catch (err) {
    console.error('[booking] payment error:', err.message);
    showScreen('step2');
    showPayError(err.message || 'Payment failed. Please try again.');
  }
}

// ─────────────────────────────────────────────────────────────────
//  STRIPE RETURN HANDLER  (?booking=success|cancel in URL)
// ─────────────────────────────────────────────────────────────────
(function handleStripeReturn() {
  const params = new URLSearchParams(window.location.search);
  const status = params.get('booking');
  if (!status) return;

  window.history.replaceState({}, '', window.location.pathname);

  function openOnReturn() {
    const modal = document.getElementById('courseModal');
    if (!modal) return;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';

    if (status === 'success') {
      const emailEl = document.getElementById('successEmailEl');
      if (emailEl) emailEl.textContent = decodeURIComponent(params.get('email') || 'your email address');
      showScreen('screenSuccess');
    } else {
      showScreen('screenCancelled');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', openOnReturn);
  } else {
    openOnReturn();
  }
})();

// ─────────────────────────────────────────────────────────────────
//  DOM-READY LISTENERS
// ─────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

  const modal = document.getElementById('courseModal');

  document.getElementById('modalClose')
    ?.addEventListener('click', closeModal);

  document.getElementById('modalBack')
    ?.addEventListener('click', () => showScreen('step1'));

  modal?.addEventListener('click', e => { if (e.target === modal) closeModal(); });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal?.classList.contains('open')) closeModal();
  });

  // Footer year
  const yearEl = document.getElementById('footerYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Counter animations
  const counters = document.querySelectorAll('[data-target]');
  let ranCounters = false;
  if (counters.length) {
    const cntObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting && !ranCounters) {
          ranCounters = true;
          counters.forEach(el => {
            const target = parseInt(el.dataset.target, 10);
            const start  = performance.now(), dur = 1800;
            (function step(now) {
              const p = Math.min((now - start) / dur, 1);
              el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * target);
              if (p < 1) requestAnimationFrame(step);
            })(start);
          });
        }
      });
    }, { threshold: 0.4 });
    cntObs.observe(counters[0].closest('section') || counters[0]);
  }

  // Contact form
  const cForm = document.getElementById('contactForm');
  const cToast = document.getElementById('form-toast');
  if (cForm && cToast) {
    cForm.addEventListener('submit', e => {
      e.preventDefault();
      let ok = true;
      cForm.querySelectorAll('[required]').forEach(f => {
        if (!f.value.trim()) { f.style.borderColor = '#e74c3c'; ok = false; }
        else f.style.borderColor = '';
      });
      if (!ok) return;
      cToast.style.display = 'block';
      cForm.reset();
      setTimeout(() => { cToast.style.display = 'none'; }, 5000);
    });
  }

  // Hero scroll arrow
  document.getElementById('heroScroll')?.addEventListener('click', () => {
    const target = document.querySelector('#services-strip') || document.querySelector('section');
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });

});


// const LOCATION = "Dunfermline, Scotland";

// let activeCourse = null;
// let activeDate = null;

// function openCourseModal(key) {

//   activeCourse = COURSES[key];
//   if (!activeCourse) return;

//   document.getElementById("mTag").textContent = activeCourse.tag;
//   document.getElementById("mName").textContent = activeCourse.name;
//   document.getElementById("mDesc").textContent = activeCourse.desc;

//   document.getElementById("mFeatures").innerHTML =
//     activeCourse.features
//       .map(f => `<div class="modal-feat"><i class="fa fa-check"></i>${f}</div>`)
//       .join("");

//   document.getElementById("mDates").innerHTML =
//     activeCourse.dates.map((d,i)=>`

//       <div class="date-row">

//         <div class="date-row-info">
//           <div class="date-row-icon">
//             <i class="fa fa-calendar"></i>
//           </div>

//           <div>
//             <div class="date-label">${d.label}, 2026</div>
//             <div class="date-meta">${d.duration} • ${LOCATION}</div>
//           </div>
//         </div>

//         <span class="date-spots ${d.low ? "low" : ""}">
//           ${d.spots}
//         </span>

//         <button class="btn-book" onclick="selectDate(${i})">
//           Book Now
//         </button>

//       </div>
//     `).join("");

//   goToStep(1);

//   document.getElementById("courseModal").classList.add("open");
//   document.body.style.overflow = "hidden";
// }


// function selectDate(i){

//   activeDate = activeCourse.dates[i];

//   document.getElementById("bsCourse").textContent = activeCourse.name;

//   document.getElementById("bsDate").textContent =
//     activeDate.label + ", 2026 • " + activeDate.duration;

//   document.getElementById("bsPrice").textContent = activeCourse.price;

//   document.getElementById("totalAmount").textContent =
//     activeCourse.price;

//   document.getElementById("regSubtitle").textContent =
//     activeCourse.name + " — " + activeDate.label + ", 2026";

//   goToStep(2);
// }


// function goToStep(n){

//   document.getElementById("step1")
//     .classList.toggle("active", n === 1);

//   document.getElementById("step2")
//     .classList.toggle("active", n === 2);

//   document.getElementById("modalSuccess")
//     .classList.remove("active");

//   document.querySelector(".modal-box").scrollTop = 0;
// }


// async function handleRegisterPay(){

//     if(!activeCourse || !activeDate){
//     alert("Please select a course date.");
//     return;
//   }

//   const required = ["regFirst","regLast","regEmail","regPhone"];

//   let valid = true;

//   required.forEach(id=>{
//     const el = document.getElementById(id);

//     if(!el.value.trim()){
//       el.classList.add("field-error");
//       valid = false;
//     } else {
//       el.classList.remove("field-error");
//     }
//   });

//   if(!valid) return;

//   const payload = {

//     course: activeCourse.name,
//     price: activeCourse.priceNum,
//     date: activeDate.label,

//     customer:{
//       firstName: document.getElementById("regFirst").value,
//       lastName: document.getElementById("regLast").value,
//       email: document.getElementById("regEmail").value,
//       phone: document.getElementById("regPhone").value
//     }

//   };

//   try{

//     const res = await fetch("/.netlify/functions/create-checkout",{

//       method:"POST",
//       headers:{ "Content-Type":"application/json" },
//       body:JSON.stringify(payload)

//     });

//     const data = await res.json();

//     if(data.url){
//       window.location.href = data.url;
//     }else{
//       alert("Unable to start payment.");
//     }

//   }catch(err){

//     console.error(err);
//     alert("Payment error.");

//   }

// }


// function closeModal(){

//   document.getElementById("courseModal").classList.remove("open");
//   document.body.style.overflow = "";

// }