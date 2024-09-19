// src/schemas/process_nfes.js
const processNfesSchema = {
  type: "object",
  properties: {
    type: { type: "string", enum: ["process_nfes"] },
    data: { type: "string", format: "date-time" },
    desc: { type: "string" },
    files: { type: "number", minimum: 0 },
    reports: { type: "number", minimum: 0 },
    erros: { type: "number", minimum: 0 },
    projectId: { type: "string" },
  },
  required: ["type", "data", "desc", "files", "reports", "erros", "projectId"],
};

module.exports = processNfesSchema;
