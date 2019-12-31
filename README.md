# Spotify App.

## Introducción.

En esta práctica, el objetivo será crear una pequeña app de música, tanto en la parte de front como back.

### Requisitos

```
- fork del repositorio
- clona el repositorio.
- npm i
```

Después de esto, deberás registrarte en spotify (si no lo has hecho ya) para poder obtener tus credenciales para la api.

1. Navega a la siguiente ruta:
   https://developer.spotify.com/dashboard/login
2. Loggeate o registrate
3. Una vez dentro, en el Dashboard, clicka sobre "Create a client id".
4. Rellena los formularios.
5. Cuando se haya creado el proyecto, clicka sobre él y recoge tus credenciales:

    - CLIENT_ID
    - CLIENTE_SECRET

6. Añadelas al archivo .env

Esto servirá para que, cuando se recoja el token, haga uso de vuestras credenciales.

## Iteración 1. Vistas de autenticación

Crea una vista para signup y login.

### Signup view.

Crea una vista con un formulario que acepte los siguientes campos:

```
    - name.
    - lastname.
    - username.
    - email.
    - password.
```

El formulario deberá integrar una petición POST al endpoint /auth/signup

#### Login view.

Crea una vista para el login con los siguientes campos:

```
    - email
    - password

```

**Nota:** si prefieres un registro por username, también puedes hacerlo. Incluso, si quieres, puedes intentar hacer uno que recoja amdas opciones!

El formulario deberá integrar una petición POST al endpoint /auth/login

## Iteración 2. Rutas de autenticación.

Crea las rutas de login, signup y logout, para autenticar los usuarios de la aplicación.
Todos los datos tendrán que ser guardados y recogidos de mongoDB, con el respectivo Schema de mongoose.

### Signup route.

La ruta signup recogerá, a través del body, los siguientes datos:

```
    - name.
    - lastname.
    - username.
    - email.
    - password.
```

Exacto. Los mismo que se envían en el formulario...

Recuerda dar la opción al usuario de poder loggearse si ya tiene una cuenta (crea una etiqueta que redirija a la ruta /login)

Si el proceso es exitoso, se habilitará automáticamente el login del usuario y deberá redirigir a la ruta `/home` de las vistas.

### login route.

Crea una ruta que recoja del body los siguientes parámetros:

```
    - email
    - password

```

Una vez comprobado si existe el usuario se autorizará y redigirá a la ruta `/home`

Recuerda dar la opción al usuario de poder registrarse si aun no tiene una cuenta (crea una etiqueta que redirija a la ruta /signup)

### logout.

Crea una ruta que permita al usuario hacer logout y cierre la sesión.

Si el proceso es exitoso se redirigirá a la ruta `/login`

## Iteración 3. Home.

Crea la vista home.

En esta vista se deberá mostrar un mensaje de bienvenida que incluya al menos el nombre del usuario.

La ruta que envía la vista tendrá que estar securizada con un sistema de autorización.

Más adelante completaremos esta vista.

## Iteración 4. Layout.

No queremos repetir código. Por ello, deberás crear un layout.

Se libre de introducir aquí aquellos elementos que consideres útiles para todas (o casi todas) las vistas.

### navbar

Crea un navbar compartido a las rutas de acceso. Deberá tener al menos una ruta `home` y una ruta `logout`.

**BONUS** ¿Se te ocurre como podrías hacer para no mostrar el navbar en signup y login?

## Iteración 5. Spotify

En la carpeta routes/spotify hay una función que se encarga de conseguir el token de las peticiones a Spotify.

Esta función deberá utilizarse antes de ejecutar cualquier llamada a spotify.

**NOTA:** No olvides introducir tus credenciales de spotify en un archivo .env

### get tracks route

Crea un endpoint (get) que permita recoger canciones para pintarlas en la home. En la home, se mostrarán un listado de los últimos exitos. Busca en la documentación de spotify la funcionalidad `browse/new-releases`

Recuerda que deberás pasarle el token que devuelva la funcion getToken en los headers de la petición del siguiente modo:

```
{
    headers: {
        'Authorization': "Bearer {{token}}",
        'Content-Type': "aplication/json"
    }
}

```

Para ello, importa la función getToken en tus rutas e implementala del siguiente modo:

```
const token = await getToken()
```

Esta ruta deberá renderizar la vista home con la información recibida por spotify.

### Home view.

Actualiza la vista home para que muestre los últimos exitos de spotify

deberá mostrar, al menos, lo siguiente:

-   El nombre del album,
-   El nombre o nombres de los artistas,
-   La primera imagen del album.
-   Un botón "ver más"

El botón ver más, lleverá a la ruta album/{id} que crearemos más adelante.

**BONUS** A veces, un álbum de spotify no tiene canciones. Añade un condicional a la vista para que, si no hay imagen, imprima una imagen por defecto.

### album route.

Crea una ruta get que recibe un parámetro id y que permite buscar en spotify las canciones que contiene ese album. ("Albums/Get an Album's Tracks")

Deberá devolver la vista que crearemos a continuación con la lista de canciones recibidas de spotify. Esta ruta también necesitará de autorización.

### album view.

Ahora tendrás crear una vista que imprima la lista de canciones del álbum que hayamos seleccionado.

Deberá imprimir, al menos, el `TÍTULO` de la canción y una etiqueta audio con la previsualización de la canción.

Spotify permite escuchar los 30 primeros segundos de la canción que queramos de forma gratuita. Esto esta en el atributo `preview_url` dentro del objeto que nos devuelve este endpoint.

Si quieres más información sobre la etiqueta `audio` puedes consultarla aquí:

```
https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio
```

## Iteración 6. Control de errores.

### Ruta not found.

Crear una ruta para que, si la ruta no existe, renderice un html con un error 404.

### Control de errores para cada endpoint.

Dar información a los usuarios sobre los errores que hay (cuando son de cliente) es importante para una buena experiencia de usuario. Crea errores y pintalos cuando sea necesario. Posibles situaciónes.

**SIGNUP:** - El usuario ya existe. - Todos los campos requeridos. - el email no es un email
...

**LOGIN** - El usuario no existe. - la contraseña no es correcta - Todos los campos requeridos.

## BONUS.

Crea tanta rutas como quieras y añade funcionalidades a la aplicación, como una barra de búsqueda o cualquier funcionalidad que encuentres interesante dentro de la documentación.

Añade estas funcionalidades al navbar para que nuestro usuario puede navegar y utilizarlas.

Se libre de utilizar el diseño que quieras.

**Happy codding!**
