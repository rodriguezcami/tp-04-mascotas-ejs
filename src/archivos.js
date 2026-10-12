const fs = require('node:fs/promises');

/**
 * Lee de forma asíncrona un archivo JSON y retorna su contenido interpretado.
 * @param {string} ruta - Ruta completa del archivo.
 * @returns {Promise<Array|Object>} Contenido parseado.
 */
async function leerArchivoJSON(ruta) {
  const contenido = await fs.readFile(ruta, 'utf8');
  return JSON.parse(contenido);
}

module.exports = {
  leerArchivoJSON
};
