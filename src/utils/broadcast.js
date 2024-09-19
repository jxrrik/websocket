// src/utils/broadcast.js
const WebSocket = require("ws");
const { getLastMessage } = require("./redisCache");
const logger = require("./logger");

const broadcastLastWorkerMessage = async (
  projectId,
  projectClientsMap,
  type = "worker"
) => {
  try {
    logger.info(
      `Buscando a última mensagem do tipo '${type}' para o projeto ${projectId}`
    );
    const lastMessage = await getLastMessage(projectId, type);

    if (lastMessage) {
      const clientsForProject = projectClientsMap[projectId] || [];
      logger.info(
        `Clientes encontrados para o projeto ${projectId}: ${clientsForProject.length}`
      );

      let sentCount = 0;
      clientsForProject.forEach((clientObj) => {
        if (
          clientObj.type === type &&
          clientObj.ws.readyState === WebSocket.OPEN
        ) {
          clientObj.ws.send(
            JSON.stringify({ success: true, message: lastMessage })
          );
          sentCount++;
        } else {
          logger.warn(
            `Cliente não está em estado OPEN ou não está inscrito no tipo '${type}'`
          );
        }
      });

      logger.info(`Última mensagem enviada para ${sentCount} clientes`, {
        projectId,
      });
    } else {
      logger.warn(
        `Nenhuma mensagem encontrada para o projeto ${projectId} e tipo '${type}'`
      );
    }
  } catch (error) {
    logger.error("Erro ao buscar ou transmitir a última mensagem", {
      error: error.message,
      stack: error.stack,
      projectId,
    });
  }
};

module.exports = { broadcastLastWorkerMessage };
