// src/server.js
require("dotenv").config(); // Carrega as variáveis de ambiente
const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");
const url = require("url");
const config = require("./config");
const { setupWebSocketServer } = require("./utils/websocketSetup");
const logger = require("./utils/logger");

const app = express();
app.use(bodyParser.json());

// Importar e usar as rotas
const routes = require("./routes");
app.use("/api", routes);

const server = http.createServer(app);
const wss = setupWebSocketServer(server);

// Gerenciar o upgrade da conexão HTTP para WebSocket
server.on("upgrade", (request, socket, head) => {
  const { pathname } = url.parse(request.url);

  if (pathname === "/ws") {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit("connection", ws, request);
    });
  } else {
    socket.destroy();
  }
});

server.listen(config.port, () => {
  logger.info(`Servidor WebSocket rodando na porta ${config.port}`);
});
