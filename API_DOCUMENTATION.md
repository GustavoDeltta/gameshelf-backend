# Documentação da API GameShelf

Esta documentação descreve como utilizar a API RESTful da GameShelf.

## Informações Gerais

### URL Base
A URL base para todos os endpoints da API é:
`http://localhost:8080` (ou o endereço do seu servidor de produção).

### Autenticação
A maioria dos endpoints que manipulam dados de usuários são protegidos e requerem um Token de Autenticação (JWT).

Para se autenticar, envie uma requisição para o endpoint de `login` e, após o sucesso, inclua o token recebido no cabeçalho `Authorization` de todas as requisições subsequentes para rotas protegidas.

**Formato do Cabeçalho:**
`Authorization: Bearer <SEU_TOKEN_JWT>`

---

## 1. Autenticação

Endpoints para registro, login e gerenciamento de contas de usuário.

### `POST /api/auth/register`
- **Descrição:** Registra um novo usuário.
- **Autenticação:** Nenhuma.
- **Corpo da Requisição (`application/json`):**
  ```json
  {
    "email": "usuario@exemplo.com",
    "password": "senhaForte123",
    "username": "Nome de Usuário"
  }
  ```
- **Resposta de Sucesso (201 Created):**
  ```json
  {
    "message": "User registered successfully",
    "user": {
      "uid": "FirebaseUID",
      "email": "usuario@exemplo.com",
      "username": "Nome de Usuário"
    }
  }
  ```

### `POST /api/auth/login`
- **Descrição:** Autentica um usuário e retorna um token de sessão.
- **Autenticação:** Nenhuma.
- **Corpo da Requisição (`application/json`):**
  ```json
  {
    "email": "usuario@exemplo.com",
    "password": "senhaForte123"
  }
  ```
- **Resposta de Sucesso (200 OK):**
  ```json
  {
    "token": "SEU_TOKEN_JWT",
    "user": {
      "uid": "FirebaseUID",
      "email": "usuario@exemplo.com",
      "username": "Nome de Usuário",
      "steamId": "7656119..."
    }
  }
  ```

### `POST /api/auth/link-steam`
- **Descrição:** Associa uma Steam ID à conta do usuário autenticado.
- **Autenticação:** **Requerida**.
- **Corpo da Requisição (`application/json`):**
  ```json
  {
    "steamId": "7656119..."
  }
  ```
- **Resposta de Sucesso (200 OK):**
  ```json
  {
    "message": "Steam ID linked successfully",
    "user": {
        "uid": "FirebaseUID",
        "email": "usuario@exemplo.com",
        "username": "Nome de Usuário",
        "steamId": "7656119..."
    }
  }
  ```

---

## 2. Listas de Jogos (Gamelists)

Endpoints para gerenciar as listas de jogos dos usuários. Todas as rotas deste módulo requerem autenticação.

### `POST /api/gamelists`
- **Descrição:** Cria uma nova lista de jogos.
- **Autenticação:** **Requerida**.
- **Corpo da Requisição (`application/json`):**
  ```json
  {
    "name": "Meus Jogos Favoritos",
    "description": "Uma lista dos jogos que mais gostei de jogar."
  }
  ```
- **Resposta de Sucesso (201 Created):**
  ```json
  {
    "id": "ID_DA_LISTA",
    "name": "Meus Jogos Favoritos",
    "description": "Uma lista dos jogos que mais gostei de jogar.",
    "ownerId": "FirebaseUID",
    "games": []
  }
  ```

### `GET /api/gamelists`
- **Descrição:** Retorna todas as listas de jogos do usuário autenticado.
- **Autenticação:** **Requerida**.
- **Resposta de Sucesso (200 OK):**
  ```json
  [
    {
      "id": "ID_DA_LISTA_1",
      "name": "Meus Jogos Favoritos",
      // ... outros campos
    },
    {
      "id": "ID_DA_LISTA_2",
      "name": "Jogos para Zerar",
      // ... outros campos
    }
  ]
  ```

### `GET /api/gamelists/:listId`
- **Descrição:** Retorna os detalhes de uma lista de jogos específica.
- **Autenticação:** **Requerida**.
- **Parâmetros da URL:**
  - `listId` (string, obrigatório): O ID da lista de jogos.
