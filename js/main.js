document.documentElement.classList.remove('no-js');

var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ظهور الأقسام بهدوء عند النزول
var items = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !reduceMotion) {
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  items.forEach(function (el) { io.observe(el); });
} else {
  items.forEach(function (el) { el.classList.add('in'); });
}

// الجملة اللي تنكتب حرف حرف مثل الآلة الكاتبة
var typed = document.querySelector('[data-typed]');
if (typed) {
  var text = typed.textContent.trim();
  var caret = document.createElement('span');
  caret.className = 'caret';
  caret.setAttribute('aria-hidden', 'true');
  if (reduceMotion) {
    typed.appendChild(caret);
  } else {
    typed.setAttribute('aria-label', text);
    typed.textContent = '';
    var out = document.createElement('span');
    out.setAttribute('aria-hidden', 'true');
    typed.append(out, caret);
    var i = 0;
    (function tick() {
      out.textContent = text.slice(0, ++i);
      if (i < text.length) setTimeout(tick, text[i - 1] === ' ' ? 120 : 55 + Math.random() * 60);
    })();
  }
}
