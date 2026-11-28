import { useEffect, useState } from 'react';

// Hook que regresa true/false según haya red, y se actualiza solo cuando cambia
export function useEnLinea(): boolean {
  const [enLinea, setEnLinea] = useState(navigator.onLine); // valor inicial: ¿hay red en este instante?

  useEffect(() => {
    const prender = () => setEnLinea(true); // el navegador avisa que volvió la red
    const apagar = () => setEnLinea(false); // el navegador avisa que se fue la red
    window.addEventListener('online', prender); // suscribirse al montar
    window.addEventListener('offline', apagar);
    return () => {
      // Limpieza al desmontar: sin ella queda un listener colgado de window por cada montaje
      window.removeEventListener('online', prender);
      window.removeEventListener('offline', apagar);
    };
  }, []); // [] = suscribirse una sola vez

  return enLinea;
}