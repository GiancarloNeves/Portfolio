document.addEventListener('DOMContentLoaded', function () {
  var languageButton = document.getElementById('btn-idioma');
  var language = 'en';

  try {
    language = localStorage.getItem('idioma') === 'pt' ? 'pt' : 'en';
  } catch (error) {
    language = 'en';
  }

  function setLanguage(nextLanguage) {
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

    try {
      localStorage.setItem('idioma', selectedLanguage);
    } catch (error) {
      // Language switching still works when browser storage is unavailable.
    }

    language = selectedLanguage;
  }

  if (languageButton) {
    languageButton.addEventListener('click', function () {
      setLanguage(language === 'pt' ? 'en' : 'pt');
    });
  }

  setLanguage(language);

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