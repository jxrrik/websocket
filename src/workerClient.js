const WebSocket = require("ws");
const { sendWorkerMessage } = require("./utils/sendWorkerMessage");
const moment = require("moment");
const logger = require("./utils/logger");

const wsUri = "wss://log.vidal-app.com/ws";
let ws = null;
let reconnectInterval = 5000;

function initializeWebSocket() {
  ws = new WebSocket(wsUri);

  ws.on("open", () => {
    logger.info("Conectado ao WebSocket logs.vidal-app.com");
  });

  ws.on("error", (error) => {
    logger.error("Erro no WebSocket", { error });
  });

  ws.on("close", () => {
    logger.warn("Conexão com WebSocket fechada. Tentando reconectar...");
    setTimeout(initializeWebSocket, reconnectInterval);
  });
}

function sendMessage(
  projeto,
  totalFiles,
  downloaded,
  downloadRate,
  estimatedCompletion
) {
  sendWorkerMessage(
    ws,
    projeto,
    totalFiles,
    downloaded,
    downloadRate,
    estimatedCompletion
  );
}

module.exports = { initializeWebSocket, sendMessage };
