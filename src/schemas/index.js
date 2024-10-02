// src/schemas/index.js
const report = require("./report");
const worker = require("./worker");
const process_nfes = require("./process_nfes");
const process_reports = require("./process_reports"); // Adicionado

module.exports = {
  report,
  worker,
  process_nfes,
  process_reports, // Adicionado
};