- **Resposta de Sucesso (200 OK):**
  ```json
  {
    "id": "ID_DA_LISTA",
    "name": "Meus Jogos Favoritos",
    "description": "Uma lista dos jogos que mais gostei de jogar.",
    "ownerId": "FirebaseUID",
    "games": [440, 550]
  }
  ```

### `PUT /api/gamelists/:listId`
- **Descrição:** Atualiza o nome ou a descrição de uma lista de jogos.
- **Autenticação:** **Requerida**.
- **Parâmetros da URL:**
  - `listId` (string, obrigatório): O ID da lista de jogos.
- **Corpo da Requisição (`application/json`):**
  ```json
  {
    "name": "Novo Nome da Lista",
    "description": "Nova descrição."
  }
  ```
- **Resposta de Sucesso (200 OK):**
  ```json
  {
    "message": "List updated successfully",
    "list": {
        "id": "ID_DA_LISTA",
        "name": "Novo Nome da Lista",
        "description": "Nova descrição.",
        // ... outros campos
    }
  }
  ```

### `DELETE /api/gamelists/:listId`
- **Descrição:** Deleta uma lista de jogos.
- **Autenticação:** **Requerida**.
- **Parâmetros da URL:**
  - `listId` (string, obrigatório): O ID da lista de jogos.
- **Resposta de Sucesso (200 OK):**
  ```json
  {
    "message": "List deleted successfully"
  }
  ```

### `POST /api/gamelists/:listId/games`
- **Descrição:** Adiciona um jogo a uma lista de jogos.
- **Autenticação:** **Requerida**.
- **Parâmetros da URL:**
  - `listId` (string, obrigatório): O ID da lista de jogos.
- **Corpo da Requisição (`application/json`):**
  ```json
  {
    "gameId": 550
  }
  ```
- **Resposta de Sucesso (200 OK):**
  ```json
  {
    "message": "Game added to list successfully"
  }
  ```

### `DELETE /api/gamelists/:listId/games`
- **Descrição:** Remove um jogo de uma lista de jogos.
- **Autenticação:** **Requerida**.
- **Parâmetros da URL:**
  - `listId` (string, obrigatório): O ID da lista de jogos.
- **Corpo da Requisição (`application/json`):**
  ```json
  {
    "gameId": 550
  }
  ```
- **Resposta de Sucesso (200 OK):**
  ```json
  {
    "message": "Game removed from list successfully"
  }
  ```

---

## 3. Registro de Jogos (Game Log)

Endpoints para registrar e acompanhar o progresso dos jogos. Todas as rotas deste módulo requerem autenticação.

### `POST /api/gamelog`
- **Descrição:** Cria um novo registro de jogo para o usuário.
- **Autenticação:** **Requerida**.
- **Corpo da Requisição (`application/json`):**
  ```json
  {
    "gameId": 550,
    "status": "playing" // (playing, completed, dropped, backlog)
  }
  ```
- **Resposta de Sucesso (201 Created):**
  ```json
  {
    "id": "ID_DO_LOG",
    "userId": "FirebaseUID",
    "gameId": 550,
    "status": "playing",
    "createdAt": "2025-12-09T18:00:00.000Z"
  }
  ```

### `GET /api/gamelog`
- **Descrição:** Retorna todos os registros de jogos do usuário autenticado.
- **Autenticação:** **Requerida**.
- **Resposta de Sucesso (200 OK):**
  ```json
  [
    {
      "id": "ID_DO_LOG_1",
      "gameId": 550,
      "status": "playing",
      // ... outros campos
    },
    {
      "id": "ID_DO_LOG_2",
      "gameId": 440,
      "status": "completed",
      // ... outros campos
    }
  ]
  ```

### `PUT /api/gamelog/:logId/status`
- **Descrição:** Atualiza o status de um registro de jogo.
- **Autenticação:** **Requerida**.
- **Parâmetros da URL:**
  - `logId` (string, obrigatório): O ID do registro de jogo.
- **Corpo da Requisição (`application/json`):**
  ```json
  {
    "status": "completed" // (playing, completed, dropped, backlog)
  }
  ```
- **Resposta de Sucesso (200 OK):**
  ```json
  {
    "message": "Game log status updated successfully"
  }
  ```

