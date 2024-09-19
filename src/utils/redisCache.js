// src/utils/redisCache.js
const Redis = require("ioredis");
const redis = new Redis();
const logger = require("./logger");

const MAX_MESSAGES_PER_TYPE = 50;

const saveMessageToCache = async (message) => {
  try {
    const key = `websocketMessages:${message.type}:${message.projectId}`;
    const messageString = JSON.stringify(message);

    // Armazenar a mensagem no cache Redis
    await redis.lpush(key, messageString);

    // Limitar o número de mensagens armazenadas no Redis
    await redis.ltrim(key, 0, MAX_MESSAGES_PER_TYPE - 1);

    logger.info(`Mensagem armazenada em cache`, {
      messageType: message.type,
      projectId: message.projectId,
    });

    // Verificação para debugging
    const savedMessages = await redis.lrange(key, 0, 0);
    if (savedMessages.length > 0) {
      const savedMessage = JSON.parse(savedMessages[0]);
      logger.info(
        `Verificação: Última mensagem no cache: ${JSON.stringify(savedMessage)}`
      );
    } else {
      logger.warn(
        `Verificação: Nenhuma mensagem encontrada no cache após salvar`,
        { messageType: message.type, projectId: message.projectId }
      );
    }
  } catch (error) {
    logger.error("Erro ao salvar mensagem no cache", {
      error: error.message,
      stack: error.stack,
      messageType: message.type,
      projectId: message.projectId,
    });
    throw error;
  }
};

const getLastMessage = async (projectId, type) => {
  try {
    const key = `websocketMessages:${type}:${projectId}`;
    const messages = await redis.lrange(key, 0, 0); // Recupera apenas a última mensagem
    if (messages.length === 0) {
      logger.warn(`Nenhuma mensagem encontrada para o projeto ${projectId}`, {
        type,
      });
      return null;
    }

    const lastMessage = JSON.parse(messages[0]);
    logger.info(
      `Última mensagem do tipo '${type}' recuperada do Redis para o projeto ${projectId}: ${JSON.stringify(
        lastMessage
      )}`
    );
    return lastMessage;
  } catch (error) {
    logger.error("Erro ao buscar a última mensagem", {
      error: error.message,
      projectId,
    });
    throw error;
  }
};

module.exports = { saveMessageToCache, getLastMessage };
