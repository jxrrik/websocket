// src/schemas/index.js
const fs = require("fs");
const path = require("path");

const schemas = {};

fs.readdirSync(__dirname).forEach((file) => {
  // Ignora o próprio index.js e quaisquer arquivos que não sejam .js
  if (file !== "index.js" && path.extname(file) === ".js") {
    const schemaName = path.basename(file, ".js"); // Obtém o nome do schema sem a extensão
    schemas[schemaName] = require(`./${file}`); // Importa o schema e adiciona ao objeto
  }
});

module.exports = schemas;
