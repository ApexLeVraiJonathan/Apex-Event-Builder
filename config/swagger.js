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
    components: {
      schemas: {
        TournamentCode: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'The unique identifier for the tournament code',
            },
            code: {
              type: 'string',
              description: 'The actual tournament code value',
            },
            tournamentId: {
              type: 'string',
              description: 'The ID of the tournament this code belongs to',
            },
            status: {
              type: 'string',
              enum: ['active', 'used'],
              description: 'Current status of the tournament code',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'When the code was created',
            },
          },
        },
        TournamentCodeCreate: {
          type: 'object',
          required: ['expiresAt'],
          properties: {
            expiresAt: {
              type: 'string',
              format: 'date-time',
              description: 'When the code expires',
            },
          },
        },
        TournamentCodesResponse: {
          type: 'object',
          properties: {
            codes: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/TournamentCode',
              },
            },
          },
        },
        TournamentCodeResponse: {
          type: 'object',
          properties: {
            code: {
              $ref: '#/components/schemas/TournamentCode',
            },
          },
        },
      },
      responses: {
        BadRequest: {
          description: 'Bad Request',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                    example: 'Invalid request parameters',
                  },
                },
              },
            },
          },
        },
        Unauthorized: {
          description: 'Unauthorized',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                    example: 'Authentication required',
                  },
                },
              },
            },
          },
        },
        NotFound: {
          description: 'Not Found',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                    example: 'Resource not found',
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: [
    './routes/*.js', // Make sure this path is correct
  ],
};

export const swaggerSpec = swaggerJsdoc(options);
