import { Component, inject, signal } from '@angular/core';
import type { Clase } from './modelos/clase';
import { CLASES_LOCALES } from './datos/clases-locales';
import { TarjetaClase } from './componentes/tarjeta-clase/tarjeta-clase';
import { Catalogo } from './servicios/catalogo';
import { FiltroCategoria } from './componentes/filtro-categoria/filtro-categoria';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  imports: [ RouterLink, RouterLinkActive, RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
}
