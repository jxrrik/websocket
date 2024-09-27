// src/schemas/worker.js
const Joi = require("joi");

const workerSchema = Joi.object({
  type: Joi.string().valid("worker").required(),
  workerId: Joi.string().required(),
  status: Joi.number().min(0).required(),
  progress: Joi.object({
    current: Joi.number().min(0).required(),
    total: Joi.number().min(0).required(),
  }).required(),
  details: Joi.object({
    totalFiles: Joi.number().min(0).required(),
    downloaded: Joi.number().min(0).required(),
    downloadRate: Joi.number().min(0).required(),
    estimatedCompletion: Joi.string().required(),
  }).required(),
  projectId: Joi.string().required(),
});

module.exports = workerSchema;
