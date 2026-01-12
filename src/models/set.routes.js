const express = require('express');
const router = express.Router();
const controller = require('../controllers/set.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { requireRole } = require('../middlewares/role.middleware');

/**
 * @openapi
 * /api/sets:
 *   post:
 *     tags:
 *       - Sets
 *     summary: Create a question set
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *             required:
 *               - name
 *     responses:
 *       201:
 *         description: Set created
 */
router.post(
  '/',
  authMiddleware,
  requireRole('teacher', 'admin'),
  controller.createSet
);

/**
 * @openapi
 * /api/sets:
 *   get:
 *     tags:
 *       - Sets
 *     summary: List sets
 *     responses:
 *       200:
 *         description: List of sets
 */
router.get(
  '/',
  authMiddleware,
  requireRole('teacher', 'admin'),
  controller.listSets
);

/**
 * @openapi
 * /api/sets/{id}:
 *   get:
 *     tags:
 *       - Sets
 *     summary: Get a set by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Set
 */
router.get(
  '/:id',
  authMiddleware,
  requireRole('teacher', 'admin'),
  controller.getSet
);

/**
 * @openapi
 * /api/sets/{id}:
 *   put:
 *     tags:
 *       - Sets
 *     summary: Update a set
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
 *               name:
 *                 type: string
 *               questionCount:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Updated set
 */
router.put(
  '/:id',
  authMiddleware,
  requireRole('teacher', 'admin'),
  controller.updateSet
);

/**
 * @openapi
 * /api/sets/{id}:
 *   delete:
 *     tags:
 *       - Sets
 *     summary: Delete a set and its questions
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
  requireRole('teacher', 'admin'),
  controller.deleteSet
);

module.exports = router;
