# Tipos de requisicao HTTP

Os metodos HTTP indicam a intencao da requisicao.

Os mais usados sao:

- `GET`: buscar dados.
- `POST`: criar um novo dado.
- `PUT`: atualizar um dado existente.
- `DELETE`: remover um dado.

Exemplos neste projeto:
- `GET /usuarios` lista usuarios.
- `POST /usuarios/login` envia email e senha.
- `POST /tarefas` cria uma tarefa.
- `PUT /tarefas/:id` atualiza uma tarefa.
- `DELETE /tarefas/:id` remove uma tarefa.

Regra pratica:
- `GET` deve ler dados.
- `POST` deve criar.
- `PUT` deve alterar.
- `DELETE` deve apagar.