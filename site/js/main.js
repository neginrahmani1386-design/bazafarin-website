/* ==========================================================================
   باز آفرین ایده — GK  ·  main.js
   Mobile nav, scroll-reveal, footer year, contact-form validation
   ========================================================================== */
(function () {
  'use strict';

  /* --- mobile nav toggle --- */
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    // close menu when a link is tapped (mobile)
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        links.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* --- current year in footer --- */
  var yr = document.querySelectorAll('[data-year]');
  var y = new Date().getFullYear();
  // Persian (Solar Hijri) year, computed from Gregorian
  var faYear = new Intl.DateTimeFormat('fa-IR-u-nu-latn', { year: 'numeric' }).format(new Date());
  yr.forEach(function (el) { el.textContent = faYear + ' / ' + y; });

  /* --- scroll reveal --- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* --- contact form: validate, then submit via FormSubmit --- */
  var form = document.querySelector('#contact-form');
  if (form) {
    var statusEl = form.querySelector('.form-status');
    var nextInput = form.querySelector('input[name="_next"]');

    if (nextInput) {
      nextInput.value = window.location.href.split('?')[0] + '?success=1';
    }

    if (window.location.search.indexOf('success=1') !== -1 && statusEl) {
      statusEl.className = 'form-status ok';
      statusEl.textContent = 'پیام شما با موفقیت ارسال شد. به‌زودی با شما تماس می‌گیریم.';
    }

    var validators = {
      name: function (v) { return v.trim().length >= 2; },
      phone: function (v) { return /^(\+98|0)9\d{9}$/.test(v.replace(/[\s-]/g, '')); },
      email: function (v) { return v === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); },
      message: function (v) { return v.trim().length >= 5; }
    };

    function setInvalid(field, bad) {
      var wrap = field.closest('.field');
      if (wrap) wrap.classList.toggle('invalid', bad);
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      Object.keys(validators).forEach(function (key) {
        var field = form.elements[key];
        if (!field) return;
        var valid = validators[key](field.value);
        setInvalid(field, !valid);
        if (!valid) ok = false;
      });

      if (!ok) {
        if (statusEl) {
          statusEl.className = 'form-status';
          statusEl.textContent = '';
        }
        return;
      }

      if (statusEl) {
        statusEl.className = 'form-status';
        statusEl.textContent = 'در حال ارسال…';
      }

      if (nextInput) {
        nextInput.value = window.location.href.split('?')[0] + '?success=1';
      }

      form.submit();
    });

    form.querySelectorAll('input, textarea').forEach(function (el) {
      el.addEventListener('input', function () { setInvalid(el, false); });
    });
  }

  /* --- home / studies view switching (index only) --- */
  var viewHome = document.getElementById('view-home');
  var viewStudies = document.getElementById('view-studies');
  if (viewHome && viewStudies) {
    var navViewLinks = document.querySelectorAll('[data-view]');

    function setNavActive(viewName) {
      navViewLinks.forEach(function (link) {
        link.classList.toggle('active', link.getAttribute('data-view') === viewName);
      });
    }

    function showView(name) {
      var isStudies = name === 'studies';
      viewHome.classList.toggle('is-active', !isStudies);
      viewStudies.classList.toggle('is-active', isStudies);
      setNavActive(name);
      window.scrollTo({ top: 0, behavior: 'smooth' });

      if (isStudies) {
        viewStudies.querySelectorAll('.reveal:not(.in)').forEach(function (el) {
          el.classList.add('in');
        });
      }

      var url = new URL(window.location.href);
      if (isStudies) {
        url.searchParams.set('view', 'studies');
      } else {
        url.searchParams.delete('view');
      }
      var qs = url.searchParams.toString();
      history.replaceState({ view: name }, '', url.pathname + (qs ? '?' + qs : '') + url.hash);
    }

    if (new URLSearchParams(window.location.search).get('view') === 'studies') {
      showView('studies');
    }

    document.querySelectorAll('[data-view]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var view = link.getAttribute('data-view');
        if (view !== 'home' && view !== 'studies') return;
        e.preventDefault();
        showView(view);
      });
    });

    window.addEventListener('popstate', function () {
      var p = new URLSearchParams(window.location.search);
      showView(p.get('view') === 'studies' ? 'studies' : 'home');
    });
  }

  /* --- clinical case study filters --- */
  var filterWrap = document.querySelector('#view-studies .case-filters');
  if (filterWrap) {
    var filterBtns = filterWrap.querySelectorAll('.filter-btn');
    var caseCards = document.querySelectorAll('#view-studies .case-card');

    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var filter = btn.getAttribute('data-filter');
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');

        caseCards.forEach(function (card) {
          var category = card.getAttribute('data-category');
          var show = filter === 'all' || category === filter;
          card.classList.toggle('is-hidden', !show);
        });
      });
    });
  }
})();
