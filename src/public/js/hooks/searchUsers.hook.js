import { alertError } from '../utils/alert.utils.js';
import { showUserProfileModal } from '../utils/modal.utils.js';

let debounceTimer;

export function initUserSearch(searchInput, resultsContainer) {
  if (!searchInput || !resultsContainer) return;

  searchInput.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    const query = searchInput.value.trim();

    if (!query) {
      resultsContainer.innerHTML = '';
      return;
    }

    debounceTimer = setTimeout(() => searchUsers(query, resultsContainer), 300);
  });
}

async function searchUsers(query, resultsContainer) {
  const token = localStorage.getItem('token');
  if (!token) return;

  const mode = query.startsWith('@') ? 'exact' : 'partial';
  const url = `/users/search?q=${encodeURIComponent(query)}&mode=${mode}`;

  resultsContainer.innerHTML = `
    <p class="text-gray-500 text-sm px-3">Buscando...</p>
  `;

  try {
    const res = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      resultsContainer.innerHTML = `<p class="text-red-500 text-sm px-3">${errData.message || 'Error en la búsqueda'}</p>`;
      return;
    }

    const data = await res.json();
    let results = [];

    if (mode === 'exact') {
      results = data ? [data] : [];
    } else {
      results = data.results || [];
    }

    if (!results.length) {
      resultsContainer.innerHTML = `<p class="text-gray-500 text-sm px-3">Sin resultados</p>`;
      return;
    }

    resultsContainer.innerHTML = results.map(user => `
      <div class="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors" data-username="${user.username}">
        <img src="${user.avatar || 'https://cdn.emprenet.work/Icons/default-avatar-2.webp'}" class="w-10 h-10 rounded-full object-cover" alt="Avatar">
        <div>
          <p class="font-semibold text-gray-900 dark:text-white">@${user.username}</p>
          <p class="text-sm text-gray-500">${user.email_verified ? '✔ Verificado' : 'No verificado'}</p>
        </div>
      </div>
    `).join('');

    // Agregar listeners para abrir modal
    resultsContainer.querySelectorAll("[data-username]").forEach(el => {
      el.addEventListener("click", () => {
        const username = el.getAttribute("data-username");
        showUserProfileModal({ username });
      });
    });

  } catch (err) {
    console.error('Error al buscar usuarios:', err);
    alertError('No se pudo completar la búsqueda.');
  }
}
