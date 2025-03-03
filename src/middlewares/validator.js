import { body } from 'express-validator';
import { validarCampos } from './validar-campos.js';
import { existenteEmail } from '../helpers/db-validator.js';

const validarEmail = () => [
    body("email").isEmail().withMessage("You must enter a valid email"),
    body("email").custom(existenteEmail)
];

export const registerValidator = [
    body('name', 'The name is required').not().isEmpty(),
    body('surname', 'The surname is required').not().isEmpty(),
    ...validarEmail(),
    body("password", "Password must be at least 6 characters").isLength({ min: 6 }),
    validarCampos
];

export const loginValidator = [
    body("email").optional().isEmail().withMessage("Enter a valid email address"),
    body("username").optional().isString().withMessage("Enter a valid username"),
    body("password", "Password must be at least 6 characters").isLength({ min: 6 }),
    validarCampos
];

