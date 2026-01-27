const express = require('express');
const router = express.Router();
const controller = require('../controllers/class.controller');
const authMiddleware = require('../middlewares/auth.middleware');

/**
 * @openapi
 * /api/classes:
 *   get:
 *     tags:
 *       - Classes
 *     summary: List classes
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Classes list
 */
router.get('/', authMiddleware, controller.list);

/**
 * @openapi
 * /api/classes:
 *   post:
 *     tags:
 *       - Classes
 *     summary: Create a class
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               schedule:
 *                 type: string
 *               subject:
 *                 type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Class created
 */
router.post('/', authMiddleware, controller.add);

/**
 * @openapi
 * /api/classes/{id}:
 *   get:
 *     tags:
 *       - Classes
 *     summary: Get a class by id
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
 *         description: Class
 */
router.get('/:id', authMiddleware, controller.get);

/**
 * @openapi
 * /api/classes/{id}:
 *   put:
 *     tags:
 *       - Classes
 *     summary: Update a class
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
 *               schedule:
 *                 type: string
 *               subject:
 *                 type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Updated
 */
router.put('/:id', authMiddleware, controller.update);

/**
 * @openapi
 * /api/classes/{id}:
 *   delete:
 *     tags:
 *       - Classes
 *     summary: Delete a class
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
router.delete('/:id', authMiddleware, controller.remove);

/**
 * @openapi
 * /api/classes/{id}/add-student:
 *   put:
 *     tags:
 *       - Classes
 *     summary: Thêm một học sinh vào lớp học
 *     description: Cập nhật danh sách thành viên của lớp bằng cách thêm ID của học sinh.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của lớp học
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - studentId
 *             properties:
 *               studentId:
 *                 type: string
 *                 description: ID của user (học sinh) muốn thêm vào lớp
 *                 example: "65b2a1f8e4b0a123456789ab"
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Thêm học sinh thành công
 *       '404':
 *         description: Không tìm thấy lớp học hoặc học sinh
 *       '500':
 *         description: Lỗi hệ thống
 */
router.put('/:id/add-student', authMiddleware, controller.addStudentToClass);


/**
 * @openapi
 * /api/classes/{id}/remove-student:
 *   put:
 *     tags:
 *       - Classes
 *     summary: Xóa một học sinh khỏi lớp học
 *     description: Cập nhật danh sách thành viên của lớp bằng cách xóa ID của học sinh.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của lớp học
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - studentId
 *             properties:
 *               studentId:
 *                 type: string
 *                 description: ID của user (học sinh) muốn xóa khỏi lớp
 *                 example: "65b2a1f8e4b0a123456789ab"
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Xóa học sinh thành công
 *       '404':
 *         description: Không tìm thấy lớp học hoặc học sinh
 *       '500':
 *         description: Lỗi hệ thống
 */
router.put('/:id/remove-student', authMiddleware, controller.removeStudent);

module.exports = router;
