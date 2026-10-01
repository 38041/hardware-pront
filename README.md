# ⚡ Mini Sistema de Gerenciamento de Hardware

Aplicação web completa para catálogo e gerenciamento (CRUD) de aparelhos de hardware, desenvolvida com backend **Node.js (Express & MongoDB)**, deploy serverless para **Vercel** e frontend desacoplado em **HTML5, CSS3 e JavaScript Puro**.

---

## 🎯 Objetivo do Projeto

Permitir que usuários e equipes de TI cadastrem, consultem, atualizem e removam aparelhos de hardware com facilidade, visualizando cartões com fotos, fabricante, modelo e preço em tempo real.

Cada aparelho possui os seguintes atributos:
- **hardware**: Nome ou categoria do hardware (ex.: Notebook, Placa de Vídeo, Processador)
- **marca**: Fabricante (ex.: Dell, NVIDIA, AMD, Kingston)
- **modelo**: Identificação do modelo (ex.: RTX 4070 Ti, Inspiron 15)
- **preco**: Valor em reais (R$)
- **foto**: URL da imagem ilustrativa (com placeholder automático caso não informada ou indisponível)
- **createdAt / updatedAt**: Carimbos de data/hora gerenciados automaticamente pelo banco

---

## 🏗️ Arquitetura do Sistema

O projeto adota uma arquitetura limpa e **desacoplada**:

```text
[ Usuário ]
    │
    ▼
[ Frontend SPA ] (HTML5 / CSS3 / Vanilla JS)
    │
    │  Requisições HTTP / JSON (Fetch API)
    ▼
[ Backend REST API ] (Node.js + Express)
    │  (Suporte Local & Vercel Serverless Functions)
    │
    ▼
[ Banco de Dados MongoDB ]
    └── MongoDB Atlas (Nuvem) / MongoDB Memory Server (Testes)
```

---

## 📂 Estrutura de Pastas

```text
.
├── backend/
│   ├── api/
│   │   └── index.js              # Entrypoint Serverless para Vercel
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js             # Conexão MongoDB com pool/cache para serverless
│   │   ├── controllers/
│   │   │   └── hardwareController.js # Lógica de negócio e CRUD
│   │   ├── middlewares/
│   │   │   ├── errorHandler.js   # Tratamento centralizado de erros
│   │   │   └── validateId.js     # Validação de formato de ObjectId
│   │   ├── models/
│   │   │   └── Hardware.js       # Schema Mongoose com validações
│   │   ├── routes/
│   │   │   └── hardwareRoutes.js # Definição das rotas REST
│   │   └── app.js                # Configuração do Express, CORS e rotas
│   ├── tests/
│   │   └── hardware.test.js      # Suíte completa de testes automatizados
│   ├── .env.example              # Exemplo de configuração de variáveis
│   ├── package.json              # Dependências e scripts
│   ├── server.js                 # Inicialização do servidor local
│   └── vercel.json               # Configuração de rotas na Vercel
├── frontend/
│   ├── index.html                # Interface de usuário
│   ├── style.css                 # Folha de estilos responsiva
│   └── script.js                 # Lógica client-side, validações e fetch
├── Roadmap.md                    # Controle de etapas e status
├── Contexto.md                   # Memória técnica atualizada
├── api.md                        # Documentação técnica detalhada dos endpoints
├── README.md                     # Manual completo da aplicação
└── .gitignore                    # Arquivos ignorados pelo Git
```

---

## 🍃 Configuração do Banco de Dados: MongoDB Atlas (Com Link)

Para persistência na nuvem, você pode utilizar um cluster gratuito no **MongoDB Atlas**:

