import { Router } from 'express';
import * as controller from '../controllers/tarefasController.js';
import { autenticarJWT } from '../middlewares/autenticacao.js';

const router = Router();

router.use(autenticarJWT);

router.get(
	'/',
	/* #swagger.tags = ['Tarefas'] */
	/* #swagger.summary = 'Listar tarefas do usuario logado' */
	/* #swagger.security = [{ "bearerAuth": [] }] */
	controller.listar
);

router.get(
	'/:id',
	/* #swagger.tags = ['Tarefas'] */
	/* #swagger.summary = 'Buscar tarefa por id' */
	/* #swagger.security = [{ "bearerAuth": [] }] */
	controller.buscarPorId
);

router.post(
	'/',
	/* #swagger.tags = ['Tarefas'] */
	/* #swagger.summary = 'Criar tarefa' */
	/* #swagger.security = [{ "bearerAuth": [] }] */
	controller.criar
);

router.put(
	'/:id',
	/* #swagger.tags = ['Tarefas'] */
	/* #swagger.summary = 'Atualizar tarefa' */
	/* #swagger.security = [{ "bearerAuth": [] }] */
	controller.atualizar
);

router.delete(
	'/:id',
	/* #swagger.tags = ['Tarefas'] */
	/* #swagger.summary = 'Remover tarefa' */
	/* #swagger.security = [{ "bearerAuth": [] }] */
	controller.remover
);

export default router;
