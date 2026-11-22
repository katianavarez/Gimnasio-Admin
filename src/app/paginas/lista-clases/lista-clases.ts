import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TarjetaClase } from '../../componentes/tarjeta-clase/tarjeta-clase';
import { FiltroCategoria } from '../../componentes/filtro-categoria/filtro-categoria';
import { Catalogo } from '../../servicios/catalogo';
import { API_URL } from '../../config';

@Component({
  imports: [RouterLink, TarjetaClase, FiltroCategoria],
  selector: 'app-lista-clases',
  styleUrl: './lista-clases.css',
  templateUrl: './lista-clases.html',
})
export class ListaClases {
  protected readonly catalogo = inject(Catalogo);
  protected readonly apiUrl = API_URL;
}
