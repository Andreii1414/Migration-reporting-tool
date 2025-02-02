const Joi = require("joi");
const { handleValidationError } = require("../utils/validatorUtils");

const speciesSchema = Joi.object({
  name: Joi.string().trim().min(1).max(100).required(),
}).unknown(false);

const createSpeciesValidator = (req, res, next) => {
  const payload = req.body;
  const { error } = speciesSchema.validate(payload, {
    abortEarly: false,
  });

  if (handleValidationError(error, res)) return;
  next();
};

module.exports = {
  createSpeciesValidator,
};
