# API REST Didatica (SENAC / UC3)

Projeto base para alunos iniciantes praticarem CRUD com Node.js, Express e Supabase.

## Objetivo

Ensinar o fluxo completo de uma API, sem camadas extras:

frontend -> fetch -> routes -> controllers -> db.js -> PostgreSQL/Supabase

## Tecnologias

- Node.js 18+
- Express
- PostgreSQL com `pg`
- JWT com `jsonwebtoken`
- Hash de senha com `bcrypt`
- Upload de imagem com `multer` + Supabase Storage (S3)
- Documentacao da API com Swagger (`swagger-ui-express` + `swagger-autogen`)

## Estrutura do projeto

```text
projeto-senac-back/
├── index.js
├── README.md
├── .env.exemple
└── src/
    ├── controllers/
    │   ├── usuariosController.js
    │   └── tarefasController.js
    ├── routes/
    │   ├── usuariosRoutes.js
    │   └── tarefasRoutes.js
    ├── middlewares/
    │   ├── autenticacao.js
    │   └── uploadImagem.js
    ├── docs/
    │   ├── swagger.js
    │   └── explicacoes/
    │       ├── README.md
    │       ├── api.md
    │       ├── metodos-http.md
    │       ├── status-codes.md
    │       ├── variaveis.md
    │       └── metodos.md
    └── data/
        ├── db.js
        ├── create-tables.sql
        └── insert.sql
```

## O que cada pasta faz

- `routes`: mapeia endpoint para funcao do controller.
- `controllers`: recebe a requisicao, aplica as regras principais e devolve resposta HTTP.
- `middlewares`: regras reutilizaveis (JWT e upload).
- `docs`: configuracao do Swagger e material de apoio didatico.
- `data/db.js`: conexao com o banco e criacao das tabelas base.

## Como executar

1. Instale as dependencias:

```bash
npm install
```
ou 

```bash
powershell -ExecutionPolicy Bypass -Command "npm install"
```


2. Crie o arquivo `.env` usando `.env.exemple` como base.

3. Rode em desenvolvimento:

```bash
npm run dev
```
ou 

```bash
powershell -ExecutionPolicy Bypass -Command "npm run dev"
```


4. Acesse:

`http://localhost:3000` (ou a porta definida em `PORT`)

## Swagger

- Interface: `http://localhost:3000/docs`
- JSON OpenAPI: `http://localhost:3000/docs.json`

A documentacao e gerada automaticamente com `swagger-autogen` a partir dos arquivos de rotas.
Quando criar ou alterar endpoint, ajuste a rota correspondente em `src/routes/` e reinicie a aplicacao.

No Swagger, clique em **Authorize** e informe:

`Bearer SEU_TOKEN`

## Variaveis de ambiente

| Variavel | Descricao |
|---|---|
| `PORT` | Porta da API |
| `JWT_SECRET` | Segredo para assinar o token |
| `JWT_EXPIRES_IN` | Tempo de expiracao do token |
| `CONN_STRINGS` | Conexao PostgreSQL do Supabase |
| `SUPABASE_STORAGE_BUCKET` | Bucket de upload (use `arquivos`) |
| `SUPABASE_STORAGE_REGION` | Regiao do S3 do Supabase |
| `SUPABASE_STORAGE_S3_ENDPOINT` | Endpoint S3 do Supabase |
| `SUPABASE_STORAGE_ACCESS_KEY_ID` | Access key S3 |
| `SUPABASE_STORAGE_SECRET_ACCESS_KEY` | Secret key S3 |
| `SUPABASE_STORAGE_PUBLIC_URL` | URL publica base do Storage |

## Endpoints principais

### Usuarios

- `POST /usuarios` cria usuario
- `POST /usuarios/login` autentica e retorna token
- `GET /usuarios/perfil` retorna usuario do token
- `GET /usuarios` lista usuarios
- `GET /usuarios/:id` busca usuario por id
- `PUT /usuarios/:id` atualiza usuario
- `DELETE /usuarios/:id` remove usuario

Observacao: todas as rotas acima, exceto cadastro e login, exigem token JWT.

### Tarefas

- `GET /tarefas` lista tarefas do usuario logado
- `GET /tarefas/:id` busca tarefa do usuario logado
- `POST /tarefas` cria tarefa
- `PUT /tarefas/:id` atualiza tarefa
- `DELETE /tarefas/:id` remove tarefa

Todas as rotas de tarefas exigem token JWT.

## Header de autenticacao

Use o token retornado no login:

```http
Authorization: Bearer SEU_TOKEN
```

## Upload de imagem

- O upload e feito ao atualizar usuario (`PUT /usuarios/:id`) com `multipart/form-data`.
- Campo esperado: `foto`.
- Tamanho maximo: 5MB.
- Somente arquivos de imagem.

## Explicacoes basicas

O material com conceitos iniciais de programacao fica em `src/docs/explicacoes/`.
Os arquivos cobrem variaveis, metodos, API, tipos de requisicao HTTP e status code.

## Como criar um novo CRUD (passo a passo)

1. Crie a tabela em `src/data/create-tables.sql`.
2. Copie o `CREATE TABLE` para `src/data/db.js`.
3. Crie `src/controllers/recursoController.js`.
4. Crie `src/routes/recursoRoutes.js`.
5. Registre a rota em `index.js`.
6. Teste no Postman/Insomnia.

## Dicas para os alunos

- Sempre comece com CRUD simples.
- Evite criar camadas novas (service/repository) neste projeto base.
- Use SQL direto no controller para facilitar o aprendizado.
- Quando der erro, confira primeiro `.env`, token JWT e nomes das colunas.

## Licenca

Uso educacional.

