const app = require('../src/app');
const connectDB = require('../src/config/db');

/**
 * Ponto de entrada Serverless da Vercel
 * Garante que a conexão com o MongoDB esteja pronta antes de processar as requisições.
 */
module.exports = async (req, res) => {
  try {
    await connectDB();
    return app(req, res);
  } catch (error) {
    console.error('Erro na função serverless ao conectar ao banco:', error);
    return res.status(500).json({
      success: false,
      error: {
        message: 'Falha ao estabelecer conexão com o banco de dados MongoDB.',
      },
    });
  }
};
