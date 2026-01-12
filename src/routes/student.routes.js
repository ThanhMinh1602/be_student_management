const express = require('express');
const router = express.Router();
const controller = require('../controllers/student.controller');
const authMiddleware = require('../middlewares/auth.middleware');

/**
 * @openapi
 * /api/students:
 *   get:
 *     tags:
 *       - Students
 *     summary: List students (filter by classId)
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
 *         description: Students list
 */
router.get('/', authMiddleware,  controller.list);

/**
 * @openapi
 * /api/students:
 *   post:
 *     tags:
 *       - Students
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
 * /api/students/{id}/assign:
 *   put:
 *     tags:
 *       - Students
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
 * /api/students/{id}/remove-class:
 *   put:
 *     tags:
 *       - Students
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
 * /api/students/{id}/toggle-status:
 *   put:
 *     tags:
 *       - Students
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
 * /api/students/{id}/reset-password:
 *   put:
 *     tags:
 *       - Students
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
 * /api/students/{id}:
 *   delete:
 *     tags:
 *       - Students
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
