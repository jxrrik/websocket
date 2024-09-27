// src/utils/validator.js
const schemas = require("../schemas");

function validateMessage(message) {
  const schema = schemas[message.type];
  if (!schema) {
    throw new Error(`Tipo de mensagem não suportado: ${message.type}`);
  }
  const { error, value } = schema.validate(message);
  if (error) {
    throw new Error(`Erro de validação: ${error.details[0].message}`);
  }
  return value;
}

module.exports = { validateMessage };
