// src/middleware/authMiddleware.js
const axios = require("axios");

const validateToken = async (token) => {
  try {
    // Substitua pela sua lógica de validação de token
    const response = await axios.get("https://api.seudominio.com/validate", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.isValid;
  } catch (error) {
    throw new Error("Token inválido ou erro de autenticação");
  }
};

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const isValid = await validateToken(token);
    if (isValid) {
      next();
    } else {
      return res.status(401).json({ error: "Token inválido" });
    }
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
};

module.exports = authMiddleware;
