# Práctica 24 — El gimnasio instalable: PWA

**Para el alumno.** Duración: 1 hora · Sesión 24 · Unidad V

## Objetivo

Convertir la app de React del gimnasio en una **PWA**: que se pueda **instalar** como app (en la PC
y en el celular), que **abra sin internet** y que use dos funciones del teléfono desde la web:
**compartir** y **vibrar**.

La configuración **la pegas** de este README: lo importante hoy es entender **qué hace** cada pieza
y **qué genera** por detrás. Sólo un hook lo escribes tú (Paso 5).

---

## Cómo funciona una PWA por dentro

Una PWA es una página web normal más **tres requisitos**. Si falta uno, el navegador no la deja
instalar:

| Requisito | Qué es | Quién lo hace hoy |
|---|---|---|
| **Manifiesto** (`manifest.webmanifest`) | Un JSON con el nombre, los íconos, los colores y cómo abre | `vite-plugin-pwa`, desde tu `vite.config.ts` |
| **Service worker** (`sw.js`) | Un script que el navegador instala **aparte** de la página y que se pone **en medio de cada petición** | `vite-plugin-pwa` con Workbox |
| **HTTPS** | Conexión segura (o `localhost` mientras desarrollas) | Netlify, o `npm run preview` en tu PC |

**El service worker es la pieza clave.** Vive fuera de la pestaña y tiene un ciclo de vida:

```
  1. register   la página le pide al navegador instalar /sw.js
  2. install    el SW guarda en caché los archivos de la app (el "precache")
  3. activate   toma el control y borra cachés de versiones viejas
  4. fetch      cada petición de la app pasa por él: contesta de la red o de su caché
```

En el paso 4 decide con una **estrategia**:

- **NetworkFirst:** primero la red; si no hay, lo guardado. Para datos que cambian (las clases).
- **CacheFirst:** primero lo guardado; si no está, la red. Para lo que casi no cambia (imágenes).

---

## Qué trae esta carpeta

La app de React del gimnasio de la Práctica 18, lista para correr, con:

- `vite-plugin-pwa` ya agregado en `package.json` (en `devDependencies`).
- Los íconos de la app en `public/icons/` (192, 512 y *maskable*).

Si tu proyecto de la Práctica 18 funciona, puedes trabajar sobre el tuyo: copia `public/icons/` e
`index.html` de aquí, e instala el plugin con `npm install -D vite-plugin-pwa`.

## Antes de empezar

- `gimnasio-backend` actualizado y corriendo en el puerto 3000 (acepta CORS del 4173).
- **Chrome o Edge** (Firefox de escritorio no instala PWAs).

```bash
npm install                    # baja las dependencias, incluido vite-plugin-pwa
npm run dev                    # http://localhost:5173: debe salir el catálogo de clases
git checkout -b practica-24    # rama nueva para la práctica
```

---

## Paso 1 · El manifiesto

`VitePWA` sale del paquete **`vite-plugin-pwa`**: un plugin de Vite que, al compilar, genera el
manifiesto y el service worker por ti. Reemplaza todo `vite.config.ts`:

```ts
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
    }),
  ],
});
```

## Paso 2 · El service worker y la caché

**Workbox** es la librería de Google que usa el plugin para escribir el `sw.js`. Tú sólo le dices
**qué** guardar y **con qué estrategia**. Dentro de `VitePWA({ ... })`, después de `manifest`:

```ts
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
```

## Paso 3 · Compilar, ver lo que generó Vite, e instalar

En `npm run dev` **no** hay service worker (estorbaría mientras programas). La PWA se prueba así:

```bash
npm run build      # compila y genera la PWA en dist/
npm run preview    # sirve dist/ en http://localhost:4173
```

```
PWA v2.0.0
mode      generateSW
precache  20 entries (…)
files generated
  dist/sw.js
```

**Lo que `vite-plugin-pwa` hizo por ti.** Abre la carpeta `dist/`:

| Archivo | Qué es |
|---|---|
| `manifest.webmanifest` | Tu bloque `manifest` del Paso 1, convertido en JSON |
| `sw.js` | El service worker que escribió Workbox con tu bloque del Paso 2 (minificado) |
| `workbox-xxxx.js` | La librería Workbox que usa `sw.js` |
| `registerSW.js` | El paso **register**: `navigator.serviceWorker.register('/sw.js')` |
| `index.html` | Ahora trae `<link rel="manifest">` y `<script src="/registerSW.js">` |

Abre `http://localhost:4173` y en DevTools (F12) → **Application** revisa:

1. **Manifest:** nombre e íconos sin advertencias.
2. **Service workers:** `sw.js` activo (punto verde).
3. **Cache Storage:** el precache de Workbox, `api-clases` y `api-imagenes` con lo que ya visitaste.

**Instálala en la PC (queda en el escritorio):**

- **Chrome:** ícono de pantalla con flecha ⤓ en la barra de direcciones → **Instalar**. Si no quedó
  en el escritorio: `chrome://apps` → clic derecho en *Titanes* → **Crear accesos directos** →
  **Escritorio**.
