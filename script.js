document.addEventListener('DOMContentLoaded', function () {
  var btn = document.getElementById('btn-idioma');
  var idioma = localStorage.getItem('idioma') || 'en';

  function setLanguage(lang) {
    var els = document.querySelectorAll('[data-pt]');
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      var pt = el.getAttribute('data-pt');
      var en = el.getAttribute('data-en') || pt;
      el.textContent = lang === 'pt' ? pt : en;
    }

    var phEls = document.querySelectorAll('[data-pt-placeholder]');
    for (var j = 0; j < phEls.length; j++) {
      var el = phEls[j];
      var pt = el.getAttribute('data-pt-placeholder');
      var en = el.getAttribute('data-en-placeholder') || pt;
      el.placeholder = lang === 'pt' ? pt : en;
    }

    btn.setAttribute('aria-pressed', lang === 'en');
    btn.textContent = lang === 'pt' ? 'PT / EN' : 'EN / PT';
    localStorage.setItem('idioma', lang);
  }

  btn.addEventListener('click', function () {
    idioma = idioma === 'pt' ? 'en' : 'pt';
    setLanguage(idioma);
  });

  setLanguage(idioma);

  var ano = document.getElementById('ano');
  if (ano) {
    ano.textContent = new Date().getFullYear();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const cvLink = document.getElementById("cv-link");
  if (!cvLink) return;

  const lang = document.documentElement.lang;

  if (lang === "pt") {
    cvLink.href = "caminho/para/seu_cv_pt.pdf"; // edite com o caminho certo
  } else if (lang === "en") {
    cvLink.href = "caminho/para/seu_cv_en.pdf"; // edite com o caminho certo
  }
});
