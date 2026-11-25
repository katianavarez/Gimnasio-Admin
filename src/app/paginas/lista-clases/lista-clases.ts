import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TarjetaClase } from '../../componentes/tarjeta-clase/tarjeta-clase';
import { FiltroCategoria } from '../../componentes/filtro-categoria/filtro-categoria';
import { Catalogo } from '../../servicios/catalogo';
import { API_URL } from '../../config';
import { ClasesApi } from '../../servicios/clases-api';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  imports: [RouterLink, TarjetaClase, FiltroCategoria, ReactiveFormsModule],
  selector: 'app-lista-clases',
  styleUrl: './lista-clases.css',
  templateUrl: './lista-clases.html',
})
export class ListaClases {
  protected readonly catalogo = inject(Catalogo);
  protected readonly apiUrl = API_URL;
  protected readonly busqueda = new FormControl(this.catalogo.texto(), {nonNullable: true});

  constructor() {
    this.busqueda.valueChanges.pipe(
      debounceTime(300),
      map((t) => t.trim()),
      distinctUntilChanged(),
      takeUntilDestroyed()
    ).subscribe((texto) => this.catalogo.buscar(texto))
  }

  private readonly api = inject(ClasesApi);

  eliminar(id: number): void {
    if (!confirm(`¿Estás seguro de eliminar la clase?`)) return;

    this.api.eliminar(id).subscribe({
      next: () => {
        this.catalogo.recargar();
      },
      error: (e) => {

      }
    })
  }
}
