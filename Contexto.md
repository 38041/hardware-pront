# Contexto do Projeto — Mini Sistema de Gerenciamento de Hardware

## Objetivo
Desenvolver, testar e documentar um mini sistema web completo para gerenciamento (CRUD) de aparelhos de hardware, composto por backend Node.js (REST API com MongoDB), frontend desacoplado (HTML5/CSS3/JavaScript puro) e preparado para deploy na Vercel.

## Arquitetura
- **Padrão**: Cliente-Servidor desacoplado (Decoupled Frontend / REST API Backend).
- **Backend**: Node.js com Express e Mongoose, estruturado em MVC limpo (config, models, controllers, routes, middlewares).
- **Banco de Dados**: MongoDB (hospedado no MongoDB Atlas na nuvem com link oficial documentado ou local via `MONGODB_URI`; suíte de testes com `mongodb-memory-server`).
- **Frontend**: SPA independente em HTML5 semântico, CSS moderno (design dark moderno com tema slate/indigo, responsivo, acessível) e JavaScript Vanilla consumindo a API via `fetch`.
- **Deploy Serverless**: Padrão Vercel com função serverless em `backend/api/index.js`, reescrita em `backend/vercel.json` e pool de conexões com cache para evitar exaustão de conexões.

## Tecnologias
- **Runtime**: Node.js (v24 LTS / v18+)
- **Framework Web**: Express 4.21.2
- **ODM**: Mongoose 8.9.5
- **Segurança & Utilitários**: `cors`, `dotenv`
- **Banco de Dados**: MongoDB (MongoDB Atlas na nuvem / MongoDB Memory Server para testes)
- **Testes Automatizados**: Jest 29.7.0, Supertest 7.0.0, mongodb-memory-server 10.1.3
- **Frontend**: HTML5, CSS3, JavaScript (ES6+ Vanilla)
- **Deploy**: Vercel (Serverless Functions)

## Estrutura do Projeto
```text
ALESSA CERTO/
├── backend/
│   ├── api/
│   │   └── index.js             # Entrada Vercel Serverless
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js            # Conexão MongoDB com cache para serverless
│   │   ├── controllers/
│   │   │   └── hardwareController.js
│   │   ├── middlewares/
│   │   │   ├── errorHandler.js  # Tratamento centralizado de erros
│   │   │   └── validateId.js    # Validação de ObjectId do MongoDB
│   │   ├── models/
│   │   │   └── Hardware.js      # Schema Mongoose com validações
│   │   ├── routes/
│   │   │   └── hardwareRoutes.js
│   │   └── app.js               # Definição e middlewares da aplicação Express
│   ├── tests/
│   │   └── hardware.test.js     # Suíte de 21 testes automatizados de integração
│   ├── .env.example             # Template de variáveis com link do Atlas
│   ├── .env                     # Variáveis locais
│   ├── demo.js                  # Inicializador plug-and-play com banco em memória e seed
│   ├── package.json
│   ├── server.js                # Servidor local Express
│   └── vercel.json              # Configuração de rota na Vercel
├── frontend/
│   ├── index.html               # Interface do usuário (formulário, cards, modais)
│   ├── style.css                # Estilos responsivos
│   └── script.js                # Lógica client-side, consumo da API e estado
├── .gitignore
├── Roadmap.md                   # Checklist de desenvolvimento
├── Contexto.md                  # Memória técnica atualizada
├── api.md                       # Documentação técnica da API REST
└── README.md                    # Guia completo de uso, configuração e deploy
```

## Banco de Dados
- **Collection**: `hardwares`
- **Schema**:
  - `hardware`: String (obrigatório, trim, máx. 100 caracteres) — tipo/categoria do hardware
  - `marca`: String (obrigatório, trim, máx. 100 caracteres) — fabricante
  - `modelo`: String (obrigatório, trim, máx. 100 caracteres) — modelo específico
  - `preco`: Number (obrigatório, min: 0) — valor monetário em reais
  - `foto`: String (opcional, trim, validação de URL `http://` ou `https://` ou vazio)
  - `createdAt`: Date (automático via timestamps)
  - `updatedAt`: Date (automático via timestamps)

## API
Padrão de respostas:
- **Sucesso**: `{ "success": true, "data": ... }`
- **Erro**: `{ "success": false, "error": { "message": "..." } }`

Endpoints implementados e testados:
- `GET /` e `GET /api` — Status da API e health check
- `GET /api/hardware` — Lista todos os aparelhos
- `GET /api/hardware/:id` — Busca aparelho por ID (validação de formato 400 e inexistência 404)
- `POST /api/hardware` — Cadastra novo aparelho (validações completas)
- `PUT /api/hardware/:id` — Atualiza aparelho existente
- `DELETE /api/hardware/:id` — Remove aparelho existente

## Frontend
Funcionalidades implementadas:
- Configuração centralizada de `API_CONFIG.BASE_URL`
- Listagem em cards com foto, badge de tipo, modelo, marca e preço formatado em BRL
- Tratamento automático de foto ausente e falha no carregamento de imagem externa
- Formulário de cadastro com validações visuais em tempo real
- Edição completa com pré-preenchimento e cancelamento
- Modal de confirmação seguro para exclusão de aparelhos
- Busca instantânea por termo digitado (hardware, marca ou modelo)
- Estados visuais: Carregando (spinner), Erro de conexão com botão de tentar novamente, Lista vazia e Toasts de notificação
- Indicador de status de conexão com a API no topo da página
- Totalmente responsivo para smartphones, tablets e desktop

## Variáveis de Ambiente
- `PORT`: Porta do servidor local (padrão: 3000)
- `MONGODB_URI`: String de conexão do MongoDB Atlas (Link de cadastro: https://www.mongodb.com/cloud/atlas)
- `CORS_ORIGIN`: Origens permitidas para consumo da API (padrão `*` para local)

## Estado Atual
- Backend totalmente implementado e operacional.
- Frontend totalmente implementado, responsivo e integrado à API.
- Bateria de testes automatizados com Jest/Supertest/MongoDB Memory Server com 21/21 testes aprovados.
- Teste real com requisições HTTP locais executado com 100% de sucesso.
- Documentação completa criada (`api.md`, `README.md`, `Roadmap.md`, `Contexto.md`).
- Preparado para deploy na Vercel com serverless function e cache de conexão Mongoose.

## Última Tarefa
- Execução de testes automatizados e testes reais de requisições HTTP, seguidos pela consolidação da documentação e atualização de `Roadmap.md` e `Contexto.md`.

## Próxima Tarefa
- Apresentar o resultado completo e instruções de uso ao usuário.

## Problemas Conhecidos
- Nenhum. Todas as funcionalidades foram testadas e validadas.

## Decisões Técnicas
- **Mongoose com Cache Serverless**: Criação de `global.mongoose` em `db.js` para garantir estabilidade e reaproveitamento de conexões no ambiente serverless da Vercel.
- **Isolamento de Testes**: Utilização de `MongoMemoryServer` na suíte de testes do Jest, garantindo testes 100% reproduzíveis em qualquer máquina sem requerer credenciais externas.
- **Script de Demonstração Imediata (`npm run demo`)**: Adicionado para permitir que qualquer avaliador rode o sistema localmente imediatamente, com seed de 4 itens e banco em memória se o `.env` ainda não tiver sido configurado com MongoDB Atlas.
- **Frontend Vanilla Desacoplado**: Sem dependências de compilação ou bundlers, permitindo abertura direta de `frontend/index.html` em qualquer navegador ou hospedagem estática.
