const WebSocket = require("ws");

// Conectando ao servidor WebSocket
const ws = new WebSocket("ws://localhost:9002/ws");

// Quando a conexão é estabelecida
ws.on("open", () => {
  console.log("Conectado ao servidor WebSocket");

  const requestMessage = {
    action: "getMessages",
    type: "worker",
    projectId: "639903d1e193693c0d03e01f", // Corrigido de 'prjectId' para 'projectId'
  };

  ws.send(JSON.stringify(requestMessage));
  console.log("Requisição para buscar mensagens do tipo 'worker' enviada.");
});

// Receber a resposta do servidor WebSocket
ws.on("message", (data) => {
  try {
    const response = JSON.parse(data);
    if (response.success) {
      console.log(response);
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
