import { Component, inject, input, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Categoria, CATEGORIAS } from '../../modelos/clase';
import { API_URL } from '../../config';
import { multiploDe } from '../../validadores/multiplo-de';
import { ClasesApi } from '../../servicios/clases-api';
import { Catalogo } from '../../servicios/catalogo';
import { HttpErrorResponse } from '@angular/common/http';
import { mensajeDeApi, mensajesDelCuerpo } from '../../servicios/errores';

const IMAGENES = Array.from({ length: 8 }, (_,i) => `/img/clase-0${i+1}.jpg`)

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  selector: 'app-formulario-clase',
  styleUrl: './formulario-clase.css',
  templateUrl: './formulario-clase.html',
})
export class FormularioClase implements OnInit {
  protected readonly categorias = CATEGORIAS;
  protected readonly imagenes = IMAGENES;
  protected readonly apiUrl = API_URL;
  private readonly api = inject(ClasesApi);
  private readonly catalogo = inject(Catalogo);
  private readonly router = inject(Router);

  readonly id = input<string>();

  protected readonly guardando = signal(false);

  protected readonly erroresServidor = signal<string[]>([]);

  protected readonly form = inject(FormBuilder).nonNullable.group({
    nombre: ['', [Validators.required, Validators.maxLength(80)]],
    categoria: ['fuerza' as Categoria, [Validators.required]],
    descripcion: ['', [Validators.required, Validators.maxLength(255)]],
    duracionMin: [45, [Validators.required, Validators.min(10), Validators.max(180), multiploDe(5)]],
    imagen: [IMAGENES[0], Validators.required]
  })

  protected get f(){
    return this.form.controls;
  }

  ngOnInit(): void {
    const id = this.id();
    if (!id) return;

    this.api.obtener(Number(id)).subscribe({
      next: (clase) => this.form.patchValue(clase),
      error: (e) => this.erroresServidor.set([mensajeDeApi(e)])
    });
  }

  tieneCambios(): boolean {
    return this.form.dirty;
  }

  protected guardar(): void{
    if(this.form.invalid){
      this.form.markAllAsTouched();
      return;
    }

    this.guardando.set(true);
    this.erroresServidor.set([]);

    const id = this.id();
    const datos = this.form.getRawValue();
    const peticion = id ? this.api.actualizar(Number(id), datos) : this.api.crear(datos);

    peticion.subscribe({
      next: () => {
        this.form.markAsPristine();
        this.catalogo.recargar();
        this.router.navigate(["/clases"]);
      },
      error: (e: HttpErrorResponse) => {
        const mensajes = e.status === 400 ? mensajesDelCuerpo(e.error): [];
        this.erroresServidor.set(mensajes.length ? mensajes : [mensajeDeApi(e)]);
        this.guardando.set(false);
      }
    });
  }

  protected eliminar(): void {
    const id = this.id();
    if (!id) return;
    if (!confirm(`¿Seguro que quieres eliminar "${this.f.nombre.value}"?`)) return;

    this.guardando.set(true);
    this.api.eliminar(Number(id)).subscribe({
      next: () => {
        this.form.markAsPristine();
        this.catalogo.recargar();
        this.router.navigate(["/clases"]);
      },
      error: (e: HttpErrorResponse) => {
        this.erroresServidor.set([mensajeDeApi(e)]);
        this.guardando.set(false);
      }
    });
  }
}