### `DELETE /api/gamelog/:logId`
- **Descrição:** Deleta um registro de jogo.
- **Autenticação:** **Requerida**.
- **Parâmetros da URL:**
  - `logId` (string, obrigatório): O ID do registro de jogo.
- **Resposta de Sucesso (200 OK):**
  ```json
  {
    "message": "Game log deleted successfully"
  }
  ```

---

## 4. Avaliações (Reviews)

Endpoints para criar e consultar avaliações de jogos.

### `POST /api/reviews/:gameId`
- **Descrição:** Cria ou atualiza uma avaliação para um jogo específico.
- **Autenticação:** **Requerida**.
- **Parâmetros da URL:**
  - `gameId` (number, obrigatório): O App ID do jogo.
- **Corpo da Requisição (`application/json`):**
  ```json
  {
    "rating": 5, // (1-5)
    "comment": "Este jogo é incrível!"
  }
  ```
- **Resposta de Sucesso (201 ou 200 OK):**
  ```json
  {
    "id": "ID_DA_REVIEW",
    "userId": "FirebaseUID",
    "gameId": 550,
    "rating": 5,
    "comment": "Este jogo é incrível!",
    "createdAt": "2025-12-09T18:00:00.000Z"
  }
  ```

### `GET /api/reviews/game/:gameId`
- **Descrição:** Retorna todas as avaliações para um jogo específico.
- **Autenticação:** Nenhuma.
- **Parâmetros da URL:**
  - `gameId` (number, obrigatório): O App ID do jogo.
- **Resposta de Sucesso (200 OK):** (Array de avaliações)

### `GET /api/reviews/user/:userId`
- **Descrição:** Retorna todas as avaliações de um usuário específico.
- **Autenticação:** Nenhuma.
- **Parâmetros da URL:**
  - `userId` (string, obrigatório): O UID do usuário.
- **Resposta de Sucesso (200 OK):** (Array de avaliações)

### `GET /api/reviews/me`
- **Descrição:** Retorna todas as avaliações do usuário autenticado.
- **Autenticação:** **Requerida**.
- **Resposta de Sucesso (200 OK):** (Array de avaliações)

### `GET /api/reviews/me/:gameId`
- **Descrição:** Retorna a avaliação do usuário autenticado para um jogo específico.
- **Autenticação:** **Requerida**.
- **Parâmetros da URL:**
  - `gameId` (number, obrigatório): O App ID do jogo.
- **Resposta de Sucesso (200 OK):** (Objeto de avaliação ou 404 se não encontrado)

### `DELETE /api/reviews/:gameId`
- **Descrição:** Deleta a avaliação do usuário autenticado para um jogo.
- **Autenticação:** **Requerida**.
- **Parâmetros da URL:**
  - `gameId` (number, obrigatório): O App ID do jogo.
- **Resposta de Sucesso (200 OK):**
  ```json
  {
    "message": "Review deleted successfully"
  }
  ```

---

## 5. Steam API

Endpoints para interagir com dados da API da Steam.

### `GET /api/steam/game/:appId`
- **Descrição:** Retorna informações detalhadas de um jogo da Steam.
- **Autenticação:** Nenhuma.
- **Parâmetros da URL:**
  - `appId` (number, obrigatório): O App ID do jogo na Steam.
- **Resposta de Sucesso (200 OK):** (Objeto com detalhes do jogo da API da Steam)

### `GET /api/steam/game/:appId/achievements/:playerId`
- **Descrição:** Retorna as conquistas de um jogador para um jogo específico.
- **Autenticação:** Nenhuma.
- **Parâmetros da URL:**
  - `appId` (number, obrigatório): O App ID do jogo na Steam.
  - `playerId` (string, obrigatório): A Steam ID do jogador.
- **Resposta de Sucesso (200 OK):** (Objeto com as conquistas do jogador)

### `GET /api/steam/game/:appId/achievements-highlights/:playerId`
- **Descrição:** Retorna destaques de conquistas (ex: mais raras, recentes) de um jogador para um jogo.
- **Autenticação:** Nenhuma.
- **Parâmetros da URL:**
  - `appId` (number, obrigatório): O App ID do jogo na Steam.
  - `playerId` (string, obrigatório): A Steam ID do jogador.
- **Resposta de Sucesso (200 OK):** (Objeto com os destaques das conquistas)
