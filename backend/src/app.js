require('dotenv').config();
const express = require('express');
const cors = require('cors');
const hardwareRoutes = require('./routes/hardwareRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Configuração do CORS
const corsOrigin = process.env.CORS_ORIGIN || '*';
app.use(
  cors({
    origin: corsOrigin === '*' ? '*' : corsOrigin.split(',').map((o) => o.trim()),
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Middlewares para parsing de corpo de requisições
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rota inicial de status / health check
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      nome: 'API de Gerenciamento de Hardware',
      versao: '1.0.0',
      status: 'online',
      endpoints: {
        listarHardwares: 'GET /api/hardware',
        buscarPorId: 'GET /api/hardware/:id',
        criarHardware: 'POST /api/hardware',
        atualizarHardware: 'PUT /api/hardware/:id',
        excluirHardware: 'DELETE /api/hardware/:id',
      },
    },
  });
});

app.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      message: 'API de Gerenciamento de Hardware ativa.',
      documentacao: '/api.md',
    },
  });
});

// Rotas da API
app.use('/api/hardware', hardwareRoutes);

// Tratamento de rota não encontrada (404)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: `Rota '${req.originalUrl}' não encontrada.`,
    },
  });
});

// Middleware centralizado de tratamento de erros
app.use(errorHandler);

module.exports = app;