1. Acesse o site oficial: [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Crie uma conta gratuita ou faça login com sua conta Google/GitHub.
3. Clique em **"Build a Database"** e selecione a opção gratuita (**M0 Free Tier**).
4. Em **Security Quickstart**:
   - Crie um usuário e senha para o banco de dados (ex: `usuario_admin` e sua senha). Guarde essas credenciais.
   - Em **Network Access / IP Access List**, adicione o endereço `0.0.0.0/0` (permitir conexões de qualquer lugar, essencial para a Vercel).
5. Clique em **"Database"** no menu lateral, depois em **"Connect"** -> **"Drivers"** (Node.js).
6. Copie a string de conexão no formato:
   ```text
   mongodb+srv://<usuario>:<senha>@<cluster>.mongodb.net/hardware_db?retryWrites=true&w=majority
   ```
7. Substitua `<usuario>`, `<senha>` e o nome do banco (`hardware_db`).

---

## 🚀 Como Executar Localmente

### Pré-requisitos
- [Node.js](https://nodejs.org/) versão 18 ou superior instalada.
- Conexão com a internet para dependências e MongoDB Atlas.

### 1. Clonar e Acessar o Repositório
```bash
git clone <url-do-repositorio>
cd "ALESSA CERTO"
```

### 2. Configurar o Backend
Acesse a pasta `backend`:
```bash
cd backend
```

Instale as dependências:
```bash
npm install
```

Crie o arquivo `.env` baseado no `.env.example`:
```bash
cp .env.example .env
```
*(No Windows PowerShell: `Copy-Item .env.example .env`)*

Edite o arquivo `.env` inserindo sua string de conexão obtida no MongoDB Atlas:
```env
PORT=3000
MONGODB_URI=mongodb+srv://seu_usuario:sua_senha@seu_cluster.mongodb.net/hardware_db?retryWrites=true&w=majority
CORS_ORIGIN=*
```

### 3. Iniciar o Servidor
Modo de produção/normal:
```bash
npm start
```
Ou modo de desenvolvimento com recarregamento automático (Node 18+):
```bash
npm run dev
```

O servidor iniciará em `http://localhost:3000`.

---

## 🧪 Como Rodar os Testes Automatizados

O projeto inclui uma suíte completa de testes automatizados com **Jest**, **Supertest** e **MongoDB Memory Server**. Os testes rodam em um banco em memória 100% isolado, sem necessitar de banco externo ou conexão prévia.

Na pasta `backend`:
```bash
npm test
```

Os testes validam:
- Listagem vazia e com itens cadastrados
- Criação com dados válidos e com campos obrigatórios ausentes
- Rejeição de preços negativos e URLs inválidas
- Busca por ID (sucesso, formato inválido 400, não encontrado 404)
- Atualização e regras de validação (PUT)
- Exclusão com confirmação no banco (DELETE)
- Tratamento de rotas inexistentes e erros 500

---

## 💻 Como Executar o Frontend

Como o frontend é construído com HTML, CSS e JavaScript puros e desacoplados:

1. Abra a pasta `frontend`.
2. Basta abrir o arquivo `index.html` em qualquer navegador web moderno (Google Chrome, Firefox, Edge, Safari).
3. Alternativamente, você pode usar uma extensão como o **Live Server** do VS Code ou um servidor estático local:
   ```bash
   npx serve frontend
   ```
4. Se a API estiver rodando em `http://localhost:3000`, o indicador no topo exibirá **"API Conectada"** com ponto verde, e você já poderá cadastrar e gerenciar hardwares!

> 💡 **Nota sobre a URL da API**: Por padrão, o frontend está configurado para acessar `http://localhost:3000/api/hardware`. Para alterar para a URL de produção na Vercel, altere a propriedade `BASE_URL` no topo do arquivo [frontend/script.js](frontend/script.js).

---

## ☁️ Deploy da API na Vercel

O backend foi estruturado para execução serverless nativa na Vercel utilizando o arquivo [backend/vercel.json](backend/vercel.json) e o entrypoint [backend/api/index.js](backend/api/index.js).

### Passo a Passo de Deploy:
1. Instale a CLI da Vercel globalmente (opcional) ou conecte via GitHub pelo painel web da Vercel: [https://vercel.com](https://vercel.com).
2. Se utilizar o painel da Vercel:
   - Clique em **"Add New Project"**.
   - Importe seu repositório.
   - Configure o **Root Directory** como `backend`.
   - Adicione a variável de ambiente:
     - `MONGODB_URI`: sua string de conexão completa do MongoDB Atlas.
     - `CORS_ORIGIN`: a URL do seu frontend ou `*`.
   - Clique em **"Deploy"**.
3. A Vercel fornecerá uma URL pública, como:
   `https://sua-api-hardware.vercel.app`
4. Atualize o arquivo `frontend/script.js` com a nova URL:
   ```javascript
   BASE_URL: 'https://sua-api-hardware.vercel.app/api/hardware'
   ```
5. Você também pode publicar o frontend na Vercel ou GitHub Pages com 1 clique!

---

## 📖 Documentação da API

Consulte o arquivo completo [`api.md`](./api.md) para visualizar todos os parâmetros, respostas, headers e exemplos práticos com comandos `curl`.

Resumo dos endpoints:
- `GET /api/hardware` — Lista todos os aparelhos
- `GET /api/hardware/:id` — Busca aparelho por ID
- `POST /api/hardware` — Cadastra novo aparelho
- `PUT /api/hardware/:id` — Atualiza dados do aparelho
- `DELETE /api/hardware/:id` — Remove o aparelho
