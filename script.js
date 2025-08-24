const translations = {
  pt: {
    titulo: "Bem-vindo ao meu portfólio!",
    autor: "Autor: Giancarlo Juliao Neves Peixoto",
    projetosTitulo: "Meus projetos:",
    jogos: "Jogos",
    conecta4: "Conecta 4",
    websites: "Websites",
    emBreve: "(em breve)"
  },
  en: {
    titulo: "Welcome to my portfolio!",
    autor: "Author: Giancarlo Juliao Neves Peixoto",
    projetosTitulo: "My projects:",
    jogos: "Games",
    conecta4: "Connect 4",
    websites: "Websites",
    emBreve: "(coming soon)"
  }
};

function setLanguage(lang) {
  document.getElementById("titulo").textContent = translations[lang].titulo;
  document.getElementById("autor").textContent = translations[lang].autor;
  document.getElementById("projetos-titulo").textContent = translations[lang].projetosTitulo;

  const projectHeaders = document.querySelectorAll("#projetos-cont .project h3");
  projectHeaders[0].textContent = translations[lang].jogos;
  projectHeaders[1].textContent = translations[lang].websites;

  const projectLinks = document.querySelectorAll("#projetos-cont .project a");
  projectLinks[0].textContent = translations[lang].conecta4;
  projectLinks[1].textContent = translations[lang].emBreve;
}

setLanguage("pt");

document.getElementById("btn-pt").addEventListener("click", () => setLanguage("pt"));
document.getElementById("btn-en").addEventListener("click", () => setLanguage("en"));
