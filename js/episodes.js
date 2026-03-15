let allEpisodes = [];
let episodeCharactersCache = {};

const botonBuscar = document.getElementById('search-btn');
const cajaBusqueda = document.getElementById('episode-search');
const botonVolver = document.getElementById('back-btn');
const contenedorVolver = document.getElementById('back-container');
const botonCerrarOverlay = document.getElementById('close-overlay-btn');
const elOverlay = document.getElementById('character-overlay');

function setActiveNav() {
      const pathname = window.location.pathname;
      const fileName = pathname.split("/").pop();
      const linkActivo = document.getElementById("nav-episodes");
      if (linkActivo) linkActivo.classList.add("active");
}

async function loadAllEpisodes() {
      try {
            let episodiosAcumulados = [];
            for (let p = 1; p <= 3; p++) {
                  const respuesta = await fetch(`https://rickandmortyapi.com/api/episode?page=${p}`);
                  const datos = await respuesta.json();
                  episodiosAcumulados.push(...datos.results);
            }
            allEpisodes = episodiosAcumulados;
            renderEpisodeList(allEpisodes);
      } catch (err) {
            console.error("Error al cargar episodios:", err);
      }
}

function renderEpisodeList(listaARenderizar) {
      const contenedorLista = document.getElementById('episodes-list');
      if (!contenedorLista) return;

      if (listaARenderizar.length === 0) {
            contenedorLista.innerHTML = '<p class="no-results">No se encontraron episodios</p>';
            return;
      }

      contenedorLista.innerHTML = listaARenderizar.map(ep => {
            const chipsHtml = ep.characters.map(url => {
                  const id = url.split('/').pop();
                  return `<span class="character-chip" data-id="${id}">Cargando...</span>`;
            }).join('');

            return `
            <article class="episode-card">
                  <div class="episode-card-header">
                        <div class="episode-badge"><span>EPISODIO: ${ep.id}</span></div>
                  <div class="episode-info">
                        <h2 class="episode-name">${ep.name}</h2>
                        <p class="episode-meta">Lanzamiento: ${ep.air_date}</p>
                  </div>
                  </div>
                  <div class="episode-characters-list">${chipsHtml}</div>
            </article>
      `;
      }).join('');

      loadChipNames(listaARenderizar);

      contenedorLista.querySelectorAll('.character-chip').forEach(chip => {
            chip.addEventListener('click', () => showCharacterOverlay(chip.dataset.id));
      });
}

async function loadChipNames(episodios) {
      let idsUnicos = [];
      for (let ep of episodios) {
            for (let url of ep.characters) {
                  const id = url.split('/').pop();
                  if (!idsUnicos.includes(id)) idsUnicos.push(id);
            }
      }

      for (let i = 0; i < idsUnicos.length; i += 100) {
            const bloque = idsUnicos.slice(i, i + 100);
            try {
                  const res = await fetch(`https://rickandmortyapi.com/api/character/${bloque.join(',')}`);
                  const data = await res.json();
                  const listaPersonajes = Array.isArray(data) ? data : [data];

                  for (let char of listaPersonajes) {
                        episodeCharactersCache[char.id] = char;
                        document.querySelectorAll(`.character-chip[data-id="${char.id}"]`)
                              .forEach(chip => chip.textContent = char.name);
                  }
            } catch (err) { console.error(err); }
      }
}

async function showCharacterOverlay(characterId) {
      const elContenido = document.getElementById('overlay-character-content');
      let personaje = episodeCharactersCache[characterId];

      elOverlay.style.display = 'flex';

      if (!personaje) {
            elContenido.innerHTML = '<p>Cargando...</p>';
            const res = await fetch(`https://rickandmortyapi.com/api/character/${characterId}`);
            personaje = await res.json();
            episodeCharactersCache[characterId] = personaje;
      }

      elContenido.innerHTML = `
      <article class="character-card" style="border:none;">
            <div class="card-image"><img src="${personaje.image}"></div>
            <div class="card-content">
                  <h2 class="character-name">${personaje.name}</h2>
                  <p><strong>Raza:</strong> ${personaje.species}</p>
                  <p><strong>Status:</strong> ${personaje.status}</p>
            </div>
      </article>`;
}

//  BUSCADOR
function searchEpisode() {
      const texto = cajaBusqueda.value.toLowerCase().trim();
      if (texto === "") {
            renderEpisodeList(allEpisodes);
            contenedorVolver.style.display = 'none';
            return;
      }

      const filtrados = allEpisodes.filter(ep =>
            ep.name.toLowerCase().includes(texto) || ep.episode.toLowerCase().includes(texto)
      );

      renderEpisodeList(filtrados);
      contenedorVolver.style.display = 'block';
}

//  EVENTOS 
if (botonBuscar) botonBuscar.addEventListener('click', searchEpisode);
if (cajaBusqueda) cajaBusqueda.addEventListener('keydown', (e) => { if (e.key === 'Enter') searchEpisode(); });
if (botonVolver) botonVolver.addEventListener('click', () => {
      cajaBusqueda.value = '';
      contenedorVolver.style.display = 'none';
      renderEpisodeList(allEpisodes);
});
if (botonCerrarOverlay) botonCerrarOverlay.addEventListener('click', () => elOverlay.style.display = 'none');
if (elOverlay) elOverlay.addEventListener('click', (e) => { if (e.target === elOverlay) elOverlay.style.display = 'none'; });

setActiveNav();
loadAllEpisodes();