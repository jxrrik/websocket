const WebSocket = require("ws");

// Conectando ao servidor WebSocket
const ws = new WebSocket("wss://log.vidal-app.com/ws");

// Quando a conexão é estabelecida
ws.on("open", () => {
  console.log("Conectado ao servidor WebSocket");

  // Criando a mensagem conforme o modelo solicitado
  const message = {
    type: "worker", // Adicionando o campo "type"
    workerId: "WORKER 1",
    status: 0,
    progress: {
      current: 0,
      total: 10000,
    },
    details: {
      totalFiles: 235,
      downloaded: 235,
      downloadRate: 235,
      estimatedCompletion: "13:00", // Alterando para um formato de string válido para "horário"
    },
    projectId: "639903d1e193693c0d03e01f", // ID do projeto
  };

  // Enviando a mensagem para o servidor WebSocket
  ws.send(JSON.stringify(message));

  console.log("Mensagem enviada:", message);
});

// Recebendo a resposta do servidor
ws.on("message", (data) => {
  console.log("Resposta do servidor:", data.toString());
});

// Tratando erros de conexão
ws.on("error", (error) => {
  console.error("Erro de conexão:", error);
});

// Tratando o fechamento da conexão
ws.on("close", () => {
  console.log("Conexão fechada");
});
