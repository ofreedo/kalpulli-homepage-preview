(function(){
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Coatl (serpent/movement): fixed seal watermark should only read as visible
  // when a plain-cream section is actually sitting behind its fixed on-screen
  // position — showing it any time the user has merely scrolled past a single
  // marker caused it to "turn on" while a dark/red opaque section (or the hero)
  // was still occupying that spot, since the seal's screen position never
  // moves but the page content sliding underneath it does. Checked via plain
  // getBoundingClientRect() math against every [data-seal-cream] section
  // (an allowlist, not a blacklist of known-opaque sections, so a new section
  // added later defaults to hidden instead of silently leaking the seal) —
  // deliberately NOT elementFromPoint, which forces a synchronous layout on
  // every call and caused visible scroll jank on iOS Safari when run every
  // rAF tick during a scroll gesture.
  //
  // Also gated on having fully scrolled past the "Meaning of the Name"
  // section: the seal is the same serpent glyph explained there, so
  // revealing it before that section (e.g. behind the Mission heading) reads
  // as visual noise rather than a payoff. It stays gated even on the way back
  // up — only counts as "past" once .meaning has fully scrolled off the top.
  var sealWatermark = document.getElementById('sealWatermark');
  var sealMeaningSection = document.querySelector('.meaning');
  var sealCreamSections = Array.prototype.slice.call(document.querySelectorAll('[data-seal-cream]'));
  if (sealWatermark) {
    var sealTicking = false;
    function updateSealVisibility(){
      var pastMeaning = !sealMeaningSection || sealMeaningSection.getBoundingClientRect().bottom <= 0;
      var cy = window.innerHeight / 2;
      var onCream = sealCreamSections.some(function(section){
        var rect = section.getBoundingClientRect();
        return rect.top <= cy && rect.bottom >= cy;
      });
      var isVisible = pastMeaning && onCream;
      sealWatermark.classList.toggle('is-visible', isVisible);
      sealTicking = false;
    }
    updateSealVisibility();
    window.addEventListener('scroll', function(){
      if (!sealTicking) {
        requestAnimationFrame(updateSealVisibility);
        sealTicking = true;
      }
    }, {passive: true});
    window.addEventListener('resize', updateSealVisibility);
  }

  // Mobile hamburger nav: open/close via button, scrim, close button, or Escape
  var hamburgerBtn = document.getElementById('hamburgerBtn');
  var mobileNav = document.getElementById('mobileNav');
  var mobileNavClose = document.getElementById('mobileNavClose');
  var navScrim = document.getElementById('navScrim');

  function openMobileNav(){
    mobileNav.classList.add('is-open');
    navScrim.classList.add('is-open');
    hamburgerBtn.classList.add('is-open');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    mobileNav.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeMobileNav(){
    mobileNav.classList.remove('is-open');
    navScrim.classList.remove('is-open');
    hamburgerBtn.classList.remove('is-open');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    mobileNav.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
  if (hamburgerBtn && mobileNav) {
    hamburgerBtn.addEventListener('click', function(){
      mobileNav.classList.contains('is-open') ? closeMobileNav() : openMobileNav();
    });
    mobileNavClose.addEventListener('click', closeMobileNav);
    navScrim.addEventListener('click', closeMobileNav);
    document.addEventListener('keydown', function(e){
      if (e.key === 'Escape') closeMobileNav();
    });
    mobileNav.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', closeMobileNav);
    });
  }

  // EN/ES toggle: swaps text content using a per-page dictionary the page
  // declares as window.PAGE_I18N = { es: { key: "texto", ... } } BEFORE this
  // script runs. Elements opt in via data-i18n="key" (textContent) or
  // data-i18n-html="key" (innerHTML, for strings containing an inline <a>).
  // Choice persists in localStorage so it holds across page navigation.
  // Supports multiple .lang-btn instances on one page (header + mobile nav
  // duplicate the control since the header copy is hidden under 900px).
  var LANG_KEY = 'kalpulli-lang';
  var dict = (window.PAGE_I18N && window.PAGE_I18N.es) || {};
  var langBtns = Array.prototype.slice.call(document.querySelectorAll('.lang-btn'));
  var originalText = {};
  var originalHtml = {};
  var currentLang = 'en';

  function applyLanguage(lang){
    currentLang = lang;
    document.querySelectorAll('[data-i18n]').forEach(function(el){
      var key = el.getAttribute('data-i18n');
      if (!(key in originalText)) originalText[key] = el.textContent;
      el.textContent = (lang === 'es' && dict[key]) ? dict[key] : originalText[key];
    });
    document.querySelectorAll('[data-i18n-html]').forEach(function(el){
      var key = el.getAttribute('data-i18n-html');
      if (!(key in originalHtml)) originalHtml[key] = el.innerHTML;
      el.innerHTML = (lang === 'es' && dict[key]) ? dict[key] : originalHtml[key];
    });
    document.documentElement.setAttribute('lang', lang);
    langBtns.forEach(function(btn){
      var enLabel = btn.querySelector('[data-lang-option="en"]');
      var esLabel = btn.querySelector('[data-lang-option="es"]');
      if (enLabel && esLabel) {
        enLabel.classList.toggle('is-active', lang === 'en');
        esLabel.classList.toggle('is-active', lang === 'es');
      }
      btn.setAttribute('aria-label', lang === 'es' ? 'Switch to English' : 'Cambiar a español');
    });
    try { localStorage.setItem(LANG_KEY, lang); } catch(e){}
  }

  if (langBtns.length) {
    var savedLang = null;
    try { savedLang = localStorage.getItem(LANG_KEY); } catch(e){}
    applyLanguage(savedLang === 'es' ? 'es' : 'en');
    langBtns.forEach(function(btn){
      btn.addEventListener('click', function(){
        applyLanguage(currentLang === 'es' ? 'en' : 'es');
      });
    });
  }

  // Kalpulli (gathering): reveal elements as they scroll into view
  var revealTargets = document.querySelectorAll('.reveal, .reveal-stagger, .torn-edge, .quote-section');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, {threshold: 0.2, rootMargin: '0px 0px -60px 0px'});
    revealTargets.forEach(function(el){ io.observe(el); });
  } else {
    revealTargets.forEach(function(el){ el.classList.add('is-visible'); });
  }
})();
