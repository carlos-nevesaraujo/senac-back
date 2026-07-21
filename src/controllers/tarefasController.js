import { getDatabase } from '../data/db.js';

const STATUS_VALIDOS = ['Novo', 'Em Andamento', 'Concluido'];

function resolverStatus(statusAtual, statusRecebido, concluida) {
  // Frontend pode enviar booleano para facilitar checkbox de concluida.
  if (typeof concluida === 'boolean') {
    return concluida ? 'Concluido' : 'Novo';
  }

  if (typeof statusRecebido === 'string' && STATUS_VALIDOS.includes(statusRecebido)) {
    return statusRecebido;
  }

  return statusAtual;
}

export async function listar(req, res) {
  try {
    const db = await getDatabase();
    // Sempre filtra por usuarioId para nao misturar tarefas de outros usuarios.
    const tarefas = await db.all(
      'SELECT id, titulo, descricao, status, usuarioId FROM tarefas WHERE usuarioId = ? ORDER BY id DESC',
      [req.usuarioId]
    );
    res.json(tarefas);
  } catch (erro) {
    console.error('[tarefas.listar]', erro);
    res.status(500).json({ mensagem: 'Erro ao buscar tarefas.' });
  }
}

export async function buscarPorId(req, res) {
  const { id } = req.params;
  try {
    const db = await getDatabase();
    const tarefa = await db.get(
      'SELECT id, titulo, descricao, status, usuarioId FROM tarefas WHERE id = ? AND usuarioId = ?',
      [id, req.usuarioId]
    );

    if (!tarefa) {
      return res.status(404).json({ mensagem: 'Tarefa não encontrada.' });
    }
    res.json(tarefa);
  } catch (erro) {
    console.error('[tarefas.buscarPorId]', erro);
    res.status(500).json({ mensagem: 'Erro ao buscar tarefa.' });
  }
}

export async function criar(req, res) {
  const { titulo, descricao, status } = req.body;

  if (!titulo || typeof titulo !== 'string' || !titulo.trim()) {
    return res.status(400).json({ mensagem: 'Informe um título válido.' });
  }

  const statusFinal = STATUS_VALIDOS.includes(status) ? status : 'Novo';

  try {
    const db = await getDatabase();
    const resultado = await db.run(
      'INSERT INTO tarefas (titulo, descricao, status, usuarioId) VALUES (?, ?, ?, ?)',
      [titulo.trim(), descricao?.trim() || null, statusFinal, req.usuarioId]
    );

    res.status(201).json({
      id: resultado.lastID,
      titulo: titulo.trim(),
      descricao: descricao?.trim() || null,
      status: statusFinal,
      usuarioId: req.usuarioId
    });
  } catch (erro) {
    console.error('[tarefas.criar]', erro);
    res.status(500).json({ mensagem: 'Erro ao criar tarefa.' });
  }
}

export async function atualizar(req, res) {
  const { id } = req.params;
  const { titulo, descricao, status, concluida } = req.body;

  try {
    const db = await getDatabase();
    const atual = await db.get(
      'SELECT id, titulo, descricao, status, usuarioId FROM tarefas WHERE id = ? AND usuarioId = ?',
      [id, req.usuarioId]
    );

    if (!atual) {
      return res.status(404).json({ mensagem: 'Tarefa não encontrada.' });
    }

    // Atualizacao parcial com fallback no valor atual.
    const novoTitulo = titulo ?? atual.titulo;
    const novaDescricao = descricao ?? atual.descricao;
    const novoStatus = resolverStatus(atual.status, status, concluida);

    await db.run(
      'UPDATE tarefas SET titulo = ?, descricao = ?, status = ? WHERE id = ?',
      [novoTitulo, novaDescricao, novoStatus, id]
    );

    res.json({
      id: Number(id),
      titulo: novoTitulo,
      descricao: novaDescricao,
      status: novoStatus,
      usuarioId: req.usuarioId
    });
  } catch (erro) {
    console.error('[tarefas.atualizar]', erro);
    res.status(500).json({ mensagem: 'Erro ao atualizar tarefa.' });
  }
}

export async function remover(req, res) {
  const { id } = req.params;
  try {
    const db = await getDatabase();
    const resultado = await db.run(
      'DELETE FROM tarefas WHERE id = ? AND usuarioId = ?',
      [id, req.usuarioId]
    );

    if (resultado.changes === 0) {
      return res.status(404).json({ mensagem: 'Tarefa não encontrada.' });
    }
    res.json({ mensagem: 'Tarefa removida com sucesso.' });
  } catch (erro) {
    console.error('[tarefas.remover]', erro);
    res.status(500).json({ mensagem: 'Erro ao remover tarefa.' });
  }
}
