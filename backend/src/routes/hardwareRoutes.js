const express = require('express');
const router = express.Router();
const hardwareController = require('../controllers/hardwareController');
const validateId = require('../middlewares/validateId');

// Rota raiz de hardware: /api/hardware
router.get('/', hardwareController.getAll);
router.post('/', hardwareController.create);

// Rotas com ID: /api/hardware/:id
router.get('/:id', validateId, hardwareController.getById);
router.put('/:id', validateId, hardwareController.update);
router.delete('/:id', validateId, hardwareController.delete);

module.exports = router;
