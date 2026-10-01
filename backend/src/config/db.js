const mongoose = require('mongoose');

/**
 * Cache global da conexão para ambientes Serverless (como Vercel).
 * Evita esgotamento do pool de conexões entre invocações consecutivas.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error(
      'A variável de ambiente MONGODB_URI não foi definida. ' +
      'Configure sua string de conexão no arquivo .env ou no painel da Vercel. ' +
      'Você pode criar um banco gratuito no MongoDB Atlas: https://www.mongodb.com/cloud/atlas'
    );
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
    };

    cached.promise = mongoose.connect(uri, opts).then((mongooseInstance) => {
      console.log(' Conectado com sucesso ao MongoDB!');
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    console.error('❌ Falha ao conectar ao MongoDB:', error.message);
    throw error;
  }

  return cached.conn;
}

module.exports = connectDB;
