const mongoose = require('mongoose');

const urlRegex = /^(https?:\/\/)[^\s/$.?#].[^\s]*$/i;

const hardwareSchema = new mongoose.Schema(
  {
    hardware: {
      type: String,
      required: [true, 'O campo hardware (tipo/nome) é obrigatório.'],
      trim: true,
      maxlength: [100, 'O campo hardware não pode exceder 100 caracteres.'],
    },
    marca: {
      type: String,
      required: [true, 'O campo marca é obrigatório.'],
      trim: true,
      maxlength: [100, 'O campo marca não pode exceder 100 caracteres.'],
    },
    modelo: {
      type: String,
      required: [true, 'O campo modelo é obrigatório.'],
      trim: true,
      maxlength: [100, 'O campo modelo não pode exceder 100 caracteres.'],
    },
    preco: {
      type: Number,
      required: [true, 'O campo preço é obrigatório.'],
      min: [0, 'O preço deve ser um valor maior ou igual a zero.'],
      validate: {
        validator: function (v) {
          return !isNaN(v) && isFinite(v);
        },
        message: 'O preço informado deve ser um número válido.',
      },
    },
    foto: {
      type: String,
      trim: true,
      default: '',
      validate: {
        validator: function (v) {
          if (!v || v.trim() === '') return true;
          return urlRegex.test(v);
        },
        message: 'A foto deve ser uma URL válida iniciada por http:// ou https://',
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret._id;
        return ret;
      },
    },
  }
);

const Hardware = mongoose.models.Hardware || mongoose.model('Hardware', hardwareSchema);

module.exports = Hardware;
