// src/schemas/report.js
const reportSchema = {
  type: "object",
  properties: {
    type: { type: "string", enum: ["report"] },
    nfe: { type: "string" },
    dhEvento: { type: "string", format: "date-time" },
    cnpj: { type: "string" },
    status: { type: "string" },
    projectId: { type: "string" },
  },
  required: ["type", "nfe", "dhEvento", "cnpj", "status", "projectId"],
};

module.exports = reportSchema;
