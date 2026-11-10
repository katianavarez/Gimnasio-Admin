# Práctica 20
**¿Qué diferencia hay entre un signal y un computed, y cuál se parece a useState y cuál a useMemo?**
signal es un valor que podemos cambiar con set() o update() y computed se calcula con otros signals, no se puede cambiar a mano y solo se calcula de nuevo cuando cambia algo de lo que usa. El signal se parece a useState y el computed a useMemo.

**¿Qué pasa si el filtro hace new Catalogo() en lugar de inject(Catalogo)?**
Se crea otra instancia del servicio que solo tiene el filtro, entonces el filtro tendría su propio catálogo aparte. Y al clickear los botones cambia la categoría de ese catálogo pero el tablero sigue usando el que le da angular con inject(), entonces la lista no se filtra.

**Provocar y capturar el aviso NG8109**
Está en evidencias.

# Práctica 19
**¿Qué archivo de Angular hace el papel de main.tsx, de App.tsx y de vite.config.ts?**
main.tsx es src/main.ts, App.tsx es src/app/app.ts junto con su app.html, y vite.config.ts es angular.json.

**¿Por qué clase() lleva paréntesis y para qué sirve track?**
Porque input() regresa un signal y para leer su valor hay que llamarlo como función. El track sirve para que Angular identifique cada elemento de la lista y solo vuelva a pintar los que cambian, es como el key de React.

**Errores provocados**
Capturas en evidencias/practica19.
- NG5002: quitando el track del @for.
- NG8001: quitando TarjetaClase del imports del componente.
