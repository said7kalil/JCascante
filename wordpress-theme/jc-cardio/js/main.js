document.addEventListener('DOMContentLoaded', function () {
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  var header = document.getElementById('siteHeader');
  if (header) {
    window.addEventListener('scroll', function () {
      header.classList.toggle('scrolled', window.scrollY > 10);
    });
  }

  var menuToggle = document.getElementById('menuToggle');
  var mobilePanel = document.getElementById('mobilePanel');
  if (menuToggle && mobilePanel) {
    menuToggle.addEventListener('click', function () {
      mobilePanel.classList.toggle('open');
    });
    mobilePanel.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { mobilePanel.classList.remove('open'); });
    });
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) e.target.classList.add('in'); });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach(function (el) { observer.observe(el); });

  var form = document.getElementById('contactForm');
  var success = document.getElementById('formSuccess');
  var errorEl = document.getElementById('formError');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var submitBtn = form.querySelector('.form-submit');
      submitBtn.disabled = true;

      var data = new FormData(form);
      data.append('action', 'jc_contact_submit');
      data.append('jc_contact_nonce', jcAjax.nonce);

      fetch(jcAjax.url, { method: 'POST', body: data })
        .then(function (r) { return r.json(); })
        .then(function (res) {
          submitBtn.disabled = false;
          if (res.success) {
            form.style.display = 'none';
            success.classList.add('show');
          } else {
            errorEl.textContent = res.data && res.data.message ? res.data.message : 'No se pudo enviar. Intente de nuevo.';
            errorEl.classList.add('show');
          }
        })
        .catch(function () {
          submitBtn.disabled = false;
          errorEl.textContent = 'Error de conexión. Intente de nuevo o escriba por WhatsApp.';
          errorEl.classList.add('show');
        });
    });
  }
});
