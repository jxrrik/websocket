// src/schemas/process_nfes.js
const Joi = require("joi");

const processNfesSchema = Joi.object({
  type: Joi.string().valid("process_nfes").required(),
  data: Joi.date().iso().required(),
  desc: Joi.string().required(),
  files: Joi.number().min(0).required(),
  reports: Joi.number().min(0).required(),
  erros: Joi.number().min(0).required(),
  projectId: Joi.string().required(),
});

module.exports = processNfesSchema;
