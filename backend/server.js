require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/db');

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    console.log(' Conectando ao MongoDB...');
    await connectDB();

    app.listen(PORT, () => {
      console.log(` Servidor rodando na porta ${PORT}`);
      console.log(` Endpoints disponíveis em http://localhost:${PORT}/api/hardware`);
    });
  } catch (error) {
    console.error(' Falha crítica ao iniciar o servidor:', error.message);
    process.exit(1);
  }
}

startServer();
