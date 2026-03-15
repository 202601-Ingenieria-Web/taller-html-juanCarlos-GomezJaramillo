// --- VARIABLES GLOBALES ---
let currentPage = 1;
const itemsPerPage = 10;

// --- FUNCIÓN PARA ACTIVAR EL MENÚ ---
function setActiveNav() {
      const pathname = window.location.pathname;
      const fileName = pathname === "/" || pathname === "" ? "index.html" : pathname.split("/").pop();

      const navMap = {
            "index.html": "nav-characters",
            "episodes.html": "nav-episodes",
      };

      const activeId = navMap[fileName];
      if (activeId) {
            const linkActivo = document.getElementById(activeId);
            if (linkActivo) linkActivo.classList.add("active");
      }
}

// --- FUNCIÓN PARA OBTENER PERSONAJES ---
function fetchCharacters(page) {
      const contenedor = document.querySelector('.characters-container');
      if (!contenedor) return;

      // Calculamos qué IDs pedir (ej: del 1 al 10, del 11 al 20...)
      let startId = (page - 1) * itemsPerPage + 1;
      let endId = page * itemsPerPage;
      let listaIds = [];

      for (let i = startId; i <= endId; i++) {
            listaIds.push(i);
      }

      const API_URL = `https://rickandmortyapi.com/api/character/${listaIds.join(',')}`;

      fetch(API_URL)
            .then(respuesta => respuesta.json())
            .then(datos => {
                  contenedor.innerHTML = "";

                  datos.forEach(personaje => {
                        const tarjetaHtml = `
                  <article class="character-card">
                        <div class="card-image">
                              <img src="${personaje.image}" alt="${personaje.name}">
                        </div>
                        <div class="card-content">
                              <h2 class="character-name">${personaje.name}</h2>
                              <p><strong>Raza:</strong> ${personaje.species}</p>
                              <p><strong>Origen:</strong> ${personaje.origin.name}</p>
                              <p><strong>Status:</strong> ${personaje.status}</p>
                              <p><strong>Género:</strong> ${personaje.gender}</p>
                        </div>
                  </article>
                  `;
                        contenedor.innerHTML += tarjetaHtml;
                  });

                  document.getElementById('page-number').innerText = `Página ${page}`;
                  document.getElementById('prev-btn').disabled = (page === 1);
            })
            .catch(error => console.error("Error al obtener personajes:", error));
}

function changePage(paso) {
      currentPage = currentPage + paso;
      fetchCharacters(currentPage);
}

setActiveNav();
fetchCharacters(currentPage);