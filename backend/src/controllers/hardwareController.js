const Hardware = require('../models/Hardware');

/**
 * Listar todos os aparelhos de hardware cadastrados
 * GET /api/hardware
 */
exports.getAll = async (req, res, next) => {
  try {
    const hardwares = await Hardware.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      data: hardwares,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Buscar um aparelho específico por ID
 * GET /api/hardware/:id
 */
exports.getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await Hardware.findById(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Aparelho de hardware não encontrado.',
        },
      });
    }

    return res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Cadastrar um novo aparelho de hardware
 * POST /api/hardware
 */
exports.create = async (req, res, next) => {
  try {
    const { hardware, marca, modelo, preco, foto } = req.body;

    // Validações básicas adicionais antes do save
    if (hardware === undefined || hardware === null || String(hardware).trim() === '') {
      return res.status(400).json({
        success: false,
        error: { message: 'O campo hardware (tipo/nome) é obrigatório.' },
      });
    }

    if (marca === undefined || marca === null || String(marca).trim() === '') {
      return res.status(400).json({
        success: false,
        error: { message: 'O campo marca é obrigatório.' },
      });
    }

    if (modelo === undefined || modelo === null || String(modelo).trim() === '') {
      return res.status(400).json({
        success: false,
        error: { message: 'O campo modelo é obrigatório.' },
      });
    }

    if (preco === undefined || preco === null || preco === '' || isNaN(Number(preco))) {
      return res.status(400).json({
        success: false,
        error: { message: 'O campo preço é obrigatório e deve ser um número válido.' },
      });
    }

    if (Number(preco) < 0) {
      return res.status(400).json({
        success: false,
        error: { message: 'O preço deve ser um valor maior ou igual a zero.' },
      });
    }

    const newItem = new Hardware({
      hardware: String(hardware).trim(),
      marca: String(marca).trim(),
      modelo: String(modelo).trim(),
      preco: Number(preco),
      foto: foto ? String(foto).trim() : '',
    });

    const saved = await newItem.save();

    return res.status(201).json({
      success: true,
      data: saved,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Atualizar os dados de um aparelho existente
 * PUT /api/hardware/:id
 */
exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { hardware, marca, modelo, preco, foto } = req.body;

    const updateData = {};

    if (hardware !== undefined) {
      if (String(hardware).trim() === '') {
        return res.status(400).json({
          success: false,
          error: { message: 'O campo hardware não pode ser vazio.' },
        });
      }
      updateData.hardware = String(hardware).trim();
    }

    if (marca !== undefined) {
      if (String(marca).trim() === '') {
        return res.status(400).json({
          success: false,
          error: { message: 'O campo marca não pode ser vazio.' },
        });
      }
      updateData.marca = String(marca).trim();
    }

    if (modelo !== undefined) {
      if (String(modelo).trim() === '') {
        return res.status(400).json({
          success: false,
          error: { message: 'O campo modelo não pode ser vazio.' },
        });
      }
      updateData.modelo = String(modelo).trim();
    }

    if (preco !== undefined) {
      if (preco === '' || isNaN(Number(preco))) {
        return res.status(400).json({
          success: false,
          error: { message: 'O preço deve ser um número válido.' },
        });
      }
      if (Number(preco) < 0) {
        return res.status(400).json({
          success: false,
          error: { message: 'O preço deve ser um valor maior ou igual a zero.' },
        });
      }
      updateData.preco = Number(preco);
    }

    if (foto !== undefined) {
      updateData.foto = String(foto).trim();
    }

    const updated = await Hardware.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Aparelho de hardware não encontrado.',
        },
      });
    }

    return res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Excluir um aparelho cadastrado
 * DELETE /api/hardware/:id
 */
exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Hardware.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Aparelho de hardware não encontrado.',
        },
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        message: 'Aparelho excluído com sucesso.',
      },
    });
  } catch (error) {
    next(error);
  }
};
