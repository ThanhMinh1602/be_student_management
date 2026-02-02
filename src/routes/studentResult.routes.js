const express = require('express');
const router = express.Router();
const controller = require('../controllers/studentResult.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { requireRole } = require('../middlewares/role.middleware');

/**
 * @openapi
 * /api/student-results/submit:
 *   post:
 *     tags:
 *       - Student Results
 *     summary: Submit assignment answers
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               assignmentId:
 *                 type: string
 *               answers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     questionId:
 *                       type: string
 *                     selectedOption:
 *                       type: string
 *                     timeTaken:
 *                       type: number
 *     responses:
 *       200:
 *         description: Submitted successfully
 */
router.post(
  '/submit',
  authMiddleware,
  requireRole('student'),
  controller.submitAssignment,
);

/**
 * @openapi
 * /api/student-results:
 *   get:
 *     tags:
 *       - Student Results
 *     summary: Get student results (filter by studentId)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: studentId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of student results
 */
router.get(
  '/',
  authMiddleware,
  requireRole('teacher', 'admin'),
  controller.getStudentResults,
);

/**
 * @openapi
 * /api/student-results/assignment/{assignmentId}:
 *   get:
 *     tags:
 *       - Student Results
 *     summary: Get results for a specific assignment
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: assignmentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Assignment results
 */
router.get(
  '/assignment/:assignmentId',
  authMiddleware,
  requireRole('teacher', 'admin'),
  controller.getAssignmentResults,
);

/**
 * @openapi
 * /api/student-results/my/{assignmentId}:
 *   get:
 *     tags:
 *       - Student Results
 *     summary: Get student's own result for an assignment
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: assignmentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Student assignment result
 */
router.get(
  '/my/:assignmentId',
  authMiddleware,
  requireRole('student'),
  controller.getStudentAssignmentResult,
);

module.exports = router;
