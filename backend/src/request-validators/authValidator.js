const Joi = require("joi");
const { regexPatterns } = require("../utils/constants");
const { handleValidationError } = require("../utils/validatorUtils");

const loginSchema = Joi.object({
  email: Joi.string().trim().email().required().regex(regexPatterns.emailRegex),
  password: Joi.string().min(5).required(),
}).unknown(false);

const loginValidator = (req, res, next) => {
  const payload = req.body;
  const { error } = loginSchema.validate(payload, { abortEarly: false });

  if (handleValidationError(error, res)) return;
  next();
};

const registerSchema = Joi.object({
  userName: Joi.string().trim().min(2).max(100).required(),
  email: Joi.string().trim().email().required().regex(regexPatterns.emailRegex),
  password: Joi.string().min(5).required(),
  confirmPassword: Joi.string().min(5).required().valid(Joi.ref("password")),
}).unknown(false);

const registerValidator = (req, res, next) => {
  const payload = req.body;
  const { error } = registerSchema.validate(payload, { abortEarly: false });

  if (handleValidationError(error, res)) return;
  next();
};

const emailSchema = Joi.object({
  email: Joi.string().trim().email().required().regex(regexPatterns.emailRegex),
}).unknown(false);

const emailValidator = (req, res, next) => {
  const payload = req.body;
  const { error } = emailSchema.validate(payload, { abortEarly: false });

  if (handleValidationError(error, res)) return;
  next();
};

const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().min(7).required(),
  password: Joi.string().min(7).required(),
  confirmPassword: Joi.string().min(7).required().valid(Joi.ref("password")),
}).unknown(false);

const changePasswordValidator = (req, res, next) => {
  const payload = req.body;
  const { error } = changePasswordSchema.validate(payload, {
    abortEarly: false,
  });

  if (handleValidationError(error, res)) return;
  next();
};

const resetPasswordSchema = Joi.object({
  forgotPasswordToken: Joi.string().required(),
  password: Joi.string().min(7).required(),
  confirmPassword: Joi.string().min(7).required().valid(Joi.ref("password")),
}).unknown(false);

const resetPasswordValidator = (req, res, next) => {
  const payload = req.body;
  const { error } = resetPasswordSchema.validate(payload, {
    abortEarly: false,
  });

  if (handleValidationError(error, res)) return;
  next();
};

module.exports = {
  registerValidator,
  loginValidator,
  emailValidator,
  changePasswordValidator,
  resetPasswordValidator,
};