- **Edge:** ícono **App disponible** en la barra de direcciones → **Instalar** → marca **Crear
  acceso directo de escritorio** y **Anclar a la barra de tareas**.
- Abre en su propia ventana, como programa. **Desinstalar:** menú **⋮** de esa ventana →
  **Desinstalar**.

**Sin red:** en DevTools → **Network** marca **Offline** y recarga: el catálogo sigue abriendo.

**En el celular** se necesita **HTTPS**, o sea el gimnasio desplegado en Netlify (por
`http://192.168…` no se instala):

- **Android (Chrome):** menú **⋮** → **Instalar aplicación**.
- **iPhone (Safari):** botón **Compartir** → **Agregar a pantalla de inicio**.

## Paso 4 · Nuestro botón «Instalar app»

El ícono de la barra casi nadie lo ve. Cuando la app es instalable, Chrome, Edge y Android disparan
el evento `beforeinstallprompt`: lo guardamos y lo lanzamos desde **nuestro** botón. Safari
(iPhone) y Firefox no lo tienen: ahí el botón no sale y se instala a mano.

Crea `src/hooks/useInstalar.ts`:

```ts
import { useEffect, useState } from 'react';

// TypeScript no trae el tipo de este evento (aún no es estándar): lo declaramos nosotros
interface EventoInstalar extends Event {
  prompt: () => Promise<void>; // abre el diálogo nativo de «Instalar»
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>; // si aceptó o canceló
}

// Hook que dice si se puede instalar y da la función para hacerlo desde un botón propio
export function useInstalar() {
  const [evento, setEvento] = useState<EventoInstalar | null>(null); // null = no se ofrece instalar

  useEffect(() => {
    const guardar = (e: Event) => {
      e.preventDefault(); // evita la mini barra automática de Android: el botón es nuestro
      setEvento(e as EventoInstalar); // se guarda para usarlo cuando den clic
    };
    const instalada = () => setEvento(null); // ya se instaló: el botón desaparece
    window.addEventListener('beforeinstallprompt', guardar); // suscribirse al montar
    window.addEventListener('appinstalled', instalada);
    return () => {
      // Limpieza al desmontar: sin ella queda un listener colgado de window por cada montaje
      window.removeEventListener('beforeinstallprompt', guardar);
      window.removeEventListener('appinstalled', instalada);
    };
  }, []); // [] = suscribirse una sola vez

  async function instalar() {
    if (!evento) return;
    await evento.prompt(); // sólo funciona dentro de un clic del usuario
    await evento.userChoice; // espera a que acepte o cancele
    setEvento(null); // el evento se usa UNA sola vez
  }

  return { puedeInstalar: evento !== null, instalar };
}
```

En `src/componentes/Encabezado.tsx`, el import arriba y la llamada dentro de `Encabezado()`:

```tsx
import { useInstalar } from '../hooks/useInstalar.ts';

const { puedeInstalar, instalar } = useInstalar(); // junto a useSesion()
```

Dentro de `<div className="barra__sesion">`, antes de `{usuario ? (`:

```tsx
{/* Sólo se pinta si el navegador ofreció instalar; ya instalada o en Safari, no aparece */}
{puedeInstalar && (
  <button className="boton boton--secundario boton--chico" onClick={instalar}>
    Instalar app
  </button>
)}
```

`npm run build && npm run preview`. Si la instalaste en el Paso 3, **desinstálala** primero: ya
instalada, el botón no sale.

## Paso 5 · Avisar que no hay red — **escríbelo tú**

Sin red la app abre igual (la sirve el SW), así que hay que avisar que lo que se ve puede ser viejo.
Crea `src/hooks/useEnLinea.ts` con el **mismo patrón** que `useInstalar`:

- Estado inicial: `navigator.onLine` (`true` si hay red en este instante).
- Escucha los eventos `'online'` y `'offline'` de `window`, y **quítalos en la limpieza**.
- Regresa un `boolean`.

<details>
<summary>Ver la solución (intenta primero)</summary>

```ts
import { useEffect, useState } from 'react';

// Hook que regresa true/false según haya red, y se actualiza solo cuando cambia
export function useEnLinea(): boolean {
  const [enLinea, setEnLinea] = useState(navigator.onLine); // ¿hay red en este instante?

  useEffect(() => {
    const prender = () => setEnLinea(true); // volvió la red
    const apagar = () => setEnLinea(false); // se fue la red
    window.addEventListener('online', prender);
    window.addEventListener('offline', apagar);
    return () => {
      window.removeEventListener('online', prender); // limpieza al desmontar
      window.removeEventListener('offline', apagar);
    };
  }, []);

  return enLinea;
}
```

</details>

En `src/componentes/Layout.tsx`, importa el hook, llama `const enLinea = useEnLinea();` dentro de
`Layout()` y debajo de `<Encabezado />`:

```tsx
{/* La franja sólo existe sin red: avisa que lo que se ve es lo último guardado */}
{!enLinea && (
  <p className="aviso aviso--sin-red">
    Sin conexión · estás viendo lo último que se guardó en este dispositivo.
  </p>
)}
```

Al final de `src/index.css`:

