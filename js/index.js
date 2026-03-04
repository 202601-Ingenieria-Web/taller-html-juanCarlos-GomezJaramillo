let currentPage = 1;
const itemsPerPage = 10;

// Función principal para obtener los personajes
function fetchCharacters(page) {
      const container = document.querySelector('.characters-container');
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
                  // Limpiar el contenedor antes de mostrar los nuevos
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

                  // Actualizar el número de página en el HTML
                  document.getElementById('page-number').innerText = `Página ${page}`;

                  // Bloquear botón anterior si estamos en la página 1
                  document.getElementById('prev-btn').disabled = page === 1;
            })
            .catch(error => console.error("Error al obtener personajes:", error));
}

// Función para cambiar de página
function changePage(step) {
      currentPage += step;
      fetchCharacters(currentPage);
}

fetchCharacters(currentPage);