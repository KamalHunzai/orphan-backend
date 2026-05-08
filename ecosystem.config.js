module.exports = {
  apps: [
    {
      name: "orphan-api",
      script: "app.js",
      instances: "max",
      exec_mode: "cluster",
      env_production: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};
