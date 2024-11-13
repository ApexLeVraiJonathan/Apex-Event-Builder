import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Event Builder API',
      version: '1.0.0',
      description: 'API documentation for the Event Builder backend',
    },
  },
  apis: ['./routes/*.js'], // Path to your API route files
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};

export default setupSwagger;
