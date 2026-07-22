# API

API significa Application Programming Interface.

Uma API e uma forma de um sistema conversar com outro por meio de regras claras.

Neste projeto, o frontend faz requisicoes HTTP para a API e a API responde com JSON.

Fluxo simples:

```mermaid
flowchart LR
  F[Frontend] --> R[Rota]
  R --> C[Controller]
  C --> D[Banco de dados]
  D --> C
  C --> J[Resposta JSON]
```

A API define:
- quais rotas existem
- quais dados cada rota recebe
- que resposta cada rota devolve
- quais erros podem acontecer

Exemplo de uso:
- cadastrar usuario
- fazer login
- listar tarefas
- atualizar uma tarefa
- remover um registro

Uma boa API deixa o sistema organizado e facil de consumir por frontends, apps mobile e testes no Postman.