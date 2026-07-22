import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import swaggerAutogen from 'swagger-autogen';
import swaggerUi from 'swagger-ui-express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputFile = path.join(__dirname, 'swagger-output.json');
const endpointsFiles = [path.join(__dirname, '../../index.js')];

const doc = {
  info: {
    title: 'API REST Didatica - SENAC',
    description: 'Documentacao gerada automaticamente com swagger-autogen.',
    version: '1.0.0'
  },
  host: `${process.env.API_URL || `localhost:${process.env.PORT || 4000}`}`,
  schemes: ['http'],
  consumes: ['application/json', 'multipart/form-data'],
  produces: ['application/json'],
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      in: 'header',
      name: 'Authorization',
      description: 'Use o formato Bearer <token>.'
    }
  },
  definitions: {
    Usuario: {
      type: 'object',
      properties: {
        id: { type: 'integer', example: 1 },
        nome: { type: 'string', example: 'Ana Costa' },
        email: { type: 'string', example: 'ana@email.com' },
        telefone: { type: 'string', example: '27999881122' },
        foto: { type: 'string', example: null }
      }
    },
    Tarefa: {
      type: 'object',
      properties: {
        id: { type: 'integer', example: 1 },
        titulo: { type: 'string', example: 'Estudar Node.js' },
        descricao: { type: 'string', example: 'Revisar rotas e controllers' },
        status: {
          type: 'string',
          enum: ['Novo', 'Em Andamento', 'Concluido'],
          example: 'Novo'
        },
        usuarioId: { type: 'integer', example: 1 }
      }
    },
    MensagemErro: {
      type: 'object',
      properties: {
        mensagem: { type: 'string', example: 'Erro ao processar a requisicao.' }
      }
    }
  }
};

const swaggerAutogenInstance = swaggerAutogen({
  autoHeaders: false
});

export async function generateSwaggerDocs() {
  await swaggerAutogenInstance(outputFile, endpointsFiles, doc);
}

export function setupSwagger(app) {
  const swaggerDocument = JSON.parse(readFileSync(outputFile, 'utf8'));

  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.get('/docs.json', (req, res) => {
    res.json(swaggerDocument);
  });
}
