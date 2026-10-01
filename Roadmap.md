# Roadmap — Mini Sistema de Gerenciamento de Hardware

## 1. Planejamento
- [x] Analisar requisitos e ambiente
- [x] Definir arquitetura e estrutura de pastas
- [x] Definir modelo de dados e regras de validação
- [x] Definir padronização da API REST e endpoints
- [x] Criar arquivos de controle (Roadmap.md e Contexto.md)

## 2. Backend
- [x] Criar estrutura de diretórios do backend
- [x] Inicializar `package.json` com dependências necessárias (`express`, `mongoose`, `cors`, `dotenv`)
- [x] Configurar conexão com MongoDB (com cache de conexão para serverless/Vercel)
- [x] Criar Model `Hardware` com validações Mongoose
- [x] Criar Middlewares (CORS, tratamento centralizado de erros, validação de ObjectId)
- [x] Criar Controller com regras de CRUD padronizadas (`GET`, `GET :id`, `POST`, `PUT`, `DELETE`)
- [x] Criar Rotas da API (`/api/hardware`)
- [x] Configurar app Express e servidor local (`server.js`)
- [x] Criar arquivo de entrada para Vercel Serverless (`api/index.js` e `vercel.json`)
- [x] Criar `.env.example` e `.env` com template de configuração e link do MongoDB Atlas
- [x] Criar script `demo.js` para execução e testes imediatos plug-and-play

## 3. Testes Automatizados do Backend
- [x] Configurar suíte de testes automatizados com Jest / Supertest e MongoDB Memory Server (para testes isolados e confiáveis)
- [x] Testar conexão com o banco
- [x] Testar listagem `GET /api/hardware` (vazia e com itens)
- [x] Testar busca `GET /api/hardware/:id` (sucesso, id inválido, não encontrado)
- [x] Testar criação `POST /api/hardware` (sucesso, campos faltantes, preço negativo/inválido)
- [x] Testar atualização `PUT /api/hardware/:id` (sucesso, id inválido, não encontrado, validação de campos)
- [x] Testar remoção `DELETE /api/hardware/:id` (sucesso, id inválido, não encontrado)
- [x] Executar bateria completa de testes (21 testes passaram com 100% de sucesso)

## 4. Frontend
- [x] Criar estrutura do frontend (`index.html`, `style.css`, `script.js`)
- [x] Construir layout moderno, limpo e responsivo (Desktop e Mobile)
- [x] Implementar centralização de configuração da API (`API_CONFIG.BASE_URL`)
- [x] Criar estados visuais: Carregamento (Loading), Mensagens de Feedback (Sucesso/Erro/Toast), Lista Vazia
- [x] Implementar listagem dinâmica de aparelhos em Cards visuais com foto/placeholder, hardware, marca, modelo e preço formatado
- [x] Implementar formulário interativo de cadastro com validação client-side
- [x] Implementar modal ou modo de edição de hardware
- [x] Implementar confirmação e ação de exclusão de hardware
- [x] Tratar exibição de imagens quebradas / placeholders visuais
- [x] Implementar busca em tempo real por hardware, marca ou modelo

## 5. Integração e Validação End-to-End
- [x] Executar backend e validar requisições HTTP reais (GET, POST, PUT, DELETE)
- [x] Validar fluxo completo: Cadastro -> Listagem -> Edição -> Exclusão
- [x] Validar comportamento em caso de falha de conexão com a API
- [x] Validar responsividade e integridade do frontend desacoplado

## 6. Documentação e Preparação para Deploy
- [x] Criar `api.md` com documentação técnica completa de todos os endpoints e exemplos cURL
- [x] Criar `README.md` detalhado (passo a passo de instalação, execução local, testes, link do MongoDB Atlas e deploy na Vercel)
- [x] Atualizar `Contexto.md` com o estado final do sistema
- [x] Revisão e validação final de entrega
