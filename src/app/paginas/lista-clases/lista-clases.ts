import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { Categoria, CATEGORIAS } from '../../modelos/clase';

const IMAGENES = Array.from({ length: 8 }, (_,i) => `/img/clase-0${i+1}.jpg`)

@Component({
  imports: [ReactiveFormsModule, RouterLink, JsonPipe],
  selector: 'app-lista-clases',
  styleUrl: './lista-clases.css',
  templateUrl: './lista-clases.html',
})
export class ListaClases {
  protected readonly categorias = CATEGORIAS;
  protected readonly imagenes = IMAGENES;

  protected readonly form = inject(FormBuilder).nonNullable.group({
    nombre: ['', [Validators.required, Validators.maxLength(80)]],
    categoria: ['fuerza' as Categoria, [Validators.required]],
    descripcion: ['', [Validators.required, Validators.maxLength(255)]],
    duracionMin: [45, [Validators.required, Validators.min(10), Validators.max(180)]],
    imagen: [IMAGENES[0], Validators.required]
  })

  protected get f() {
    return this.form.controls;
  }

  protected guardar(): void {
    if(this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
  }
}
