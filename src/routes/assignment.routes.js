const express = require('express');
const router = express.Router();
const controller = require('../controllers/assignment.controller');
const authMiddleware = require('../middlewares/auth.middleware');

/**
 * @openapi
 * /api/assignments:
 *   post:
 *     tags:
 *       - Assignments
 *     summary: Giao bài tập cho một lớp học
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *               classId:
 *                 type: string
 *               setId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Assigned successfully
 */
router.post('/', authMiddleware, controller.createAssignment);

/**
 * @openapi
 * /api/assignments:
 *   get:
 *     tags:
 *       - Assignments
 *     summary: Lấy danh sách bài tập (Lọc theo classId)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: classId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of assignments
 */
router.get('/', authMiddleware, controller.listAssignments);

/**
 * @openapi
 * /api/assignments/{id}:
 *   get:
 *     tags:
 *       - Assignments
 *     summary: Lấy chi tiết bài tập
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
 *         description: Assignment details
 */
router.get('/:id', authMiddleware, controller.getAssignment);

/**
 * @openapi
 * /api/assignments/{id}:
 *   put:
 *     tags:
 *       - Assignments
 *     summary: Cập nhật bài tập
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
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Updated successfully
 */
router.put('/:id', authMiddleware, controller.updateAssignment);

/**
 * @openapi
 * /api/assignments/{id}:
 *   delete:
 *     tags:
 *       - Assignments
 *     summary: Xoá bài tập
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
 *         description: Deleted successfully
 */
router.delete('/:id', authMiddleware, controller.deleteAssignment);

module.exports = router;
