let currentPage = 1;
const itemsPerPage = 10;

function fetchCharacters(page) {
      const container = document.querySelector('.characters-container');

      if (!container) return;

      let startId = (page - 1) * itemsPerPage + 1;
      let endId = page * itemsPerPage;
      let ids = [];

      for (let i = startId; i <= endId; i++) {
            ids.push(i);
      }

      const API_URL = `https://rickandmortyapi.com/api/character/${ids.join(',')}`;

      fetch(API_URL)
            .then(response => response.json())
            .then(data => {
                  container.innerHTML = "";

                  data.forEach(character => {
                        const card = `
                              <article class="character-card">
                                    <div class="card-image">
                                          <img src="${character.image}" alt="${character.name}">
                                    </div>
                                    <div class="card-content">
                                          <h2 class="character-name">${character.name}</h2>
                                          <p><strong>Raza:</strong> ${character.species}</p>
                                          <p><strong>Origen:</strong> ${character.origin.name}</p>
                                          <p><strong>Status:</strong> ${character.status}</p>
                                          <p><strong>Género:</strong> ${character.gender}</p>
                                    </div>
                              </article>
                        `;
                        container.innerHTML += card;
                  });

                  document.getElementById('page-number').innerText = `Página ${page}`;
                  document.getElementById('prev-btn').disabled = page === 1;
            })
            .catch(error => console.error("Error al obtener personajes:", error));
}

function changePage(step) {
      currentPage += step;
      fetchCharacters(currentPage);
}

function setActiveNav() {
      const pathname = window.location.pathname;

      const fileName = pathname === "/" || pathname === ""
            ? "index.html"
            : pathname.split("/").pop();

      const navMap = {
            "index.html": "nav-characters",
            "episodes.html": "nav-episodes",
      };

      const activeId = navMap[fileName];
      if (activeId) {
            document.getElementById(activeId)?.classList.add("active");
      }
}

//EPISODIOS
let allEpisodes = [];
let episodeCharactersCache = {};

async function loadAllEpisodes() {
      try {
            const [p1, p2, p3] = await Promise.all([
                  fetch('https://rickandmortyapi.com/api/episode?page=1').then(r => r.json()),
                  fetch('https://rickandmortyapi.com/api/episode?page=2').then(r => r.json()),
                  fetch('https://rickandmortyapi.com/api/episode?page=3').then(r => r.json()),
            ]);
            allEpisodes = [...p1.results, ...p2.results, ...p3.results];
            renderEpisodeList(allEpisodes);
      } catch (err) {
            console.error("Error al cargar episodios:", err);
      }
}

function renderEpisodeList(episodes) {
      const list = document.getElementById('episodes-list');
      if (!list) return;

      if (episodes.length === 0) {
            list.innerHTML = '<p class="no-results">No se encontraron episodios</p>';
            return;
      }

      list.innerHTML = episodes.map(ep => {
            const characterIds = ep.characters.map(url => url.split('/').pop());
            const chips = ep.characters.map((url, i) => {
                  const id = url.split('/').pop();
                  return `<span class="character-chip" data-id="${id}">Personaje #${id}</span>`;
            }).join('');

            return `
                  <article class="episode-card">
                        <div class="episode-card-header">
                              <div class="episode-badge">
                                    <span>EPISODIO: ${ep.id}</span>
                              </div>
                              <div class="episode-info">
                                    <h2 class="episode-name">${ep.name}</h2>
                                    <p class="episode-meta">Fecha de Lanzamiento: ${ep.air_date}</p>
                              </div>
                        </div>
                        <div class="episode-characters-list" id="chips-${ep.id}">
                              ${chips}
                        </div>
                  </article>
            `;
      }).join('');

      // cargar nombres reales de los chips
      loadChipNames(episodes);

      // eventos para los chips
      list.querySelectorAll('.character-chip').forEach(chip => {
            chip.addEventListener('click', () => showCharacterOverlay(chip.dataset.id));
      });
}

async function loadChipNames(episodes) {
      // recolectar todos los ids únicos
      const allIds = [...new Set(
            episodes.flatMap(ep => ep.characters.map(url => url.split('/').pop()))
      )];

      // fetch en bloques de 20 para no saturar la API
      for (let i = 0; i < allIds.length; i += 20) {
            const batch = allIds.slice(i, i + 20);
            try {
                  const res = await fetch(`https://rickandmortyapi.com/api/character/${batch.join(',')}`);
                  const data = await res.json();
                  const chars = Array.isArray(data) ? data : [data];

                  chars.forEach(char => {
                        episodeCharactersCache[char.id] = char;
                        document.querySelectorAll(`.character-chip[data-id="${char.id}"]`)
                              .forEach(chip => chip.textContent = char.name);
                  });
            } catch (err) {
                  console.error("Error cargando nombres:", err);
            }
      }
}

async function showCharacterOverlay(characterId) {
      const overlay = document.getElementById('character-overlay');
      const content = document.getElementById('overlay-character-content');

      let character = episodeCharactersCache[characterId];

      if (!character) {
            content.innerHTML = '<p class="no-results">Cargando...</p>';
            overlay.style.display = 'flex';
            try {
                  const res = await fetch(`https://rickandmortyapi.com/api/character/${characterId}`);
                  character = await res.json();
                  episodeCharactersCache[characterId] = character;
            } catch (err) {
                  content.innerHTML = '<p class="no-results">Error al cargar personaje</p>';
                  return;
            }
      }

      content.innerHTML = `
            <article class="character-card" style="border:none; border-radius:12px;">
                  <div class="card-image">
                        <img src="${character.image}" alt="${character.name}">
                  </div>
                  <div class="card-content">
                        <h2 class="character-name">${character.name}</h2>
                        <p><strong>Raza:</strong> ${character.species}</p>
                        <p><strong>Origen:</strong> ${character.origin.name}</p>
                        <p><strong>Status:</strong> ${character.status}</p>
                        <p><strong>Género:</strong> ${character.gender}</p>
                  </div>
            </article>
      `;

      overlay.style.display = 'flex';
}

function searchEpisode() {
      const query = document.getElementById('episode-search')?.value.trim().toLowerCase();
      const backContainer = document.getElementById('back-container');

      if (!query) {
            renderEpisodeList(allEpisodes);
            if (backContainer) backContainer.style.display = 'none';
            return;
      }

      const results = allEpisodes.filter(ep =>
            ep.name.toLowerCase().includes(query) ||
            ep.episode.toLowerCase().includes(query)
      );

      renderEpisodeList(results);
      if (backContainer) backContainer.style.display = 'block';
}

// eventos
document.getElementById('search-btn')?.addEventListener('click', searchEpisode);
document.getElementById('episode-search')?.addEventListener('keydown', e => {
      if (e.key === 'Enter') searchEpisode();
});
document.getElementById('back-btn')?.addEventListener('click', () => {
      document.getElementById('episode-search').value = '';
      document.getElementById('back-container').style.display = 'none';
      renderEpisodeList(allEpisodes);
});
document.getElementById('close-overlay-btn')?.addEventListener('click', () => {
      document.getElementById('character-overlay').style.display = 'none';
});

document.getElementById('character-overlay')?.addEventListener('click', (e) => {
      if (e.target === document.getElementById('character-overlay')) {
            document.getElementById('character-overlay').style.display = 'none';
      }
});

setActiveNav();

const isEpisodesPage = window.location.pathname.includes("episodes");
if (isEpisodesPage) {
      loadAllEpisodes();
} else {
      fetchCharacters(currentPage);
}