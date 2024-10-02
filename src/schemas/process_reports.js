// src/schemas/process_reports.js
const Joi = require("joi");

const processReportsSchema = Joi.object({
  type: Joi.string().valid("process_reports").required(),
  data: Joi.date().iso().required(),
  desc: Joi.string().required(),
  totalXmls: Joi.number().min(0).required(),
  reportsProcessados: Joi.number().min(0).required(),
  reportsAtualizados: Joi.number().min(0).required(),
  tempoProcessamento: Joi.string().required(),
  velocidadeMedia: Joi.string().required(),
  projectId: Joi.string().required(),
});

module.exports = processReportsSchema;
