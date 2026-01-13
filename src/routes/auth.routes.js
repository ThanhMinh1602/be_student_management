const express = require('express');
const router = express.Router();
const controller = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { registerSchema, loginSchema } = require('../helpers/validation_schema');
/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *             required:
 *               - name
 *               - username
 *               - password
 *     responses:
 *       201:
 *         description: User created
 */
router.post('/register', validate(registerSchema), controller.register);

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Login and receive JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - username
 *               - password
 *     responses:
 *       200:
 *         description: Authenticated
 */
router.post('/login', validate(loginSchema), controller.login);

/**
 * @openapi
 * /api/auth/me:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Get current user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user
 */
router.get('/me', authMiddleware, controller.me);

/**
 * @openapi
 * /api/auth/refresh:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Refresh Access Token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *             required:
 *               - refreshToken
 *     responses:
 *       200:
 *         description: Token refreshed
 *       401:
 *         description: Refresh token invalid or expired
 */
router.post('/refresh', controller.refresh);
module.exports = router;
