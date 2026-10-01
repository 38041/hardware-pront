# Documentação da API REST — Gerenciador de Hardware

Esta API REST fornece endpoints para gerenciamento completo (CRUD) de aparelhos de hardware, incluindo cadastro, listagem, consulta por identificador, atualização e remoção.

---

## 1. URL Base

- **Ambiente Local**: `http://localhost:3000/api`
- **Ambiente de Produção (Vercel)**: `https://<seu-projeto>.vercel.app/api`

---

## 2. Configurações e Cabeçalhos Globais

### Headers Comuns

Para requisições com corpo (POST e PUT):

```http
Content-Type: application/json
Accept: application/json
```

### Autenticação
No momento, a API é pública e não requer tokens ou autenticação Bearer.

### CORS
- Origem padrão: todas as origens permitidas em desenvolvimento (`*`).
- Produção: configurável através da variável de ambiente `CORS_ORIGIN`.

---

## 3. Padrão de Respostas

Todas as respostas da API seguem uma estrutura JSON padronizada e previsível.

### Resposta de Sucesso
```json
{
  "success": true,
  "data": { ... }
}
```

### Resposta de Erro
```json
{
  "success": false,
  "error": {
    "message": "Mensagem descritiva do erro ocorrido."
  }
}
```

---

## 4. Modelo de Dados (Hardware)

| Campo | Tipo | Obrigatório | Descrição | Regras de Validação |
|---|---|---|---|---|
| `_id` | String / ObjectId | Automático | Identificador único gerado pelo MongoDB | 24 caracteres hexadecimais |
| `hardware` | String | Sim | Nome ou tipo do hardware/aparelho | Não vazio, máx. 100 caracteres |
| `marca` | String | Sim | Fabricante da peça ou aparelho | Não vazio, máx. 100 caracteres |
| `modelo` | String | Sim | Modelo específico do aparelho | Não vazio, máx. 100 caracteres |
| `preco` | Number | Sim | Valor monetário em reais (BRL) | Número válido, $\ge 0$ |
| `foto` | String | Não | URL da imagem ilustrativa | URL válida (`http://` ou `https://`) ou string vazia |
| `createdAt` | Date (ISO 8601) | Automático | Data e hora de criação do registro | Gerado automaticamente |
| `updatedAt` | Date (ISO 8601) | Automático | Data e hora da última atualização | Gerado automaticamente |

---

## 5. Endpoints

### 5.1. Status da API (Health Check)
Verifica se a aplicação está ativa.

- **Método**: `GET`
- **Rota**: `/` ou `/api`
- **Status HTTP**: `200 OK`

#### Exemplo cURL:
```bash
curl -X GET http://localhost:3000/
```

#### Resposta:
```json
{
  "success": true,
  "data": {
    "nome": "API de Gerenciamento de Hardware",
    "versao": "1.0.0",
    "status": "online",
    "endpoints": {
      "listarHardwares": "GET /api/hardware",
      "buscarPorId": "GET /api/hardware/:id",
      "criarHardware": "POST /api/hardware",
      "atualizarHardware": "PUT /api/hardware/:id",
      "excluirHardware": "DELETE /api/hardware/:id"
    }
  }
}
```

---

### 5.2. Listar Todos os Aparelhos
Retorna a lista completa de hardwares cadastrados, ordenados pelos mais recentes.

- **Método**: `GET`
- **Rota**: `/api/hardware`
- **Status HTTP**: `200 OK`

#### Exemplo cURL:
```bash
curl -X GET http://localhost:3000/api/hardware
```

#### Exemplo de Resposta de Sucesso:
```json
{
  "success": true,
  "data": [
    {
      "_id": "674ddc3b28b21c4314e3012a",
      "hardware": "Placa de Vídeo",
      "marca": "NVIDIA",
      "modelo": "RTX 4070 Ti 12GB",
      "preco": 5499.9,
      "foto": "https://images.unsplash.com/photo-1587202372775-e229f172b9d7",
      "createdAt": "2026-10-01T10:00:00.000Z",
      "updatedAt": "2026-10-01T10:00:00.000Z"
    }
  ]
}
```

---

### 5.3. Buscar Aparelho por ID
Consulta os dados de um aparelho específico a partir do seu identificador único.

- **Método**: `GET`
- **Rota**: `/api/hardware/:id`
- **Parâmetros de Rota**:
  - `id` (string, obrigatório): Identificador `ObjectId` de 24 caracteres do MongoDB.

#### Exemplo cURL:
```bash
curl -X GET http://localhost:3000/api/hardware/674ddc3b28b21c4314e3012a
```

#### Respostas:

**200 OK (Encontrado)**:
```json
{
  "success": true,
  "data": {
    "_id": "674ddc3b28b21c4314e3012a",
    "hardware": "Placa de Vídeo",
    "marca": "NVIDIA",
    "modelo": "RTX 4070 Ti 12GB",
    "preco": 5499.9,
    "foto": "https://images.unsplash.com/photo-1587202372775-e229f172b9d7",
    "createdAt": "2026-10-01T10:00:00.000Z",
    "updatedAt": "2026-10-01T10:00:00.000Z"
  }
}
```

