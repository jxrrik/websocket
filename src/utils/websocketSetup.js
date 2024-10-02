// src/utils/websocketSetup.js
const WebSocket = require("ws");
const { saveMessageToCache, getMessagesFromCache } = require("./redisCache");
const { validateMessage } = require("./validator");
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
        const page = parsedMessage.page || 1;
        const limit = parsedMessage.limit || 10;

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

        // Recupera múltiplas mensagens do cache com paginação
        const start = (page - 1) * limit;
        const end = start + limit - 1;

        logger.info(
          `Recuperando mensagens do cache para key: websocketMessages:${subscribedType}:${subscribedProjectId}`
        );

        const messages = await getMessagesFromCache(
          subscribedProjectId,
          subscribedType,
          start,
          end
        );

        logger.info(`Mensagens recuperadas: ${JSON.stringify(messages)}`);

        // Envia as mensagens recuperadas para o cliente
        ws.send(
          JSON.stringify({
            success: true,
            messages: messages,
          })
        );
      } else if (
        parsedMessage.type === "worker" ||
        parsedMessage.type === "process_nfes" ||
        parsedMessage.type === "process_reports" || // Adicionado
        parsedMessage.type === "report"
      ) {
        try {
          // Valida a mensagem usando o validador
          validateMessage(parsedMessage);

          // Processa e salva mensagens
          await saveMessageToCache(parsedMessage);

          logger.info(
            `Mensagem de ${parsedMessage.type} salva no cache para o projeto ${parsedMessage.projectId}`
          );

          // Transmite a mensagem para os clientes inscritos
          broadcastMessageToClients(
            parsedMessage.projectId,
            parsedMessage.type,
            parsedMessage
          );
        } catch (validationError) {
          logger.error(
            `Erro de validação da mensagem: ${validationError.message}`
          );
          ws.send(
            JSON.stringify({
              success: false,
              error: `Erro de validação: ${validationError.message}`,
            })
          );
        }
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

// Função para transmitir mensagens aos clientes inscritos
function broadcastMessageToClients(projectId, messageType, message) {
  const clientsForProject = projectClientsMap[projectId] || [];
  clientsForProject.forEach((clientObj) => {
    if (
      clientObj.type === messageType &&
      clientObj.ws.readyState === WebSocket.OPEN
    ) {
      clientObj.ws.send(JSON.stringify({ success: true, message }));
    }
  });
}

module.exports = { setupWebSocketServer };
