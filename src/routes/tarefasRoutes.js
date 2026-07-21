import { Router } from 'express';
import * as controller from '../controllers/tarefasController.js';
import { autenticarJWT } from '../middlewares/autenticacao.js';

const router = Router();

router.use(autenticarJWT);

/**
 * @openapi
 * /tarefas:
 *   get:
 *     tags: [Tarefas]
 *     summary: Listar tarefas do usuario logado
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de tarefas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Tarefa'
 */
router.get('/', controller.listar);

/**
 * @openapi
 * /tarefas/{id}:
 *   get:
 *     tags: [Tarefas]
 *     summary: Buscar tarefa por id
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tarefa encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tarefa'
 */
router.get('/:id', controller.buscarPorId);

/**
 * @openapi
 * /tarefas:
 *   post:
 *     tags: [Tarefas]
 *     summary: Criar tarefa
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [titulo]
 *             properties:
 *               titulo:
 *                 type: string
 *               descricao:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [Novo, Em Andamento, Concluido]
 *     responses:
 *       201:
 *         description: Tarefa criada
 */
router.post('/', controller.criar);

/**
 * @openapi
 * /tarefas/{id}:
 *   put:
 *     tags: [Tarefas]
 *     summary: Atualizar tarefa
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               descricao:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [Novo, Em Andamento, Concluido]
 *               concluida:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Tarefa atualizada
 */
router.put('/:id', controller.atualizar);

/**
 * @openapi
 * /tarefas/{id}:
 *   delete:
 *     tags: [Tarefas]
 *     summary: Remover tarefa
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tarefa removida
 */
router.delete('/:id', controller.remover);

export default router;
