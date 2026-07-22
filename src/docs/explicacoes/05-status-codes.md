# Status code

Status code e o numero que a API devolve para dizer se a requisicao deu certo ou nao.

Os mais comuns neste projeto sao:

- `200 OK`: requisicao concluida com sucesso.
- `201 Created`: recurso criado com sucesso.
- `400 Bad Request`: dados enviados estao errados ou incompletos.
- `401 Unauthorized`: falta autenticacao ou token invalido.
- `403 Forbidden`: autenticado, mas sem permissao.
- `404 Not Found`: recurso nao encontrado.
- `500 Internal Server Error`: erro inesperado no servidor.

Exemplo:
- se o usuario manda senha errada no login, a API pode responder `401`
- se uma tarefa nao existe, a API pode responder `404`
- se o cadastro foi criado, a API pode responder `201`

Status code ajuda o frontend e o cliente da API a entender o resultado da operacao rapidamente.