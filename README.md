# Práctica 19
**¿Qué archivo de Angular hace el papel de main.tsx, de App.tsx y de vite.config.ts?**
main.tsx es src/main.ts, App.tsx es src/app/app.ts junto con su app.html, y vite.config.ts es angular.json.

**¿Por qué clase() lleva paréntesis y para qué sirve track?**
Porque input() regresa un signal y para leer su valor hay que llamarlo como función. El track sirve para que Angular identifique cada elemento de la lista y solo vuelva a pintar los que cambian, es como el key de React.

**Errores provocados**
Capturas en evidencias/practica19.
- NG5002: quitando el track del @for.
- NG8001: quitando TarjetaClase del imports del componente.
