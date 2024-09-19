// src/utils/websocketSetup.js
const WebSocket = require("ws");
const { broadcastLastWorkerMessage } = require("./broadcast");
const { saveMessageToCache } = require("./redisCache");
const logger = require("./logger");

let projectClientsMap = {}; // Mapeia projectId para uma lista de objetos { ws, type }

function isValidJson(message) {
  try {
    JSON.parse(message);
    return true;
  } catch (error) {
    return false;
  }
}

function setupWebSocketServer(server) {
  const wss = new WebSocket.Server({ noServer: true });

  wss.on("connection", (ws) => {
    logger.info("Novo cliente conectado");

    let subscribedProjectId = null;
    let subscribedType = null;

    ws.on("message", async (message) => {
      logger.info(`Mensagem recebida bruta: ${message}`);

      if (!isValidJson(message)) {
        logger.error(`Mensagem não é um JSON válido: ${message}`);
        ws.send(
          JSON.stringify({
            success: false,
            error: "Mensagem não é um JSON válido",
          })
        );
        return;
      }

      const parsedMessage = JSON.parse(message);
      logger.info(`Mensagem JSON parseada: ${JSON.stringify(parsedMessage)}`);

      if (parsedMessage.action === "getMessages") {
        subscribedProjectId = parsedMessage.projectId;
        subscribedType = parsedMessage.type || "worker"; // Tipo padrão é 'worker' se não especificado

        // Associa o cliente ao projeto e tipo
        if (!projectClientsMap[subscribedProjectId]) {
          projectClientsMap[subscribedProjectId] = [];
        }

        projectClientsMap[subscribedProjectId].push({
          ws,
          type: subscribedType,
        });
        logger.info(
          `Cliente registrado para o projeto ${subscribedProjectId}, tipo ${subscribedType}. Total de clientes: ${projectClientsMap[subscribedProjectId].length}`
        );

        // Envia a última mensagem do tipo solicitado para o cliente
        await broadcastLastWorkerMessage(
          subscribedProjectId,
          projectClientsMap,
          subscribedType
        );
      } else if (
        parsedMessage.type === "worker" ||
        parsedMessage.type === "process_nfes"
      ) {
        // Processa e salva mensagens do tipo 'worker' ou 'process_nfes'
        await saveMessageToCache(parsedMessage);
        logger.info(
          `Mensagem de ${parsedMessage.type} salva no cache para o projeto ${parsedMessage.projectId}`
        );

        // Transmite a última mensagem armazenada para clientes interessados
        await broadcastLastWorkerMessage(
          parsedMessage.projectId,
          projectClientsMap,
          parsedMessage.type
        );
      } else {
        logger.warn(
          `Ação não reconhecida ou tipo de mensagem não suportado: ${
            parsedMessage.type || parsedMessage.action
          }`
        );
        ws.send(
          JSON.stringify({
            success: false,
            error: "Ação ou tipo de mensagem não suportada",
          })
        );
      }
    });

    ws.on("close", () => {
      logger.info("Cliente desconectado");

      if (subscribedProjectId && projectClientsMap[subscribedProjectId]) {
        projectClientsMap[subscribedProjectId] = projectClientsMap[
          subscribedProjectId
        ].filter((clientObj) => clientObj.ws !== ws);

        logger.info(
          `Cliente removido do projeto ${subscribedProjectId}. Total de clientes restantes: ${projectClientsMap[subscribedProjectId].length}`
        );

        if (projectClientsMap[subscribedProjectId].length === 0) {
          delete projectClientsMap[subscribedProjectId];
          logger.info(
            `Projeto ${subscribedProjectId} removido do mapa de clientes`
          );
        }
      }
    });
  });

  return wss;
}

module.exports = { setupWebSocketServer };
