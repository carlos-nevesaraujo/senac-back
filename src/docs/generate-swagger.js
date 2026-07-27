import { generateSwaggerDocs } from './swagger.js';

try {
  await generateSwaggerDocs();
  console.log('Swagger gerado com sucesso!');
} catch (error) {
  console.error('Erro ao gerar Swagger:', error);
  process.exit(1);
}