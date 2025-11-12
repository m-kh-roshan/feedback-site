const AppError = require('../utilities/appError');

const validateBody = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) return next(new AppError(error.details[0].message, 400, 'VALIDATION_ERROR'));
  next();
};

module.exports = validateBody;