// Mantemos all/get/run para os controllers usarem SQL com ?.
// Internamente os placeholders sao convertidos para o formato do PostgreSQL.

import { Pool } from 'pg';
import 'dotenv/config';

let dbConnection = null;

function getConnectionString() {
  // Aceita nomes alternativos comuns para evitar erro de configuracao.
  return (
    process.env.CONN_STRINGS
    || process.env.CONN_STRING
    || process.env.DATABASE_URL
  );
}

function getConnectionErrorMessage(error, connectionString) {
  const rawMessage = error?.message || 'Erro desconhecido ao conectar no banco.';

  try {
    const url = new URL(connectionString);
    const host = url.hostname || 'host-desconhecido';
    const port = url.port || '5432';

    if (error?.code === 'ENOTFOUND' || error?.code === 'EAI_AGAIN') {
      return `Nao foi possivel resolver o host do banco (${host}). Verifique host e internet.`;
    }

    if (error?.code === 'ECONNREFUSED' || error?.code === 'ETIMEDOUT') {
      return `Nao foi possivel conectar em ${host}:${port}. Verifique porta, firewall e disponibilidade do banco.`;
    }

    if (/password authentication failed/i.test(rawMessage) || error?.code === '28P01') {
      return 'Usuario ou senha do banco invalidos. Confira usuario/senha na connection string.';
    }

    if (/no pg_hba.conf entry/i.test(rawMessage) || /ssl/i.test(rawMessage)) {
      return 'Falha de SSL/politica de acesso do Postgres. Em Supabase, mantenha SSL habilitado.';
    }
  } catch {
    return `${rawMessage} A connection string parece estar mal formatada.`;
  }

  return rawMessage;
}

async function criarTabelasBase(pool) {
  // Tabelas criadas apenas se ainda nao existirem.
  await pool.query(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY GENERATED ALWAYS as IDENTITY,
      nome TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      telefone TEXT,
      senha TEXT NOT NULL,
      foto TEXT
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS tarefas (
      id INTEGER PRIMARY KEY GENERATED ALWAYS as IDENTITY,
      titulo TEXT NOT NULL,
      descricao TEXT,
      status TEXT NOT NULL DEFAULT 'Novo',
      usuarioId INTEGER NOT NULL,
      FOREIGN KEY (usuarioId) REFERENCES usuarios (id) ON DELETE CASCADE
    );
  `);
}

function toPgPlaceholders(sql) {
  let index = 0;
  // Converte "?" em "$1", "$2"... para compatibilidade com o pg.
  return sql.replace(/\?/g, () => {
    index += 1;
    return `$${index}`;
  });
}

function createAdapter(pool) {
  // Adapter simples para manter o mesmo contrato usado nos controllers.
  return {
    async all(sql, params = []) {
      const query = toPgPlaceholders(sql);
      const result = await pool.query(query, params);
      return result.rows;
    },

    async get(sql, params = []) {
      const query = toPgPlaceholders(sql);
      const result = await pool.query(query, params);
      return result.rows[0] ?? undefined;
    },

    async run(sql, params = []) {
      let query = toPgPlaceholders(sql);
      // Em INSERT, devolve o id criado para facilitar resposta 201.
      const isInsert = /^\s*insert\s+/i.test(sql);
      if (isInsert && !/\breturning\b/i.test(sql)) {
        query += ' RETURNING id';
      }

      const result = await pool.query(query, params);
      return {
        lastID: result.rows?.[0]?.id ?? null,
        changes: result.rowCount ?? 0
      };
    }
  };
}

export async function getDatabase() {
  if (!dbConnection) {
    const connectionString = getConnectionString();

    if (!connectionString) {
      throw new Error('Defina CONN_STRINGS (ou CONN_STRING / DATABASE_URL) no .env');
    }

    const pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false }
    });

    try {
      // Valida conexao e cria as tabelas base (sem apagar dados existentes).
      await pool.query('SELECT 1');
      await criarTabelasBase(pool);
    } catch (error) {
      const mensagem = getConnectionErrorMessage(error, connectionString);
      throw new Error(`Falha ao conectar no banco: ${mensagem}`);
    }

    dbConnection = createAdapter(pool);
  }

  return dbConnection;
}
