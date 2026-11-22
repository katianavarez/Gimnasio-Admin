import { computed, Service, signal } from '@angular/core';
import { CLASES_LOCALES } from '../datos/clases-locales';
import { Categoria, Clase, Sobre } from '../modelos/clase';
import { httpResource } from '@angular/common/http';
import { API_URL } from '../config';
import { mensajeDeApi } from './errores';

@Service()
export class Catalogo {

    private readonly recurso = httpResource<Sobre<Clase[]>>(() => `${API_URL}/clases`)

    private readonly clases = computed(() => this.recurso.value()?.data ?? []);

    readonly cargando = computed(() => this.recurso.isLoading());

    readonly error = computed(() => {
        const e = this.recurso.error();
        return e ? mensajeDeApi(e) : null;
    })

    readonly categoria = signal<Categoria | 'todas'>("todas");

    readonly seleccionada = signal<Clase | null>(null);

    // derivada
    readonly visibles = computed(() => {
        const cat = this.categoria();
        const todas = this.clases();
        return cat === "todas" ? todas: todas.filter((c) => c.categoria === cat)
    });

    readonly minutosTotales = computed(() => {
        return this.visibles().reduce((suma, c) => suma + c.duracionMin, 0)
    })

    filtrar(categoria: Categoria | "todas"): void {
        this.categoria.set(categoria);
        const elegida = this.seleccionada();
        if (elegida && categoria !== "todas" && elegida.categoria !== categoria) {
            this.seleccionada.set(null);
        }
    }

    seleccionar(clase: Clase): void {
        this.seleccionada.update((actual) => (actual?.id === clase.id ? null : clase)) 
    }

    recargar(): void {
        this.seleccionada.set(null);
        this.recurso.reload();
    }
}
