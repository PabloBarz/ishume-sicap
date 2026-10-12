'use strict';

import { setText } from './utils.js';

// Catálogo de rutas del cliente y sus vistas HTML asociadas
const ROUTES = {
  dashboard: {
    title: 'Dashboard',
    view: '/views/dashboard.html',
  },
  marcas: {
    title: 'Gestión de Marcas',
    view: '/views/marcas.html',
  },
  modelos: {
    title: 'Gestión de Modelos',
    view: '/views/modelos.html',
  },
  proveedores: {
    title: 'Gestión de Proveedores',
    view: '/views/proveedores.html',
  }
};

// Caché para almacenar las vistas HTML ya descargadas y evitar peticiones repetidas
const viewCache = {};

export const Router = {
  async navigateTo(page) {
    const route = ROUTES[page];
    if (!route) {
      console.warn(`Router: La ruta "${page}" no está registrada.`);
      return;
    }

    // 1. Actualizar estado visual activo en el sidebar
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.remove('active');
    });
    const activeLink = document.querySelector(`.nav-item[data-page="${page}"]`);
    if (activeLink) activeLink.classList.add('active');

    // 2. Actualizar el título en la topbar usando la función auxiliar
    setText('topbarTitle', route.title);

    // 3. Mostrar indicador de carga (spinner) en el contenedor principal
    const container = document.getElementById('pageContainer');
    container.innerHTML = `
      <div class="d-flex justify-content-center align-items-center" style="height: 15rem;">
        <div class="spinner-custom"></div>
      </div>
    `;

    try {
      // 4. Cargar la vista HTML parcial (usando caché si ya fue visitada)
      if (!viewCache[page]) {
        const res = await fetch(route.view);
        if (!res.ok) throw new Error(`No se pudo cargar la vista: ${route.view}`);
        viewCache[page] = await res.text();
      }

      // Inyectar el HTML en la vista principal
      container.innerHTML = viewCache[page];

      // 5. Cerrar el menú lateral en dispositivos móviles tras navegar
      this._closeSidebarMobile();
    } catch (err) {
      container.innerHTML = `
        <div class="alert alert-danger m-4" role="alert">
          <i class="bi bi-exclamation-triangle-fill me-2"></i> Error al cargar la vista: ${err.message}
        </div>
      `;
      console.error(err);
    }
  },

  init() {
    // Escuchar clics en todos los elementos del menú lateral que tengan [data-page]
    document.querySelectorAll('.nav-item[data-page]').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const page = item.getAttribute('data-page');
        this.navigateTo(page);
        
        // Actualizar el historial del navegador con el hash (#) correspondiente
        history.pushState({ page }, '', `#${page}`);
      });
    });

    // Manejar los botones de navegación del navegador (Atrás / Adelante)
    window.addEventListener('popstate', (e) => {
      const page = e.state?.page || window.location.hash.replace('#', '') || 'dashboard';
      this.navigateTo(page);
    });

    // Determinar la vista inicial al cargar la página por primera vez
    const initialPage = window.location.hash.replace('#', '') || 'dashboard';
    this.navigateTo(initialPage);

    // Configuración del botón hamburguesa para pantallas móviles
    document.getElementById('btnToggleSidebar')?.addEventListener('click', () => {
      document.getElementById('sidebar')?.classList.toggle('open');
      document.getElementById('sidebarOverlay')?.classList.toggle('open');
    });

    document.getElementById('sidebarOverlay')?.addEventListener('click', () => {
      this._closeSidebarMobile();
    });
  },

  _closeSidebarMobile() {
    document.getElementById('sidebar')?.classList.remove('open');
    document.getElementById('sidebarOverlay')?.classList.remove('open');
  }
};