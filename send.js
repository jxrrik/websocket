// send.js
const WebSocket = require("ws");

// Conecte-se ao servidor WebSocket
const ws = new WebSocket("wss://log.vidal-app.com/ws");

// Quando a conexão é estabelecida
ws.on("open", () => {
  console.log("Conectado ao servidor WebSocket");

  // Crie a mensagem de relatório conforme o esquema definido
  const reportMessage = {
    type: "report",
    nfe: "123456789",
    dhEvento: new Date().toISOString(),
    cnpj: "12345678901234",
    status: "OK",
    projectId: "644c2e39f64a4dcb4d65d58b",
  };

  // Envie a mensagem de relatório para o servidor via WebSocket
  ws.send(JSON.stringify(reportMessage));
  console.log("Mensagem de relatório enviada ao servidor");
});

// Receba mensagens do servidor
ws.on("message", (data) => {
  try {
    const response = JSON.parse(data.toString());
    if (response.success) {
      console.log("Mensagem enviada com sucesso:", response);
    } else {
      console.error("Erro na resposta do servidor:", response.error);
    }
  } catch (error) {
    console.error("Erro ao processar a mensagem recebida:", error.message);
  }
});

// Tratamento de erros
ws.on("error", (error) => {
  console.error("Erro no WebSocket:", error);
});

// Quando a conexão é fechada
ws.on("close", () => {
  console.log("Conexão WebSocket fechada");
});