```css
/* Franja amarilla de ancho completo pegada al encabezado */
.aviso--sin-red { margin: 0; border-radius: 0; text-align: center; background: #fdf3dc; color: #7a5a06; }
```

`npm run build && npm run preview`, y prueba con **Offline**: sale la franja amarilla.

## Paso 6 · Compartir y vibrar

Funciones del teléfono desde la web. Regla: **detectar antes de usar**; si no existen, plan B.
En `src/paginas/PaginaClase.tsx`:

1. Dentro de `inscribir()`, después del `setAviso` de éxito:

```ts
navigator.vibrate?.(80); // vibra 80 ms; el ?. evita que truene en iPhone y PC, donde no existe
```

2. Antes de los `if (cargando)`, la función:

```tsx
// Comparte con la hoja nativa del teléfono; si no existe, copia el enlace
async function compartir() {
  if (!clase) return; // sin clase cargada no hay nada que compartir
  const datos = {
    title: clase.nombre, // el título que ve quien recibe
    text: `${clase.nombre} en Gimnasio Titanes · ${clase.duracionMin} min`, // el mensaje
    url: window.location.href, // el enlace a esta misma clase
  };
  if (navigator.share) {
    // Existe en celulares; sólo funciona en HTTPS o localhost y dentro de un clic
    try {
      await navigator.share(datos);
    } catch {
      // el usuario cerró la hoja sin elegir: no es un error
    }
  } else {
    // Plan B para la PC: copiar al portapapeles y avisar
    await navigator.clipboard.writeText(datos.url);
    setAviso({ tipo: 'exito', texto: 'Enlace copiado. Pégalo donde quieras compartirlo.' });
  }
}
```

3. Debajo de la descripción de la clase, el botón:

```tsx
<p>
  <button className="boton boton--secundario boton--chico" onClick={compartir}>
    Compartir
  </button>
</p>
```

En la computadora se copia el enlace; en un celular se abre la hoja de compartir del teléfono.

---

## Entregable

Tu repositorio del gimnasio de React (público), rama `practica-24`, con una carpeta `evidencias/`
que tenga capturas de:

1. DevTools → Application → **Manifest** sin advertencias.
2. DevTools → Application → **Service workers** con `sw.js` activo.
3. El botón **Instalar app** en el encabezado.
4. La app **instalada**, abierta en su propia ventana.
5. La app en modo **Offline** con la franja «Sin conexión».
6. El botón **Compartir** funcionando (la hoja del teléfono o el aviso de «Enlace copiado»).

En iVirtual sube el enlace del repositorio.

## Preguntas (respóndelas en tu README)

1. ¿Cuáles son los tres requisitos de una PWA y qué hace cada uno?
2. ¿Qué archivos generó `vite-plugin-pwa` en `dist/` y para qué sirve cada uno?
3. ¿Por qué las clases usan `NetworkFirst` y las imágenes `CacheFirst`?
4. ¿Por qué en `npm run dev` no hay service worker?
5. ¿Qué diferencia hay entre una PWA y una aplicación híbrida?

## Si algo falla

| Síntoma | Qué hacer |
|---|---|
| No sale el botón **Instalar** del navegador | Revisa Application → Manifest; usa `build` + `preview`, no `dev` |
| No sale el botón **Instalar app** | Ya está instalada (desinstálala), o estás en Safari/Firefox |
| `Property 'prompt' does not exist on type 'Event'` | Falta la interfaz `EventoInstalar` al inicio de `useInstalar.ts` |
| Sin red no abre nada | Visita las páginas una vez **con** red para que se guarden |
| No carga el catálogo en el puerto 4173 | El backend debe aceptar CORS del 4173 (`git pull` en `gimnasio-backend`) |
| Los cambios no se ven después del `build` | El SW sirvió la versión guardada: recarga otra vez |
| `navigator.share` no hace nada en la PC | Es normal: en la PC se copia el enlace |

---

## Para ir más allá: PWA en Angular y en JavaScript puro

Los tres requisitos son los mismos en cualquier web; sólo cambia quién genera el manifiesto y el SW.

- **Angular:** `ng add @angular/pwa` crea el manifiesto, los íconos, `ngsw-config.json` (la caché:
  `freshness` = NetworkFirst, `performance` = CacheFirst) y registra el SW. Se prueba con
  `ng build`, igual que aquí. → <https://angular.dev/ecosystem/service-workers>
- **JavaScript puro:** escribes a mano `manifest.webmanifest`, `sw.js` (con los eventos `install`,
  `activate` y `fetch`) y el `navigator.serviceWorker.register('/sw.js')`. Sírvelo con
  `npx serve .`: abriendo el `.html` con doble clic no hay SW. → <https://web.dev/learn/pwa>

| Para qué | Dónde |
|---|---|
| Curso completo de PWA, de cero | <https://web.dev/learn/pwa> |
| Referencia en español (manifiesto, SW, APIs) | <https://developer.mozilla.org/es/docs/Web/Progressive_web_apps> |
| `vite-plugin-pwa` (React, Vue, Svelte) | <https://vite-pwa-org.netlify.app/> |
| Workbox y sus estrategias | <https://developer.chrome.com/docs/workbox> |
