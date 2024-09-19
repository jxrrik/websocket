module.exports = {
  apps: [
    {
      name: "websocket-worker", // Nome da aplicação no PM2
      script: "./src/server.js", // Caminho para o arquivo principal do servidor WebSocket
      instances: 1, // Número de instâncias, 1 para execução única
      exec_mode: "fork", // Modo de execução, pode ser "cluster" para múltiplas instâncias
      watch: false, // Não monitora mudanças de arquivos
      max_memory_restart: "500M", // Reinicia a aplicação se usar mais de 500MB de memória
      env: {
        NODE_ENV: "development", // Variáveis de ambiente para ambiente de desenvolvimento
        PORT: 9002, // Porta do serviço WebSocket
        LOG_LEVEL: "debug",
      },
      env_production: {
        NODE_ENV: "production", // Variáveis de ambiente para ambiente de produção
        PORT: 9002, // Porta para produção também
        LOG_LEVEL: "info",
      },
      log_file: "./logs/worker.log", // Arquivo de log combinado
      error_file: "./logs/worker-error.log", // Arquivo de log de erros
      out_file: "./logs/worker-out.log", // Arquivo de log de saída
      time: true, // Inclui timestamps nos logs
    },
  ],
};
