import { Suspense } from 'react';
import { Outlet } from 'react-router';
import { Cargando } from './Cargando.tsx';
import { Encabezado } from './Encabezado.tsx';
import { PiePagina } from './PiePagina.tsx';
import { useEnLinea } from '../hooks/useEnLinea.ts';

export function Layout() {
  const enLinea = useEnLinea();

  return (
    <div className="disposicion">
      <Encabezado />
      { !enLinea && (
        <p>Sin conexión a internet - Estás viendo lo último guardado en tu dispositivo.</p>
      )
      }
      <main className="disposicion__contenido">
        <Suspense fallback={<Cargando />}>
          <Outlet />
        </Suspense>
      </main>
      <PiePagina />
    </div>
  );
}
