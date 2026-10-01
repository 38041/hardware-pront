const mongoose = require('mongoose');

function validateId(req, res, next) {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      error: {
        message: `O ID '${id}' informado não é um identificador válido do MongoDB.`,
      },
    });
  }

  next();
}

module.exports = validateId;
