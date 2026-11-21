import { Routes } from "@angular/router";
import { ListaClases } from "./paginas/lista-clases/lista-clases";
import { Horarios } from "./paginas/horarios/horarios";
import { Miembros } from "./paginas/miembros/miembros";
import { Login } from "./paginas/login/login";
import { Panel } from "./paginas/panel/panel";
import { soloAdmin } from "./sesion/solo-admin";
import { cambiosSinGuardar } from "./paginas/formulario-clase/cambios-sin-guardar";

export const routes: Routes = [
    { path: "login", component: Login },
    { path: "", component: Panel, canActivate: [soloAdmin], children: [
        { path: "clases", component: ListaClases, title: "Clases - Admin" },
        { path: "horarios", component: Horarios, title: "Horarios - Admin" },
        { path: "miembros", component: Miembros, title: "Miembros - Admin" },
        { path: "clases/nueva",
            loadComponent: () => import('./paginas/formulario-clase/formulario-clase')
                .then((m) => m.FormularioClase),
            canDeactivate: [cambiosSinGuardar],
            title: "Nueva clase - Admin" },
        { path: "clases/:id/editar",
            loadComponent: () => import('./paginas/formulario-clase/formulario-clase')
                .then((m) => m.FormularioClase),
            canDeactivate: [cambiosSinGuardar],
            title: "Editar clase - Admin" },
        { path: "", redirectTo: 'clases', pathMatch: 'full' },
    ] },

    { path: "**", redirectTo: "clases"},
];
