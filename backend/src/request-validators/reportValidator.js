const Joi = require("joi");
const { handleValidationError } = require("../utils/validatorUtils");

const reportSchema = Joi.object({
  title: Joi.string().trim().min(1).max(100).required(),
  description: Joi.string().trim().min(1).max(500).required(),
  date: Joi.date().required(),
  speciesId: Joi.string().trim().min(1).max(100).required(),
  imageUrl: Joi.string().trim().min(1).max(100).required(),
  latitude: Joi.number().required(),
  longitude: Joi.number().required(),
  continent: Joi.string().trim().min(1).max(100).required(),
  country: Joi.string().trim().min(1).max(100).required(),
}).unknown(false);

const createReportValidator = (req, res, next) => {
  const payload = req.body;
  const { error } = reportSchema.validate(payload, {
    abortEarly: false,
  });

  if (handleValidationError(error, res)) return;
  next();
};

module.exports = {
  createReportValidator,
};
