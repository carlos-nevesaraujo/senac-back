import { Router } from 'express';
import * as controller from '../controllers/usuariosController.js';
import { autenticarJWT } from '../middlewares/autenticacao.js';

const router = Router();

router.post(
	'/',
	/* #swagger.tags = ['Usuarios'] */
	/* #swagger.summary = 'Criar usuario' */
	controller.criar
);

router.post(
	'/login',
	/* #swagger.tags = ['Usuarios'] */
	/* #swagger.summary = 'Login' */
	controller.login
);

router.get(
	'/perfil',
	autenticarJWT,
	/* #swagger.tags = ['Usuarios'] */
	/* #swagger.summary = 'Perfil do usuario logado' */
	/* #swagger.security = [{ "bearerAuth": [] }] */
	controller.perfil
);

router.get(
	'/',
	autenticarJWT,
	/* #swagger.tags = ['Usuarios'] */
	/* #swagger.summary = 'Listar usuarios' */
	/* #swagger.security = [{ "bearerAuth": [] }] */
	controller.listar
);

router.get(
	'/:id',
	autenticarJWT,
	/* #swagger.tags = ['Usuarios'] */
	/* #swagger.summary = 'Buscar usuario por id' */
	/* #swagger.security = [{ "bearerAuth": [] }] */
	controller.buscarPorId
);

router.put(
	'/:id',
	autenticarJWT,
	/* #swagger.tags = ['Usuarios'] */
	/* #swagger.summary = 'Atualizar usuario' */
	/* #swagger.security = [{ "bearerAuth": [] }] */
	controller.atualizar
);

router.delete(
	'/:id',
	autenticarJWT,
	/* #swagger.tags = ['Usuarios'] */
	/* #swagger.summary = 'Remover usuario' */
	/* #swagger.security = [{ "bearerAuth": [] }] */
	controller.remover
);

export default router;
