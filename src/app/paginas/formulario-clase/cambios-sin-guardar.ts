import { CanDeactivateFn } from '@angular/router';
import type { FormularioClase } from './formulario-clase';

export const cambiosSinGuardar: CanDeactivateFn<FormularioClase> = (componente) => {
  if (!componente.tieneCambios()) return true;
  return confirm('Tienes cambios sin guardar. ¿Seguro que quieres salir?');
};
