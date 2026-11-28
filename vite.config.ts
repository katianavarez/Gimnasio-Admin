import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa'; // el plugin que genera manifiesto y service worker en el build

// La URL de la API; en Netlify viene de VITE_API_URL. La usa el Paso 2 para saber qué guardar.
const API = process.env.VITE_API_URL ?? 'http://localhost:3000';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', // si subes una versión nueva, el SW nuevo se instala solo
      manifest: {
        name: 'Gimnasio Titanes', // nombre completo: lo muestra el diálogo de «Instalar»
        short_name: 'Titanes', // el que cabe debajo del ícono en el celular
        lang: 'es', // idioma de la app
        start_url: '/', // la ruta con la que abre al tocar el ícono
        display: 'standalone', // abre en su propia ventana, sin la barra del navegador
        theme_color: '#0f2233', // color de la barra de estado en Android
        background_color: '#f4f7fa', // fondo de la pantalla de arranque mientras carga
        icons: [
          // Chrome exige uno de 192 y uno de 512; sin ellos no ofrece «Instalar»
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          // maskable: Android lo recorta en círculo o gota según la marca, el dibujo va al centro
          { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      // ← aquí va el bloque workbox del Paso 2
            workbox: {
        // Precache: lo PROPIO (JS, CSS, HTML, logo e íconos) se guarda completo al instalar el SW
        globPatterns: ['**/*.{js,css,html,svg,png}'],
        // Sin red, /clases/3 contesta con index.html y React Router decide la página
        navigateFallback: '/index.html',
        // Lo AJENO (la API) se guarda conforme se usa, con una estrategia según qué tanto cambia
        runtimeCaching: [
          {
            // ^ = «empieza con»: toda URL http://localhost:3000/clases...
            urlPattern: new RegExp(`^${API}/clases`),
            handler: 'NetworkFirst', // las clases cambian (lugares): primero la red, si falla lo guardado
            options: { cacheName: 'api-clases', networkTimeoutSeconds: 4 }, // si la red tarda >4 s, usa la caché
          },
          {
            urlPattern: new RegExp(`^${API}/img/`),
            handler: 'CacheFirst', // las imágenes casi no cambian: primero lo guardado, ahorra datos
            options: { cacheName: 'api-imagenes' }, // así aparece en Application → Cache Storage
          },
        ],
      },
    }),
  ],
});