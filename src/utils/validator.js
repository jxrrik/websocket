// src/utils/validator.js
const Joi = require("joi");
const schemas = require("../schemas");

const schemaMap = {};

Object.keys(schemas).forEach((key) => {
  schemaMap[key] = Joi.object(schemas[key]);
});

function validateMessage(message) {
  const schema = schemaMap[message.type];
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
