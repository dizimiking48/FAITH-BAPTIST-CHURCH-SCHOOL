/*
  script.js
  Attach this file to your HTML pages. Expected minimal HTML structure & CSS hooks:
  - <button id="theme-toggle"> to toggle dark/light
  - <button id="menu-toggle"> to toggle mobile nav
  - <nav id="site-nav"> with links .nav-link
  - <form id="contact-form"> with inputs[name="name"], [name="email"], textarea[name="message"]
  - Image gallery: <img class="gallery-item" src="..." alt="...">
  - Modal: <div id="img-modal" class="hidden"><button id="modal-close">×</button><img id="modal-img"></div>
  - CSS should use [data-theme="dark"] and [data-theme="light"] for theme vars and .open/.hidden classes for visibility
*/

(function () {
  'use strict';

  // --- Utilities ---
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const isEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

  // --- Theme toggle (persisted) ---
  const THEME_KEY = 'site-theme';
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    const btn = $('#theme-toggle');
    if (btn) btn.setAttribute('aria-pressed', String(theme === 'dark'));
  }
  function initTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(saved || (prefersDark ? 'dark' : 'light'));
    const btn = $('#theme-toggle');
    if (btn) btn.addEventListener('click', () => applyTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'));
  }

  // --- Mobile menu toggle ---
  function initMenu() {
    const menuBtn = $('#menu-toggle');
    const nav = $('#site-nav');
    if (!menuBtn || !nav) return;
    menuBtn.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', String(open));
    });
    // Close menu when a nav link is clicked (mobile)
    $$('.nav-link', nav).forEach(link => link.addEventListener('click', () => nav.classList.remove('open')));
  }

  // --- Smooth scrolling for internal anchors ---
  function initSmoothScroll() {
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.pushState(null, '', '#' + id);
    });
  }

  // --- Simple contact form validation & submit (AJAX placeholder) ---
  function initContactForm() {
    const form = $('#contact-form');
    if (!form) return;
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = form.querySelector('[name="name"]')?.value?.trim() || '';
      const email = form.querySelector('[name="email"]')?.value?.trim() || '';
      const message = form.querySelector('[name="message"]')?.value?.trim() || '';
      const errors = [];
      if (!name) errors.push('Name is required');
      if (!email || !isEmail(email)) errors.push('Valid email is required');
      if (!message || message.length < 10) errors.push('Message must be at least 10 characters');
      // Remove previous errors
      let errEl = $('#form-errors');
      if (!errEl) {
        errEl = document.createElement('div');
        errEl.id = 'form-errors';
        errEl.setAttribute('role', 'alert');
        form.prepend(errEl);
      }
      if (errors.length) {
        errEl.textContent = errors.join('. ');
        return;
      }
      // Simulated submit (replace with fetch to your endpoint)
      try {
        // Show a simple submitting state
        const submitBtn = form.querySelector('[type="submit"]');
        if (submitBtn) submitBtn.disabled = true;
        // Example: await fetch('/api/contact', { method: 'POST', body: JSON.stringify({ name, email, message }) });
        console.log('Form submitted:', { name, email, message });
        form.reset();
        errEl.textContent = 'Message sent. Thank you!';
      } catch (err) {
        errEl.textContent = 'Submission failed. Please try later.';
      } finally {
        const submitBtn = form.querySelector('[type="submit"]');
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }

  // --- Image gallery modal ---
  function initGalleryModal() {
    const modal = $('#img-modal');
    const modalImg = $('#modal-img');
    const closeBtn = $('#modal-close');

    if (!modal || !modalImg) return;

    function open(src, alt = '') {
      modalImg.src = src;
      modalImg.alt = alt;
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
      closeBtn?.focus();
    }
    function close() {
      modal.classList.add('hidden');
      modalImg.src = '';
      document.body.style.overflow = '';
    }

    $$('.gallery-item').forEach(img => {
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', () => open(img.src, img.alt));
      img.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') open(img.src, img.alt); });
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target === closeBtn) close();
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
  }

  // --- Init all on DOM ready ---
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initMenu();
    initSmoothScroll();
    initContactForm();
    initGalleryModal();
  });

})();

const elements = document.querySelectorAll('.fade-in');

window.addEventListener('scroll', () => {
  elements.forEach(el => {
    if (el.getBoundingClientRect().top < window.innerHeight) {
      el.classList.add('show');
    }
  });
});