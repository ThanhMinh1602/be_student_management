const express = require('express');
const router = express.Router();
const controller = require('../controllers/question.controller');
const authMiddleware = require('../middlewares/auth.middleware');

/**
 * @openapi
 * /api/questions:
 *   post:
 *     tags:
 *       - Questions
 *     summary: Create a question
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               setId:
 *                 type: string
 *               type:
 *                 type: string
 *               content:
 *                 type: string
 *               timeLimit:
 *                 type: integer
 *               isRandom:
 *                 type: boolean
 *               options:
 *                 type: array
 *                 items:
 *                   type: string
 *               answers:
 *                 type: array
 *                 items:
 *                   type: string
 *             required:
 *               - setId
 *               - type
 *               - answers
 *     responses:
 *       201:
 *         description: Question created
 */
router.post(
  '/',
  authMiddleware,
  controller.createQuestion
);

/**
 * @openapi
 * /api/questions:
 *   get:
 *     tags:
 *       - Questions
 *     summary: List questions (optionally filter by setId)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: setId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of questions
 */
router.get(
  '/',
  authMiddleware,
  controller.listQuestions
);

/**
 * @openapi
 * /api/questions/{id}:
 *   get:
 *     tags:
 *       - Questions
 *     summary: Get a question by id
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Question
 */
router.get(
  '/:id',
  authMiddleware,
  controller.getQuestion
);

/**
 * @openapi
 * /api/questions/{id}:
 *   put:
 *     tags:
 *       - Questions
 *     summary: Update a question
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *               timeLimit:
 *                 type: integer
 *               isRandom:
 *                 type: boolean
 *               options:
 *                 type: array
 *                 items:
 *                   type: string
 *               answers:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Updated question
 */
router.put(
  '/:id',
  authMiddleware,
  controller.updateQuestion
);

/**
 * @openapi
 * /api/questions/{id}:
 *   delete:
 *     tags:
 *       - Questions
 *     summary: Delete a question
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deleted
 */
router.delete(
  '/:id',
  authMiddleware,
  controller.deleteQuestion
);

module.exports = router;
