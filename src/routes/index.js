// src/routes/index.js
const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const OpenAI = require("openai");

const router = express.Router();

// Configurar OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Rota existente para mensagens
router.get("/messages/:type", authMiddleware, async (req, res) => {
  try {
    const { type } = req.params;
    const { page = 1, limit = 10, projectId } = req.query;

    if (!projectId) {
      return res
        .status(400)
        .json({ error: "O parâmetro 'projectId' é obrigatório." });
    }

    const start = (page - 1) * limit;
    const end = start + limit - 1;

    const messages = await getMessagesFromCache(projectId, type, start, end);

    if (messages.length === 0) {
      return res.status(404).json({
        error: `Nenhuma mensagem do tipo "${type}" encontrada para o projeto "${projectId}".`,
      });
    }

    res.json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ error: "Erro ao recuperar as mensagens do cache" });
  }
});

// Nova rota /chat
router.post("/chat", authMiddleware, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "A mensagem é obrigatória." });
    }

    // Limitar o tamanho da mensagem para evitar custos altos
    if (message.length > 500) {
      return res.status(400).json({ error: "A mensagem é muito longa." });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
      max_tokens: 150, // Limitar a resposta para economizar tokens
    });

    const botResponse = completion.choices[0].message.content.trim();

    res.json({ response: botResponse });
  } catch (error) {
    console.error(
      "Erro ao comunicar com o OpenAI:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Erro interno do servidor." });
  }
});

module.exports = router;
