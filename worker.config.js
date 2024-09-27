// worker.config.js
require("dotenv").config(); // Carrega as variáveis de ambiente do .env

module.exports = {
  apps: [
    {
      name: "websocket-worker",
      script: "./src/server.js",
      instances: 1,
      exec_mode: "fork",
      watch: false,
      max_memory_restart: "500M",
      env: {
        NODE_ENV: "development",
        PORT: 9002,
        LOG_LEVEL: "debug",
        OPENAI_API_KEY: process.env.OPENAI_API_KEY,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 9002,
        LOG_LEVEL: "info",
        OPENAI_API_KEY: process.env.OPENAI_API_KEY,
      },
      log_file: "./logs/worker.log",
      error_file: "./logs/worker-error.log",
      out_file: "./logs/worker-out.log",
      time: true,
    },
  ],
};
