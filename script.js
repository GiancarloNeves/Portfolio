document.addEventListener('DOMContentLoaded', function () {
  var languageButton = document.getElementById('btn-idioma');
  var languageOverlay = document.getElementById('language-overlay');
  var language = 'en';
  var savedLanguage = null;

  try {
    savedLanguage = localStorage.getItem('idioma');
  } catch (error) {
    savedLanguage = null;
  }

  var hasSavedLanguage = savedLanguage === 'pt' || savedLanguage === 'en';
  language = savedLanguage === 'pt' ? 'pt' : 'en';

  function setLanguage(nextLanguage, persist) {
    var selectedLanguage = nextLanguage === 'pt' ? 'pt' : 'en';
    var elements = document.querySelectorAll('[data-pt][data-en]');

    for (var i = 0; i < elements.length; i++) {
      var element = elements[i];
      element.textContent = selectedLanguage === 'pt'
        ? element.getAttribute('data-pt')
        : element.getAttribute('data-en');
    }

    var ariaElements = document.querySelectorAll('[data-pt-aria][data-en-aria]');
    for (var j = 0; j < ariaElements.length; j++) {
      var ariaElement = ariaElements[j];
      ariaElement.setAttribute('aria-label', selectedLanguage === 'pt'
        ? ariaElement.getAttribute('data-pt-aria')
        : ariaElement.getAttribute('data-en-aria'));
    }

    var description = document.querySelector('meta[name="description"]');
    if (description) {
      description.setAttribute('content', selectedLanguage === 'pt'
        ? description.getAttribute('data-pt-content')
        : description.getAttribute('data-en-content'));
    }

    var title = document.querySelector('title');
    if (title) {
      document.title = selectedLanguage === 'pt'
        ? title.getAttribute('data-pt-title')
        : title.getAttribute('data-en-title');
    }

    document.documentElement.lang = selectedLanguage;

    if (languageButton) {
      languageButton.textContent = selectedLanguage === 'pt' ? 'EN' : 'PT';
      languageButton.setAttribute('aria-label', selectedLanguage === 'pt' ? 'Mudar para inglês' : 'Switch to Portuguese');
      languageButton.setAttribute('aria-pressed', selectedLanguage === 'pt' ? 'true' : 'false');
    }

    if (persist !== false) {
      try {
        localStorage.setItem('idioma', selectedLanguage);
      } catch (error) {
        // Language switching still works when browser storage is unavailable.
      }
    }

    language = selectedLanguage;
  }

  function closeLanguageChoice() {
    if (!languageOverlay) return;
    languageOverlay.classList.add('is-closing');
    document.body.classList.remove('language-choice-open');
    if (languageButton) languageButton.focus();
    languageOverlay.setAttribute('aria-hidden', 'true');
    window.setTimeout(function () {
      languageOverlay.hidden = true;
      languageOverlay.classList.remove('is-closing');
    }, 190);
  }

  setLanguage(language, hasSavedLanguage);

  if (languageOverlay) {
    if (hasSavedLanguage) {
      languageOverlay.hidden = true;
      languageOverlay.setAttribute('aria-hidden', 'true');
    } else {
      languageOverlay.hidden = false;
      languageOverlay.setAttribute('aria-hidden', 'false');
      document.body.classList.add('language-choice-open');
      var initialChoice = languageOverlay.querySelector('[data-language-choice="pt"]');
      if (initialChoice) initialChoice.focus();

      languageOverlay.addEventListener('click', function (event) {
        var choice = event.target.closest('[data-language-choice]');
        if (!choice) return;
        setLanguage(choice.getAttribute('data-language-choice'), true);
        closeLanguageChoice();
      });

      document.addEventListener('keydown', function (event) {
        if (languageOverlay.hidden) return;
        if (event.key === 'Escape') {
          event.preventDefault();
          return;
        }
        if (event.key !== 'Tab') return;
        var choices = languageOverlay.querySelectorAll('button:not([disabled])');
        if (!choices.length) return;
        var first = choices[0];
        var last = choices[choices.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      });
    }
  }

  if (languageButton) {
    languageButton.addEventListener('click', function () {
      setLanguage(language === 'pt' ? 'en' : 'pt', true);
    });
  }

  var sectionLinks = document.querySelectorAll('[data-section-link]');
  var sectionIds = [];
  for (var k = 0; k < sectionLinks.length; k++) {
    sectionIds.push(sectionLinks[k].getAttribute('data-section-link'));
    sectionLinks[k].addEventListener('click', function () {
      setActiveSection(this.getAttribute('data-section-link'));
    });
  }

  function setActiveSection(activeId) {
    for (var m = 0; m < sectionLinks.length; m++) {
      var link = sectionLinks[m];
      var isActive = link.getAttribute('data-section-link') === activeId;
      link.classList.toggle('is-active', isActive);
      if (isActive) {
        link.setAttribute('aria-current', 'location');
      } else {
        link.removeAttribute('aria-current');
      }
    }
  }

  function updateActiveSection() {
    if (!sectionIds.length) return;
    var activeId = sectionIds[0];
    var threshold = window.innerHeight * 0.36;

    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
      activeId = sectionIds[sectionIds.length - 1];
    } else {
      for (var n = 0; n < sectionIds.length; n++) {
        var section = document.getElementById(sectionIds[n]);
        if (section && section.getBoundingClientRect().top <= threshold) {
          activeId = sectionIds[n];
        }
      }
    }

    setActiveSection(activeId);
  }

  window.addEventListener('scroll', updateActiveSection, { passive: true });
  window.addEventListener('resize', updateActiveSection);
  updateActiveSection();

  var year = document.getElementById('ano');
  if (year) {
    year.textContent = new Date().getFullYear();
  }
});