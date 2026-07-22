import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getDatabase } from '../data/db.js';
import { processarUploadImagem } from '../middlewares/uploadImagem.js';

const SALT_ROUNDS = 10;

function ehErroEmailDuplicado(erro) {
  // 23505 = violacao de UNIQUE no PostgreSQL.
  return erro?.code === '23505' || erro?.message?.includes('UNIQUE constraint failed');
}

export async function listar(req, res) {
  try {
    const db = await getDatabase();
    const usuarios = await db.all(
      'SELECT id, nome, email, telefone, foto FROM usuarios ORDER BY id'
    );
    res.json(usuarios);
  } catch (erro) {
    console.error('[usuarios.listar]', erro);
    res.status(500).json({ mensagem: 'Erro ao buscar usuários.' });
  }
}

export async function buscarPorId(req, res) {
  const { id } = req.params;
  try {
    const db = await getDatabase();
    const usuario = await db.get(
      'SELECT id, nome, email, telefone, foto FROM usuarios WHERE id = ?',
      [id]
    );

    if (!usuario) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
    }
    res.json(usuario);
  } catch (erro) {
    console.error('[usuarios.buscarPorId]', erro);
    res.status(500).json({ mensagem: 'Erro ao buscar usuário.' });
  }
}

export async function criar(req, res) {
  const { nome, email, telefone, senha } = req.body;

  if (!nome || !email || !telefone || !senha) {
    return res.status(400).json({ mensagem: 'Campos obrigatórios ausentes.' });
  }

  try {
    const db = await getDatabase();

    // Nunca salvamos senha em texto puro.
    const senhaHash = await bcrypt.hash(senha, SALT_ROUNDS);

    const resultado = await db.run(
      'INSERT INTO usuarios (nome, email, telefone, senha) VALUES (?, ?, ?, ?)',
      [nome, email, telefone, senhaHash]
    );

    res.status(201).json({
      id: resultado.lastID,
      nome,
      email,
      telefone,
      foto: null
    });
  } catch (erro) {
    if (ehErroEmailDuplicado(erro)) {
      return res.status(409).json({ mensagem: 'Este e-mail já está cadastrado.' });
    }
    console.error('[usuarios.criar]', erro);
    res.status(500).json({ mensagem: 'Erro ao salvar usuário.' });
  }
}

export async function atualizar(req, res) {
  const idAlvo = Number(req.params.id);

  // Regra de permissao: usuario so altera o proprio cadastro.
  if (idAlvo !== req.usuarioId) {
    return res.status(403).json({
      mensagem: 'Você só pode editar o próprio usuário.'
    });
  }

  const { nome, email, telefone, senha } = req.body;

  try {
    let novaFotoUpload = null;

    const contentType = req.headers['content-type'] || '';
    if (contentType.includes('multipart/form-data')) {
      const upload = await processarUploadImagem(req, res, { pasta: 'perfil', campo: 'foto' });
      novaFotoUpload = upload.publicUrl;
    }

    const db = await getDatabase();
    const atual = await db.get('SELECT * FROM usuarios WHERE id = ?', [idAlvo]);

    if (!atual) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
    }

    // Atualizacao parcial: se campo nao vier no body, mantem o valor atual.
    const novoNome = nome ?? atual.nome;
    const novoEmail = email ?? atual.email;
    const novoTelefone = telefone ?? atual.telefone;
    const novaFoto = novaFotoUpload ?? req.body.foto ?? atual.foto;
    let novaSenha = atual.senha;

    if (senha) {
      novaSenha = await bcrypt.hash(senha, SALT_ROUNDS);
    }

    await db.run(
      'UPDATE usuarios SET nome = ?, email = ?, telefone = ?, senha = ?, foto = ? WHERE id = ?',
      [novoNome, novoEmail, novoTelefone, novaSenha, novaFoto, idAlvo]
    );

    res.json({
      id: idAlvo,
      nome: novoNome,
      email: novoEmail,
      telefone: novoTelefone,
      foto: novaFoto
    });
  } catch (erro) {
    if (erro?.message === 'A imagem deve ter no máximo 5MB.' || erro?.message === 'Apenas arquivos de imagem são permitidos.') {
      return res.status(400).json({ mensagem: erro.message });
    }

    if (ehErroEmailDuplicado(erro)) {
      return res.status(409).json({ mensagem: 'Este e-mail já está cadastrado.' });
    }
    console.error('[usuarios.atualizar]', erro);
    res.status(500).json({ mensagem: 'Erro ao atualizar usuário.' });
  }
}

export async function remover(req, res) {
  const idAlvo = Number(req.params.id);

  // Regra de permissao: usuario so remove o proprio cadastro.
  if (idAlvo !== req.usuarioId) {
    return res.status(403).json({
      mensagem: 'Você só pode remover o próprio usuário.'
    });
  }

  try {
    const db = await getDatabase();
    const resultado = await db.run('DELETE FROM usuarios WHERE id = ?', [idAlvo]);

    if (resultado.changes === 0) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
    }
    res.json({ mensagem: 'Usuário removido com sucesso.' });
  } catch (erro) {
    console.error('[usuarios.remover]', erro);
    res.status(500).json({ mensagem: 'Erro ao remover usuário.' });
  }
}

export async function login(req, res) {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ mensagem: 'Informe email e senha.' });
  }

  try {
    const db = await getDatabase();
    const usuario = await db.get(
      'SELECT id, nome, email, senha, foto FROM usuarios WHERE email = ?',
      [email]
    );

    if (!usuario) {
      return res.status(401).json({ mensagem: 'Credenciais inválidas.' });
    }

    const senhaConfere = await bcrypt.compare(senha, usuario.senha);
    if (!senhaConfere) {
      return res.status(401).json({ mensagem: 'Credenciais inválidas.' });
    }

    // Token identifica o usuario nas proximas requisicoes protegidas.
    const token = jwt.sign(
      { usuarioId: usuario.id, nome: usuario.nome },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );

    res.json({
      token,
      usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, foto: usuario.foto ?? null }
    });
  } catch (erro) {
    console.error('[usuarios.login]', erro);
    res.status(500).json({ mensagem: 'Erro ao autenticar.' });
  }
}

export async function perfil(req, res) {
  try {
    const db = await getDatabase();
    const usuario = await db.get(
      'SELECT id, nome, email, telefone, foto FROM usuarios WHERE id = ?',
      [req.usuarioId]
    );

    if (!usuario) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
    }
    res.json(usuario);
  } catch (erro) {
    console.error('[usuarios.perfil]', erro);
    res.status(500).json({ mensagem: 'Erro ao buscar perfil.' });
  }
}

