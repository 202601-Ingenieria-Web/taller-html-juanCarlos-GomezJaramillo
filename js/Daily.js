/* Personaje Aleatorio */

const TOTAL_CHARACTERS = 826;
let isLoading = false;                    //Evita clicks multiples mientras se carga un personaje nuevo

function getRandomId() {
      return Math.floor(Math.random() * TOTAL_CHARACTERS) + 1;
}

function statusClass(s) {
      if (s === 'Alive') return 'status-alive';
      if (s === 'Dead')  return 'status-dead';
      return 'status-unknown';
}

/*Animaciones*/

function burstParticles(btn) {
      const rect = btn.getBoundingClientRect();
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + rect.height / 2;

      for (let i = 0; i < 8; i++) {
            const p     = document.createElement('div');
            p.className = 'particle';
            const angle = (i / 8) * 2 * Math.PI;
            const dist  = 28 + Math.random() * 18;
            p.style.setProperty('--tx', `${Math.cos(angle) * dist}px`);
            p.style.setProperty('--ty', `${Math.sin(angle) * dist}px`);
            p.style.left     = cx + 'px';
            p.style.top      = cy + 'px';
            p.style.position = 'fixed';
            p.style.zIndex   = '9999';
            document.body.appendChild(p);
            setTimeout(() => p.remove(), 650);
      }
}

function animateDailyCard(card) {
      card.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
      card.style.opacity    = '0';
      card.style.transform  = 'scale(0.96)';
      setTimeout(() => {
            card.style.opacity   = '1';
            card.style.transform = 'scale(1)';
      }, 260);
}

/* Render  */

function renderDailyCharacter(char, episodeName) {
      /* Imagen */
      const imgSlot = document.getElementById('portal-img-slot');
      if (imgSlot) {
            const img     = document.createElement('img');
            img.className = 'portal-character-img';
            img.src       = char.image;
            img.alt       = char.name;
            img.id        = 'portal-img-slot';
            imgSlot.replaceWith(img);
      }

      /* Nombre */
      const nameEl = document.getElementById('daily-name');
      if (nameEl) {
            nameEl.textContent     = char.name;
            nameEl.style.animation = 'none';
            void nameEl.offsetWidth;
            nameEl.style.animation = '';
      }

      /* Status badge */
      const badgesEl = document.getElementById('daily-badges');
      if (badgesEl) {
            badgesEl.innerHTML = `
                  <span class="status-badge ${statusClass(char.status)}">${char.status}</span>
            `;
            badgesEl.style.animation = 'none';
            void badgesEl.offsetWidth;
            badgesEl.style.animation = '';
      }

      /* Episodio */
      const locationEl = document.getElementById('daily-location');
      if (locationEl) {
            locationEl.innerHTML = `<span> 📺 </span> ${episodeName}`;
            locationEl.style.animation = 'none';
            void locationEl.offsetWidth;
            locationEl.style.animation = '';
      }
}

function showDailySkeleton() {
      const imgSlot = document.getElementById('portal-img-slot');
      if (imgSlot) {
            const skel         = document.createElement('div');
            skel.className     = 'portal-skeleton';
            skel.id            = 'portal-img-slot';
            skel.style.cssText = 'width:78px;height:78px;border-radius:50%;';
            imgSlot.replaceWith(skel);
      }

      const nameEl     = document.getElementById('daily-name');
      const badgesEl   = document.getElementById('daily-badges');
      const locationEl = document.getElementById('daily-location');

      if (nameEl)     nameEl.innerHTML     = '<span class="portal-skeleton" style="height:20px;border-radius:6px;width:65%;display:block;"></span>';
      if (badgesEl)   badgesEl.innerHTML   = '<span class="portal-skeleton" style="height:14px;border-radius:6px;width:40%;display:block;"></span>';
      if (locationEl) locationEl.innerHTML = '<span class="portal-skeleton" style="height:12px;border-radius:6px;width:75%;display:block;"></span>';
}

/* Fetch  */

async function loadDailyCharacter(id) {
      try {
            const charRes = await fetch(`https://rickandmortyapi.com/api/character/${id}`);
            const char    = await charRes.json();

            const epRes   = await fetch(char.episode[0]);
            const ep      = await epRes.json();

            renderDailyCharacter(char, `${ep.name}`);
      } catch (err) {
            console.error('Error cargando personaje:', err);
      } finally {
            isLoading = false;
      }
}

/* Init */

function initDailyCharacter() {
      const section = document.getElementById('daily-section');
      if (!section) return;

      loadDailyCharacter(getRandomId());

      const btn = document.getElementById('reload-btn');
      if (!btn) return;

      btn.addEventListener('click', async function () {
            if (isLoading) return;
            isLoading = true;

            const card = document.getElementById('daily-card');

            burstParticles(btn);
            btn.classList.add('spinning');
            setTimeout(() => btn.classList.remove('spinning'), 620);

            animateDailyCard(card);
            showDailySkeleton();

            await loadDailyCharacter(getRandomId());
      });
}

document.addEventListener('DOMContentLoaded', initDailyCharacter);