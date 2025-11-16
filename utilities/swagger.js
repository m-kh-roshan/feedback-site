const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Feedback API",
      version: "1.0.0",
      description: "API Documentation for FeedbackSite"
    },
    servers: [
      {
        url: "http://localhost:3000/api/v1",
        description: "Development server"
      }
    ]
  },
  apis: [
    "./routes/v1/*.js",
    "./swagger/*.js"
    ]
};

const specs = swaggerJsdoc(options);

const setupSwagger = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
};

module.exports = setupSwagger;