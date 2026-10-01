function errorHandler(err, req, res, next) {
  // Trata JSON malformado no body
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'JSON malformado no corpo da requisição.',
      },
    });
  }

  // Trata erros de validação do Mongoose
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      error: {
        message: messages.join(' '),
      },
    });
  }

  // Trata CastError do Mongoose (conversão de tipo incorreta)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error: {
        message: `Valor inválido fornecido para o campo ${err.path}.`,
      },
    });
  }

  // Log seguro do erro no console do servidor
  console.error('Erro interno não tratado:', err);

  // Resposta padrão sem vazar detalhes internos
  return res.status(500).json({
    success: false,
    error: {
      message: 'Ocorreu um erro interno no servidor. Tente novamente mais tarde.',
    },
  });
}

module.exports = errorHandler;
