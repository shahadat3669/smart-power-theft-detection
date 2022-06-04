const Joi = require('joi');
const express = require('express');
const validator = require('express-joi-validation').createValidator({});

const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(12).required(),
  name: Joi.string()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(12).required()
});

router.post(
  '/register',
  validator.body(registerSchema),
  authController.register
);

router.post('/login', validator.body(loginSchema), authController.login);

module.exports = router;
