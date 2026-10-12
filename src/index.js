const path = require('node:path');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const { leerArchivoJSON } = require('./archivos');

const PORT = 3000;
let mascotas = [];

async function main() {
  try {
    const rutaDatos = path.join(__dirname, '..', 'datos', 'mascotas.json');
    mascotas = await leerArchivoJSON(rutaDatos);
  } catch (error) {
    console.error('Error de inicio: no se pudo leer el archivo inicial de mascotas.', error.message);
    process.exit(1);
  }

  const app = express();

  
  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, '..', 'views'));
  app.use(expressLayouts);
  app.set('layout', 'layouts/main');


  app.use(express.static(path.join(__dirname, '..', 'public')));
  app.use(express.urlencoded({ extended: false }));


  app.get('/', (req, res) => {
    res.render('inicio', { titulo: 'Inicio' });
  });


  app.get('/mascotas', (req, res) => {
    res.render('mascotas/lista', {
      titulo: 'Catálogo de Mascotas',
      mascotas
    });
  });

  
  app.get('/mascotas/nueva', (req, res) => {
    res.render('mascotas/nueva', {
      titulo: 'Registrar Mascota',
      error: null,
      valores: {}
    });
  });

  
  app.get('/mascotas/:id', (req, res) => {
    const id = Number(req.params.id);
    const mascota = mascotas.find((m) => m.id === id);

    if (!mascota) {
      return res.status(404).render('no-encontrado', {
        titulo: 'Mascota no encontrada',
        idBuscado: req.params.id
      });
    }

    res.render('mascotas/detalle', {
      titulo: `Detalle de ${mascota.nombre}`,
      mascota
    });
  });

  
  app.post('/mascotas', (req, res) => {
    const { nombre, especie, edad, estado, descripcion } = req.body;
    const edadNum = Number(edad);

   
    if (
      !nombre ||
      !nombre.trim() ||
      !especie ||
      !especie.trim() ||
      edad === undefined ||
      edad === '' ||
      isNaN(edadNum) ||
      edadNum < 0 ||
      !estado ||
      !['En adopción', 'Reservada', 'Adoptada'].includes(estado) ||
      !descripcion ||
      !descripcion.trim()
    ) {
      return res.status(400).render('mascotas/nueva', {
        titulo: 'Registrar Mascota',
        error: 'Todos los campos son obligatorios y la edad debe ser un número igual o mayor a 0.',
        valores: req.body
      });
    }

    const nuevoId = mascotas.length > 0 ? Math.max(...mascotas.map((m) => m.id)) + 1 : 1;

    const nuevaMascota = {
      id: nuevoId,
      nombre: nombre.trim(),
      especie: especie.trim(),
      edad: edadNum,
      descripcion: descripcion.trim(),
      estado,
      imagen: '/img/mascota.svg'
    };

    mascotas.push(nuevaMascota);

    res.redirect('/mascotas');
  });

  app.listen(PORT, () => {
    console.log(`Servidor activo escuchando en http://localhost:${PORT}`);
  });
}

main();