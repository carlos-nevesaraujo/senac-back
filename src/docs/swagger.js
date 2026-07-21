import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.3',
  info: {
    title: 'API REST Didatica - SENAC',
    version: '1.0.0',
    description: 'Documentacao gerada a partir das anotacoes nas rotas.'
  },
  servers: [
    {
      url: `http://localhost:${process.env.PORT || 3000}`,
      description: 'Servidor local'
    }
  ],
  tags: [
    { name: 'Usuarios' },
    { name: 'Tarefas' }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    schemas: {
      Usuario: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          nome: { type: 'string', example: 'Ana Costa' },
          email: { type: 'string', example: 'ana@email.com' },
          telefone: { type: 'string', example: '27999881122' },
          foto: { type: 'string', nullable: true }
        }
      },
      Tarefa: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          titulo: { type: 'string', example: 'Estudar Node.js' },
          descricao: { type: 'string', nullable: true },
          status: {
            type: 'string',
            enum: ['Novo', 'Em Andamento', 'Concluido'],
            example: 'Novo'
          },
          usuarioId: { type: 'integer', example: 1 }
        }
      }
    }
  }
};

const swaggerOptions = {
  definition: swaggerDefinition,
  apis: ['./src/routes/*.js']
};

const openApiSpec = swaggerJsdoc(swaggerOptions);

export function setupSwagger(app) {
  // /docs abre a interface grafica e /docs.json devolve o OpenAPI em JSON.
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiSpec));
  app.get('/docs.json', (req, res) => {
    res.json(openApiSpec);
  });
}
