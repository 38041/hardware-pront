require('dotenv').config();
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('./src/app');
const Hardware = require('./src/models/Hardware');

const PORT = process.env.PORT || 3000;

async function startDemo() {
  let mongoUri = process.env.MONGODB_URI;

  if (!mongoUri || mongoUri.includes('<usuario>')) {
    console.log('⚡ Nenhuma MONGODB_URI configurada no .env. Inicializando MongoDB em memória para demonstração imediata...');
    const mongoServer = await MongoMemoryServer.create();
    mongoUri = mongoServer.getUri();
  }

  try {
    await mongoose.connect(mongoUri);
    console.log(' Conectado ao MongoDB com sucesso!');

    // Inserir dados de exemplo se o banco estiver vazio
    const count = await Hardware.countDocuments();
    if (count === 0) {
      console.log('📦 Inserindo hardwares de exemplo para demonstração...');
      await Hardware.create([
        {
          hardware: 'Placa de Vídeo',
          marca: 'NVIDIA',
          modelo: 'GeForce RTX 4070 Ti 12GB',
          preco: 5499.9,
          foto: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=600&q=80',
        },
        {
          hardware: 'Notebook Gamer',
          marca: 'Dell',
          modelo: 'G15 5530 Intel Core i7',
          preco: 6299.0,
          foto: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80',
        },
        {
          hardware: 'Processador',
          marca: 'AMD',
          modelo: 'Ryzen 7 7800X3D',
          preco: 2890.0,
          foto: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=600&q=80',
        },
        {
          hardware: 'Monitor Gamer',
          marca: 'LG',
          modelo: 'UltraGear 27" 144Hz IPS',
          preco: 1399.9,
          foto: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80',
        },
      ]);
      console.log(' 4 hardwares de exemplo inseridos com sucesso!');
    }

    app.listen(PORT, () => {
      console.log(`\n======================================================`);
      console.log(`🚀 SERVIDOR DEMO EM EXECUÇÃO NA PORTA ${PORT}`);
      console.log(`📡 API: http://localhost:${PORT}/api/hardware`);
      console.log(`🖥️  FRONTEND: Abra o arquivo frontend/index.html no navegador!`);
      console.log(`======================================================\n`);
    });
  } catch (err) {
    console.error('❌ Falha ao iniciar demo:', err.message);
  }
}

startDemo();
