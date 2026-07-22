import 'dotenv/config';

import cors from 'cors';
import express from 'express';

import { generateSwaggerDocs, setupSwagger } from './src/docs/swagger.js';
import usuariosRoutes from './src/routes/usuariosRoutes.js';
import tarefasRoutes from './src/routes/tarefasRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globais usados em quase toda API.
app.use(cors());
app.use(express.json());

// Cada recurso fica em um router separado para manter organizacao.
app.use('/usuarios', usuariosRoutes);
app.use('/tarefas', tarefasRoutes);

app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    recursos: [
      'POST /usuarios',
      'POST /usuarios/login',
      'GET  /usuarios/perfil',
      '/usuarios',
      '/tarefas',
      '/docs'
    ]
  });
});

app.use((err, req, res, next) => {
  console.error('[erro nao tratado]', err);
  res.status(500).json({ mensagem: 'Erro interno do servidor.' });
});

async function start() {
  await generateSwaggerDocs();
  setupSwagger(app);

  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
}

start();
