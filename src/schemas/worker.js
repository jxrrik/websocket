const workerSchema = {
  type: "object",
  properties: {
    type: { type: "string", enum: ["worker"] },
    workerId: { type: "string" },
    status: { type: "number", minimum: 0 },
    progress: {
      type: "object",
      properties: {
        current: { type: "number", minimum: 0 },
        total: { type: "number", minimum: 0 },
      },
      required: ["current", "total"],
    },
    details: {
      type: "object",
      properties: {
        totalFiles: { type: "number", minimum: 0 },
        downloaded: { type: "number", minimum: 0 },
        downloadRate: { type: "number", minimum: 0 },
        estimatedCompletion: { type: "string" },
      },
      required: [
        "totalFiles",
        "downloaded",
        "downloadRate",
        "estimatedCompletion",
      ],
    },
    projectId: { type: "string" },
  },
  required: ["type", "workerId", "status", "progress", "details", "projectId"],
};

module.exports = workerSchema;
