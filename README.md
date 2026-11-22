# Práctica 22
**Si el formulario ya valida, ¿por qué también valida el servidor?**
Porque lo del formulario se puede brincar, como cuando quitamos los Validators o si mandas la petición desde Postman. El servidor es el que guarda en la base de datos entonces él tiene que revisar lo que le llega. La del formulario es más que nada para que el usuario vea el error rápido.

**¿Por qué httpResource para leer y HttpClient para crear, editar y eliminar?**
httpResource pide los datos solo y ya te da el valor, el cargando y el error en signals, que es lo que necesitas para mostrar el catálogo. Crear, editar y eliminar pasan hasta que el usuario le da click a un botón, entonces con HttpClient tú decides cuándo mandar la petición.

**¿Qué pasa si se olvida el subscribe()?**
La petición nunca se manda. El Observable de HttpClient no hace nada hasta que alguien se suscribe, entonces no aparece nada en la pestaña Red y tampoco sale ningún error.

**¿A qué pieza de React corresponden las rutas hijas (children), el interceptor y el guardia?**
Las rutas hijas son como el Layout con el <Outlet /> de React Router, el interceptor es como el interceptor de Axios y el guardia es como el RutaProtegida que te mandaba al login si no había sesión.

**¿Cuándo se ejecuta el guardia y por qué salir() tiene que navegar al login?**
El guardia se ejecuta cuando intentas entrar a una ruta. Si ya estás adentro no se vuelve a revisar, entonces si salir() nomás borrara la sesión te quedarías en la misma página. Por eso tiene que mandarte al login.

**¿Cómo decide un mismo formulario, con dos rutas, si manda POST o PATCH?**
Con el id. La ruta de editar trae el id en la URL y la de nueva no, entonces en guardar() si hay id manda PATCH y si no manda POST.

**¿Por qué el estado del formulario no se puede observar con un computed()?**
Porque computed() solo se actualiza cuando cambia un signal, y el formulario reactivo no usa signals, usa Observables. Entonces aunque escribas en el formulario el computed no se entera.

**¿Qué diferencia hay entre canActivate y canDeactivate, y qué casos no cubre la guarda de salida?**
canActivate se revisa antes de entrar a una ruta, como soloAdmin que no deja pasar si no eres admin. canDeactivate se revisa antes de salir de una ruta, como cambiosSinGuardar que pregunta si hay cambios. La guarda de salida solo funciona cuando se navega con el router de Angular, entonces no cubre cerrar la pestaña, recargar la página o escribir otra dirección en la barra del navegador.



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
