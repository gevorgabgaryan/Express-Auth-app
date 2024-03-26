const path = require("path")

module.exports = {
  apps: [
    {
      name: "main",
      script: "npm",
      args: "start",
      instances: 3,
      autorestart: true,
      watch: ["./src"],
      env: {
        NODE_ENV: "development",
      },
    },
    {
      name: "catalog-service",
      script: "npm",
      args: "start",
      cwd: path.resolve(__dirname, `./microservices/catalog-service`),
      instances: 1,
      autorestart: true,
      watch: ["./src"],
      env: {
        NODE_ENV: "development",
      },
    },
    {
      name: "registry-service",
      script: "npm",
      args: "start",
      cwd: path.resolve(__dirname, `./microservices/registry-service`),
      instances: 1,
      autorestart: true,
      watch: ["./src"],
      env: {
        NODE_ENV: "development",
      },
    },
    ...[ 'order', 'auth'].map((name) => ({
      name,
      cwd: path.resolve(__dirname, `./microservices/${name}-service`),
      script: "npm",
      args: "start",
      instances: 1,
      watch: ["."],
      instance_var: "INSTANCE_ID",
      env: {
        NODE_ENV: "production",
      },
    })),
  ],
}
