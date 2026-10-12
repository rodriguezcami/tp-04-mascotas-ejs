# Trabajo práctico 04

## Descripción

Aplicación web con Node.js, Express y EJS para consultar mascotas en adopción y agregar nuevas de forma temporal mediante un formulario.

## Instalación

```bash
npm install
```

## Ejecución

```bash
npm start
```

Luego abrir http://localhost:3000. Para detener el servidor, presionar `Ctrl + C` en la terminal. Para verificar la sintaxis: `npm run check`.

## Páginas y rutas

| Método | Ruta | Descripción | Respuesta |
|--------|------|-------------|-----------|
| GET | `/` | Página inicial | 200 |
| GET | `/mascotas` | Listado (o mensaje de estado vacío) | 200 |
| GET | `/mascotas/nueva` | Formulario de alta | 200 |
| GET | `/mascotas/:id` | Detalle de una mascota | 200, o 404 si no existe |
| POST | `/mascotas` | Crea una mascota en memoria | 302 a `/mascotas`, o 400 si hay errores |

`/mascotas/nueva` se declara antes de `/mascotas/:id`; si no, Express interpretaría "nueva" como un identificador.

## Estructura de vistas

- **Layout** (`views/layouts/main.ejs`): estructura HTML común a todas las páginas (`<head>`, encabezado, `<main>`, pie y script). Recibe el contenido de cada vista en `<%- body %>`.
- **Vista** (`inicio.ejs`, `mascotas/lista.ejs`, etc.): el contenido propio de cada página, que se inserta dentro del layout.
- **Parcial** (`partials/encabezado.ejs`, `partials/pie.ejs`): fragmentos reutilizables que el layout incluye con `include`.

`res.render('vista', { datos })` envía un objeto a la vista: cada propiedad queda disponible como variable dentro del archivo EJS (por ejemplo `mascotas` en el listado).

Los datos se muestran con `<%= ... %>`, que escapa el HTML. La salida sin escapar `<%- ... %>` se usa solo para `body` y los `include`.

## Recursos estáticos

`express.static` sirve los archivos de la carpeta `public/` directamente, sin necesidad de definir rutas. Por eso las URLs no incluyen `/public`:

- `/css/estilos.css`
- `/img/mascota.svg`
- `/js/app.js`

## Formulario

El formulario (`/mascotas/nueva`) envía nombre, especie, edad, estado y descripción con `method="post"` a `/mascotas`.

`express.urlencoded` interpreta el cuerpo del formulario y lo deja disponible en `req.body`.

Validaciones: todos los campos son obligatorios (sin textos de solo espacios), la edad debe ser un número igual o mayor a 0 y el estado debe ser uno de los tres permitidos. Si hay error, el servidor responde 400, muestra un mensaje con `role="alert"` y conserva los valores ingresados.

Recorrido del envío válido: el navegador hace POST a `/mascotas`; el servidor crea la mascota con un nuevo id y la imagen `/img/mascota.svg`, la agrega al arreglo y responde con una redirección (302) a `/mascotas`; el navegador hace entonces un GET a `/mascotas` y muestra el listado con la nueva tarjeta. Se redirige para que, al recargar la página, no se reenvíe el formulario.

## Persistencia de los datos

Los datos iniciales se leen de `datos/mascotas.json` al arrancar y se guardan en un arreglo en memoria. Las mascotas nuevas se agregan solo a ese arreglo y no se escriben en el archivo. Al reiniciar el servidor, la memoria se vacía y se vuelve a cargar el JSON, por lo que se regresa a los cinco registros iniciales.