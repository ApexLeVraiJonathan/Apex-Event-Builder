import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Tournament API',
      version: '1.0.0',
      description: 'API for managing tournaments and game events',
    },
    servers: [
      {
        url: '/api',
        description: 'API Base URL',
      },
    ],
  },
  apis: [
    './routes/*.js', // Make sure this path is correct
  ],
};

export const swaggerSpec = swaggerJsdoc(options);
