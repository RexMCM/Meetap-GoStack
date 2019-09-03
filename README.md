# MeetApp
- Api em node para controle de eventos(meetup) ,com banco de dados postgres

## Funcionalidades

### Autenticação

Usuário se autentica utilizando e-mail e senha, retornando JWT

### Cadastro e atualização de usuários

Novos usuários se cadastram utilizando nome, e-mail e senha.Podendo atualizar todos os dados

### Gerenciamento de arquivos

Rota para upload de arquivos que cadastra em uma tabela o caminho e nome do arquivo e retorna todos dados do arquivo cadastrado.

### Gerenciamento de meetups

O usuário pode cadastrar meetups na plataforma com título do meetup, descrição, localização, data e hora e imagem (banner). Todos campos são obrigatórios.

Não é possível cadastrar meetups com datas que já passaram.

O usuário pode editar todos dados de meetups que ainda não aconteceram e que ele é organizador.

Rota para listar os meetups que são organizados pelo usuário logado.

O usuário pode cancelar meetups organizados por ele e que ainda não aconteceram.

### Inscrição no meetup

O usuário pode-se inscrever em meetups que não organiza.

O usuário não pode se inscrever em meetups que já aconteceram.

O usuário não pode se inscrever no mesmo meetup duas vezes.

O usuário não pode se inscrever em dois meetups que acontecem no mesmo horário.

Sempre que um usuário se inscrever no meetup,será enviado um e-mail ao organizador contendo os dados relacionados ao usuário inscrito.

### Listagem de meetups

Rota para listar os meetups com filtro por data, os resultados dessa listagem veem paginados em 10 itens por página. Abaixo tem um exemplo de chamada para a rota de listagem dos meetups:

```
http://localhost:3333/meetups?date=2019-07-01&page=2
```

Nesse exemplo, listaremos a página 2 dos meetups que acontecerão no dia 01 de Julho.

### Listagem de inscrições

Crie uma rota para listar os meetups em que o usuário logado está inscrito.

Liste apenas meetups que ainda não passaram e ordene meetups mais próximos como primeiros da lista.
