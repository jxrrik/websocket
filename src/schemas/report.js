// src/schemas/report.js
const Joi = require("joi");

const reportSchema = Joi.object({
  type: Joi.string().valid("report").required(),
  nfe: Joi.string().required(),
  dhEvento: Joi.date().iso().required(),
  cnpj: Joi.string().required(),
  status: Joi.string().required(),
  projectId: Joi.string().required(),
});

module.exports = reportSchema;
