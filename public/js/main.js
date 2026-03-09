'use strict';

// ─────────────────────────────────────────────
//  MAIN UI  —  public/js/main.js
//  Nav toggle + mobile menu + scroll reveal
// ─────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {

  // ── Mobile nav toggle ──────────────────────
  const navToggle = document.getElementById('navToggle');
  const mobileNav = document.getElementById('mobile-nav');

  if (navToggle && mobileNav) {

    navToggle.addEventListener('click', () => {
      const open = mobileNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', open);
      mobileNav.setAttribute('aria-hidden', !open);

      const spans = navToggle.querySelectorAll('span');
      spans[0].style.transform = open ? 'rotate(45deg) translate(5px,5px)' : '';
      spans[1].style.opacity   = open ? '0' : '';
      spans[2].style.transform = open ? 'rotate(-45deg) translate(5px,-5px)' : '';
    });

    mobileNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        mobileNav.setAttribute('aria-hidden', 'true');
        navToggle.querySelectorAll('span').forEach(s => s.removeAttribute('style'));
      });
    });
  }

  // ── Scroll reveal ──────────────────────────
  const revObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => revObs.observe(el));

});



// document.addEventListener("DOMContentLoaded", () => {

//   const navToggle = document.getElementById("navToggle");
//   const mobileNav = document.getElementById("mobile-nav");

//   if(navToggle && mobileNav){

//     navToggle.addEventListener("click", () => {

//       const open = mobileNav.classList.toggle("open");

//       navToggle.setAttribute("aria-expanded", open);
//       mobileNav.setAttribute("aria-hidden", !open);

//     });

//     mobileNav.querySelectorAll("a").forEach(a => {

//       a.addEventListener("click", () => {

//         mobileNav.classList.remove("open");
//         navToggle.setAttribute("aria-expanded","false");
//         mobileNav.setAttribute("aria-hidden","true");

//       });

//     });

//   }

//   const revObs = new IntersectionObserver(entries => {

//     entries.forEach(e => {

//       if(e.isIntersecting){

//         e.target.classList.add("visible");
//         revObs.unobserve(e.target);

//       }

//     });

//   },{ threshold:0.1 });

//   document.querySelectorAll(".reveal")
//     .forEach(el => revObs.observe(el));

// });