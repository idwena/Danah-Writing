(function () {
  var pages = Array.prototype.slice.call(document.querySelectorAll('#pages > .page'));
  var book = document.getElementById('book');
  var spread = document.getElementById('spread');
  var slotR = document.getElementById('slot-right');
  var slotL = document.getElementById('slot-left');
  var nav = document.querySelector('.book-nav');
  var btnPrev = document.getElementById('prev');
  var btnNext = document.getElementById('next');
  var where = document.getElementById('where');
  var mobile = window.matchMedia('(max-width: 819px)');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function ar(n) { return String(n).replace(/\d/g, function (d) { return '٠١٢٣٤٥٦٧٨٩'[d]; }); }

  // عنوان الباب أعلى كل صفحة
  var part = '';
  pages.forEach(function (p) {
    if (p.dataset.part) part = p.dataset.part;
    p.dataset.head = part;
  });

  // الفهرس التلقائي
  var toc = document.querySelector('[data-auto-toc]');
  if (toc) {
    pages.forEach(function (p, i) {
      if (!p.dataset.toc) return;
      var li = document.createElement('li');
      if (p.classList.contains('part')) li.className = 'toc-part';
      var a = document.createElement('a');
      a.href = '#p' + (i + 1);
      var t = document.createElement('span'); t.textContent = p.dataset.toc;
      var dots = document.createElement('i');
      var num = document.createElement('b'); num.textContent = ar(i + 1);
      a.append(t, dots, num);
      li.appendChild(a);
      toc.appendChild(li);
    });
  }
  var tocIndex = pages.findIndex(function (p) { return p.classList.contains('toc-page'); });

  // ============ الحالة ============
  // view = -1 الغلاف الأمامي، 0..last() الصفحات المفتوحة، last()+1 الغلاف الخلفي
  var view = -1, busy = false;
  function per() { return mobile.matches ? 1 : 2; }
  function last() { return Math.ceil(pages.length / per()) - 1; }
  function viewOfPage(i) { return Math.floor(i / per()); }

  function fill(el, i, side) {
    var p = pages[i];
    el.className = 'sheet-page side-' + side + (p ? ' ' + p.className.replace(/\bpage\b/, '') : ' blank');
    if (!p) { el.innerHTML = ''; return; }
    var head = i % 2 === 0 ? 'ديوان دانة' : (p.dataset.head || 'ديوان دانة');
    el.innerHTML =
      '<header class="run-head">' + head + '</header>' +
      '<div class="page-body">' + p.innerHTML + '</div>' +
      '<footer class="folio">' + ar(i + 1) + '</footer>' +
      '<button type="button" class="page-corner" data-turn="' + (side === 'left' ? 'next' : 'prev') + '" aria-label="' +
      (side === 'left' ? 'الصفحة التالية' : 'الصفحة السابقة') + '"></button>';
    if (per() === 1) el.querySelector('.page-corner').remove();
  }

  function render() {
    var n = per();
    spread.classList.toggle('single', n === 1);
    nav.classList.toggle('single', n === 1 || view < 0 || view > last());
    if (view < 0) {
      book.dataset.state = 'cover';
      where.textContent = 'الغلاف';
    } else if (view > last()) {
      book.dataset.state = 'back';
      where.textContent = 'الغلاف الخلفي';
    } else {
      book.dataset.state = 'open';
      var first = view * n;
      fill(slotR, first, 'right');
      if (n === 2) fill(slotL, first + 1, 'left');
      var shown = [first + 1];
      if (n === 2 && pages[first + 1]) shown.push(first + 2);
      where.textContent = 'ص ' + shown.map(ar).join('–') + ' من ' + ar(pages.length);
    }
    btnPrev.disabled = view < 0;
    btnNext.disabled = view > last();
    btnNext.textContent = view < 0 ? 'افتح الديوان ←' : 'التالية ←';
    var hash = view >= 0 && view <= last() ? '#p' + (view * n + 1) : view > last() ? '#back' : ' ';
    try { history.replaceState(null, '', hash === ' ' ? location.pathname + location.search : hash); } catch (e) {}
  }

  function appear() {
    if (reduceMotion) return;
    book.classList.remove('appear'); void book.offsetWidth; book.classList.add('appear');
  }

  // الورقة اللي تتقلب
  function flip(dir, to) {
    var n = per();
    var leaf = document.createElement('div');
    leaf.className = 'leaf';
    var front = document.createElement('article');
    var back = document.createElement('article');
    leaf.append(front, back);
    var start, end;

    if (n === 2) {
      if (dir === 'next') {
        fill(front, view * 2 + 1, 'left');
        fill(back, to * 2, 'right');
        fill(slotL, to * 2 + 1, 'left');        // تحت الورقة: الصفحة اليسرى الجديدة
        leaf.style.left = '0'; leaf.style.transformOrigin = 'right center';
        start = 'rotateY(0deg)'; end = 'rotateY(180deg)';
      } else {
        fill(front, view * 2, 'right');
        fill(back, to * 2 + 1, 'left');
        fill(slotR, to * 2, 'right');           // تحت الورقة: الصفحة اليمنى الجديدة
        leaf.style.right = '0'; leaf.style.transformOrigin = 'left center';
        start = 'rotateY(0deg)'; end = 'rotateY(-180deg)';
      }
      front.classList.add('face-front'); back.classList.add('face-back');
    } else {
      leaf.style.right = '0'; leaf.style.transformOrigin = 'right center';
      back.remove();
      if (dir === 'next') {
        fill(front, view, 'right');
        fill(slotR, to, 'right');
        start = 'rotateY(0deg)'; end = 'rotateY(115deg)';
      } else {
        fill(front, to, 'right');
        start = 'rotateY(115deg)'; end = 'rotateY(0deg)';
        leaf.style.opacity = '0';
      }
    }

    leaf.style.transform = start;
    spread.appendChild(leaf);
    void leaf.offsetWidth;
    leaf.style.transform = end;
    if (n === 1) leaf.style.opacity = dir === 'next' ? '0' : '1';

    var done = false;
    function finish() {
      if (done) return; done = true;
      leaf.remove(); view = to; render(); busy = false;
    }
    leaf.addEventListener('transitionend', function (e) { if (e.propertyName === 'transform') finish(); });
    setTimeout(finish, 1200);
  }

  function go(to) {
    to = Math.max(-1, Math.min(last() + 1, to));
    if (busy || to === view) return;
    var bothOpen = view >= 0 && view <= last() && to >= 0 && to <= last() && Math.abs(to - view) === 1;
    if (bothOpen && !reduceMotion) {
      busy = true;
      flip(to > view ? 'next' : 'prev', to);
    } else {
      view = to; render(); appear();
    }
  }
  function goPage(i) { go(viewOfPage(i)); }

  // ============ التحكم ============
  btnNext.addEventListener('click', function () { go(view + 1); });
  btnPrev.addEventListener('click', function () { go(view - 1); });
  document.getElementById('to-toc').addEventListener('click', function () { if (tocIndex >= 0) goPage(tocIndex); });
  document.getElementById('front-cover').addEventListener('click', function () { go(0); });
  document.getElementById('front-cover').addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(0); }
  });
  document.getElementById('back-cover').addEventListener('click', function () { go(-1); });

  spread.addEventListener('click', function (e) {
    var corner = e.target.closest('[data-turn]');
    if (corner) { go(view + (corner.dataset.turn === 'next' ? 1 : -1)); return; }
    var link = e.target.closest('a[href^="#p"]');
    if (link) { e.preventDefault(); goPage(parseInt(link.getAttribute('href').slice(2), 10) - 1); }
  });

  // الأسهم: في الكتاب العربي اليسار = التالي
  document.addEventListener('keydown', function (e) {
    if (e.target.closest('input, textarea')) return;
    if (e.key === 'ArrowLeft') go(view + 1);
    else if (e.key === 'ArrowRight') go(view - 1);
    else if (e.key === 'Home') go(-1);
    else if (e.key === 'End') go(last());
  });

  // السحب على الجوال: اسحب لليمين = الصفحة التالية
  var sx = null, sy = null;
  book.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
  book.addEventListener('touchend', function (e) {
    if (sx === null) return;
    var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
    sx = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) go(view + (dx > 0 ? 1 : -1));
  });

  // تغيّر المقاس (صفحة وحدة ↔ صفحتين): نحافظ على نفس الصفحة
  mobile.addEventListener('change', function () {
    if (view < 0) return render();
    var wasBack = view > last();
    var firstPage = view * (mobile.matches ? 2 : 1);   // per() تغيّرت للتو
    view = wasBack ? last() + 1 : viewOfPage(Math.min(firstPage, pages.length - 1));
    render();
  });

  // فتح صفحة من الرابط مثل index.html#p6
  var m = location.hash.match(/^#p(\d+)$/);
  if (m) view = viewOfPage(Math.min(pages.length, Math.max(1, +m[1])) - 1);
  else if (location.hash === '#back') view = last() + 1;
  render();
})();
