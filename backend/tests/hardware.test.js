const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');
const Hardware = require('../src/models/Hardware');

let mongoServer;

beforeAll(async () => {
  // Inicializa MongoDB em memória para testes isolados
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
});

beforeEach(async () => {
  await Hardware.deleteMany({});
});

describe('=== Suíte de Testes da API de Hardware ===', () => {
  describe('Status e Rotas Gerais', () => {
    test('GET / deve retornar status 200 e informações da API', async () => {
      const res = await request(app).get('/');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('online');
    });

    test('GET /rota-inexistente deve retornar 404 padronizado', async () => {
      const res = await request(app).get('/api/inexistente');
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toHaveProperty('message');
    });
  });

  describe('GET /api/hardware (Listagem)', () => {
    test('Deve retornar lista vazia quando não houver registros', async () => {
      const res = await request(app).get('/api/hardware');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBe(0);
    });

    test('Deve listar os aparelhos cadastrados ordenados decrescentemente', async () => {
      await Hardware.create([
        { hardware: 'Placa de Vídeo', marca: 'NVIDIA', modelo: 'RTX 4060', preco: 2200 },
        { hardware: 'Processador', marca: 'AMD', modelo: 'Ryzen 7 5700X', preco: 1300 },
      ]);

      const res = await request(app).get('/api/hardware');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(2);
      expect(res.body.data[0].hardware).toBe('Processador');
    });
  });

  describe('POST /api/hardware (Criação)', () => {
    test('Deve criar um hardware com sucesso informando todos os campos válidos', async () => {
      const payload = {
        hardware: 'Notebook',
        marca: 'Dell',
        modelo: 'G15',
        preco: 4899.9,
        foto: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed',
      };

      const res = await request(app).post('/api/hardware').send(payload);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('_id');
      expect(res.body.data.hardware).toBe(payload.hardware);
      expect(res.body.data.marca).toBe(payload.marca);
      expect(res.body.data.modelo).toBe(payload.modelo);
      expect(res.body.data.preco).toBe(payload.preco);
      expect(res.body.data.foto).toBe(payload.foto);
      expect(res.body.data).toHaveProperty('createdAt');
      expect(res.body.data).toHaveProperty('updatedAt');
    });

    test('Deve criar um hardware sem foto opcional', async () => {
      const payload = {
        hardware: 'Monitor',
        marca: 'LG',
        modelo: 'UltraWide 29',
        preco: 1100,
      };

      const res = await request(app).post('/api/hardware').send(payload);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.foto).toBe('');
    });

    test('Deve rejeitar criação com campo obrigatório ausente (hardware)', async () => {
      const payload = {
        marca: 'Asus',
        modelo: 'B550M',
        preco: 750,
      };

      const res = await request(app).post('/api/hardware').send(payload);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.message).toMatch(/hardware/i);
    });

    test('Deve rejeitar criação com campo obrigatório ausente (marca)', async () => {
      const payload = {
        hardware: 'Placa Mãe',
        modelo: 'B550M',
        preco: 750,
      };

      const res = await request(app).post('/api/hardware').send(payload);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.message).toMatch(/marca/i);
    });

    test('Deve rejeitar criação com campo obrigatório ausente (modelo)', async () => {
      const payload = {
        hardware: 'Placa Mãe',
        marca: 'Asus',
        preco: 750,
      };

      const res = await request(app).post('/api/hardware').send(payload);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.message).toMatch(/modelo/i);
    });

    test('Deve rejeitar criação com preço ausente ou inválido', async () => {
      const payload = {
        hardware: 'Memória RAM',
        marca: 'Corsair',
        modelo: 'Vengeance 16GB',
        preco: 'invalido',
      };

      const res = await request(app).post('/api/hardware').send(payload);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.message).toMatch(/preço/i);
    });

    test('Deve rejeitar criação com preço negativo', async () => {
      const payload = {
        hardware: 'Fonte',
        marca: 'Corsair',
        modelo: 'CV650',
        preco: -150,
      };

      const res = await request(app).post('/api/hardware').send(payload);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.message).toMatch(/maior ou igual a zero/i);
    });

    test('Deve rejeitar foto com URL inválida', async () => {
      const payload = {
        hardware: 'Teclado',
        marca: 'Redragon',
        modelo: 'Kumara',
        preco: 199,
        foto: 'caminho_invalido_sem_protocolo',
      };

      const res = await request(app).post('/api/hardware').send(payload);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.message).toMatch(/URL válida/i);
    });
  });

  describe('GET /api/hardware/:id (Busca por ID)', () => {
    test('Deve retornar o hardware correspondente pelo ID', async () => {
      const item = await Hardware.create({
        hardware: 'SSD',
        marca: 'Kingston',
        modelo: 'NV2 1TB',
        preco: 380,
      });

      const res = await request(app).get(`/api/hardware/${item._id}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data._id.toString()).toBe(item._id.toString());
      expect(res.body.data.modelo).toBe('NV2 1TB');
    });

    test('Deve retornar 400 ao informar ID com formato inválido', async () => {
      const res = await request(app).get('/api/hardware/123-id-invalido');

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.message).toMatch(/não é um identificador válido/i);
    });

    test('Deve retornar 404 para ID válido inexistente', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app).get(`/api/hardware/${fakeId}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error.message).toMatch(/não encontrado/i);
    });
  });

  describe('PUT /api/hardware/:id (Atualização)', () => {
    test('Deve atualizar os dados do hardware com sucesso', async () => {
      const item = await Hardware.create({
        hardware: 'Mouse',
        marca: 'Logitech',
        modelo: 'G203',
        preco: 140,
      });

      const res = await request(app).put(`/api/hardware/${item._id}`).send({
        preco: 129.9,
        modelo: 'G203 Lightsync',
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.preco).toBe(129.9);
      expect(res.body.data.modelo).toBe('G203 Lightsync');
      expect(res.body.data.marca).toBe('Logitech'); // Mantido
    });

    test('Deve rejeitar atualização com preço negativo', async () => {
      const item = await Hardware.create({
        hardware: 'Headset',
        marca: 'HyperX',
        modelo: 'Cloud Stinger',
        preco: 250,
      });

      const res = await request(app).put(`/api/hardware/${item._id}`).send({
        preco: -50,
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.message).toMatch(/maior ou igual a zero/i);
    });

    test('Deve retornar 404 ao atualizar ID inexistente', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app).put(`/api/hardware/${fakeId}`).send({
        modelo: 'Novo Modelo',
      });

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error.message).toMatch(/não encontrado/i);
    });
  });

  describe('DELETE /api/hardware/:id (Exclusão)', () => {
    test('Deve excluir o hardware com sucesso', async () => {
      const item = await Hardware.create({
        hardware: 'Gabinete',
        marca: 'NZXT',
        modelo: 'H510',
        preco: 500,
      });

      const res = await request(app).delete(`/api/hardware/${item._id}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.message).toMatch(/excluído com sucesso/i);

      // Confirma que não existe mais no banco
      const check = await Hardware.findById(item._id);
      expect(check).toBeNull();
    });

    test('Deve retornar 404 ao tentar excluir ID inexistente', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app).delete(`/api/hardware/${fakeId}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error.message).toMatch(/não encontrado/i);
    });

    test('Deve retornar 400 ao tentar excluir ID com formato inválido', async () => {
      const res = await request(app).delete('/api/hardware/id-invalido-xyz');

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.message).toMatch(/não é um identificador válido/i);
    });
  });
});
