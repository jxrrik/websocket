// getMessages.js
const WebSocket = require("ws");

// Conectando ao servidor WebSocket
const ws = new WebSocket("wss://log.vidal-app.com/ws");

// Quando a conexão é estabelecida
ws.on("open", () => {
  console.log("Conectado ao servidor WebSocket");

  const requestMessage = {
    action: "getMessages",
    type: "process_reports", // Certifique-se de que este é o tipo correto
    projectId: "639903d1e193693c0d03e01f", // Usando o projectId das mensagens enviadas
    page: 1,
    limit: 10,
  };

  ws.send(JSON.stringify(requestMessage));
  console.log("Requisição para buscar mensagens enviada.");
});

// Receber a resposta do servidor WebSocket
ws.on("message", (data) => {
  try {
    const response = JSON.parse(data.toString());
    if (response.success) {
      console.log("Mensagens recebidas:", response.messages);
    } else {
      console.error("Erro na resposta do servidor:", response.error);
    }
  } catch (error) {
    console.error("Erro ao processar a mensagem recebida:", error.message);
  }
});

// Tratando erros de conexão
ws.on("error", (error) => {
  console.error("Erro de conexão:", error);
});

// Tratando o fechamento da conexão
ws.on("close", () => {
  console.log("Conexão fechada");
});