**400 Bad Request (ID com formato inválido)**:
```json
{
  "success": false,
  "error": {
    "message": "O ID '123' informado não é um identificador válido do MongoDB."
  }
}
```

**404 Not Found (ID inexistente)**:
```json
{
  "success": false,
  "error": {
    "message": "Aparelho de hardware não encontrado."
  }
}
```

---

### 5.4. Cadastrar Novo Aparelho
Insere um novo hardware no banco de dados.

- **Método**: `POST`
- **Rota**: `/api/hardware`
- **Headers**: `Content-Type: application/json`
- **Status HTTP de Sucesso**: `201 Created`

#### Corpo da Requisição (Body JSON):
```json
{
  "hardware": "Notebook",
  "marca": "Dell",
  "modelo": "Inspiron 15 3520",
  "preco": 3299.00,
  "foto": "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed"
}
```

#### Exemplo cURL:
```bash
curl -X POST http://localhost:3000/api/hardware \
  -H "Content-Type: application/json" \
  -d '{
    "hardware": "Notebook",
    "marca": "Dell",
    "modelo": "Inspiron 15 3520",
    "preco": 3299.00,
    "foto": "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed"
  }'
```

#### Respostas:

**201 Created**:
```json
{
  "success": true,
  "data": {
    "_id": "674ddf1028b21c4314e3012b",
    "hardware": "Notebook",
    "marca": "Dell",
    "modelo": "Inspiron 15 3520",
    "preco": 3299,
    "foto": "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed",
    "createdAt": "2026-10-01T10:05:00.000Z",
    "updatedAt": "2026-10-01T10:05:00.000Z"
  }
}
```

**400 Bad Request (Exemplo: campo obrigatório ausente ou preço inválido)**:
```json
{
  "success": false,
  "error": {
    "message": "O campo hardware (tipo/nome) é obrigatório."
  }
}
```

---

### 5.5. Atualizar Aparelho Existente
Atualiza um ou mais campos de um hardware já cadastrado.

- **Método**: `PUT`
- **Rota**: `/api/hardware/:id`
- **Parâmetros de Rota**: `id` (identificador do aparelho)
- **Headers**: `Content-Type: application/json`
- **Status HTTP de Sucesso**: `200 OK`

#### Corpo da Requisição (Body JSON):
```json
{
  "preco": 2999.00,
  "modelo": "Inspiron 15 3520 (Upgrade SSD 1TB)"
}
```

#### Exemplo cURL:
```bash
curl -X PUT http://localhost:3000/api/hardware/674ddf1028b21c4314e3012b \
  -H "Content-Type: application/json" \
  -d '{
    "preco": 2999.00,
    "modelo": "Inspiron 15 3520 (Upgrade SSD 1TB)"
  }'
```

#### Respostas:

**200 OK**:
```json
{
  "success": true,
  "data": {
    "_id": "674ddf1028b21c4314e3012b",
    "hardware": "Notebook",
    "marca": "Dell",
    "modelo": "Inspiron 15 3520 (Upgrade SSD 1TB)",
    "preco": 2999,
    "foto": "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed",
    "createdAt": "2026-10-01T10:05:00.000Z",
    "updatedAt": "2026-10-01T10:10:00.000Z"
  }
}
```

**404 Not Found**:
```json
{
  "success": false,
  "error": {
    "message": "Aparelho de hardware não encontrado."
  }
}
```

---

### 5.6. Excluir Aparelho
Remove permanentemente um hardware da base de dados.

- **Método**: `DELETE`
- **Rota**: `/api/hardware/:id`
- **Parâmetros de Rota**: `id` (identificador do aparelho)
- **Status HTTP de Sucesso**: `200 OK`

#### Exemplo cURL:
```bash
curl -X DELETE http://localhost:3000/api/hardware/674ddf1028b21c4314e3012b
```

#### Respostas:

**200 OK**:
```json
{
  "success": true,
  "data": {
    "message": "Aparelho excluído com sucesso."
  }
}
```

**404 Not Found**:
```json
{
  "success": false,
  "error": {
    "message": "Aparelho de hardware não encontrado."
  }
}
```

---

## 6. Tabela Resumo de Códigos de Status HTTP

| Código | Significado | Situação |
|---|---|---|
| `200 OK` | Sucesso | Retorno de listagem, consulta, atualização ou exclusão |
| `201 Created` | Criado | Novo registro de hardware inserido com sucesso |
| `400 Bad Request` | Requisição Inválida | Campos obrigatórios ausentes, preço inválido, ID com formato incorreto ou JSON malformado |
| `404 Not Found` | Não Encontrado | Registro inexistente para o ID informado ou rota inexistente |
| `500 Internal Server Error` | Erro do Servidor | Falha não prevista ou perda de comunicação com o banco |
