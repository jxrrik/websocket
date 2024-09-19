const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { getMessagesFromCache } = require("../utils/redisCache");

const router = express.Router();

router.get("/messages/:type", authMiddleware, async (req, res) => {
  try {
    const { type } = req.params;
    const { count } = req.query;
    const messageCount = count ? parseInt(count) : 10;

    const messages = await getMessagesFromCache(messageCount);
    const filteredMessages = messages.filter((msg) => msg.type === type);

    if (filteredMessages.length === 0) {
      return res
        .status(404)
        .json({ error: `Nenhuma mensagem do tipo "${type}" encontrada.` });
    }

    res.json({ success: true, filteredMessages });
  } catch (error) {
    res.status(500).json({ error: "Erro ao recuperar as mensagens do cache" });
  }
});

module.exports = router;
