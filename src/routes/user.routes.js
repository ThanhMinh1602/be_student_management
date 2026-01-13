const express = require('express');
const router = express.Router();
const controller = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');

/**
 * @openapi
 * /api/user:
 *   get:
 *     tags:
 *       - user
 *     summary: List user (filter by classId)
 *     parameters:
 *       - in: query
 *         name: classId
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number (1-based)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Items per page
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: user list
 */
router.get('/', authMiddleware,  controller.list);

/**
 * @openapi
 * /api/user:
 *   post:
 *     tags:
 *       - user
 *     summary: Create a new student account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Student created
 */
router.post('/', authMiddleware,  controller.add);

/**
 * @openapi
 * /api/user/{id}/assign:
 *   put:
 *     tags:
 *       - user
 *     summary: Assign student to a class
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
 *               classId:
 *                 type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Assigned
 */
router.put('/:id/assign', authMiddleware,  controller.assign);

/**
 * @openapi
 * /api/user/{id}/remove-class:
 *   put:
 *     tags:
 *       - user
 *     summary: Remove student from class
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Removed from class
 */
router.put('/:id/remove-class', authMiddleware,  controller.removeFromClass);

/**
 * @openapi
 * /api/user/{id}/toggle-status:
 *   put:
 *     tags:
 *       - user
 *     summary: Toggle student active status
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Status toggled
 */
router.put('/:id/toggle-status', authMiddleware,  controller.toggleStatus);

/**
 * @openapi
 * /api/user/{id}/reset-password:
 *   put:
 *     tags:
 *       - user
 *     summary: Reset student password to default
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Password reset
 */
router.put('/:id/reset-password', authMiddleware,  controller.resetPassword);

/**
 * @openapi
 * /api/user/{id}:
 *   delete:
 *     tags:
 *       - user
 *     summary: Delete a student
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Deleted
 */
router.delete('/:id', authMiddleware,  controller.remove);

module.exports = router;
