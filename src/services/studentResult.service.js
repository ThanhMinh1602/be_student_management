const StudentResultModel = require('../models/StudentResult');
const AssignmentModel = require('../models/Assignment');
const QuestionModel = require('../models/Question');

async function submitAssignment(assignmentId, studentId, answers) {
  // Check if assignment exists and is still open
  const assignment = await AssignmentModel.findById(assignmentId);
  if (!assignment) {
    const error = new Error('Assignment not found');
    error.statusCode = 404;
    throw error;
  }

  if (new Date() > assignment.dueDate) {
    const error = new Error('Assignment deadline has passed');
    error.statusCode = 400;
    throw error;
  }

  // Find or create student result
  let studentResult = await StudentResultModel.findOne({
    assignmentId,
    studentId,
  });
  if (!studentResult) {
    studentResult = new StudentResultModel({ assignmentId, studentId });
  }

  // Process answers
  const processedAnswers = [];
  let totalCorrect = 0;

  for (const answer of answers) {
    const question = await QuestionModel.findById(answer.questionId);
    if (!question) continue;

    const isCorrect = question.correctOption === answer.selectedOption;
    if (isCorrect) totalCorrect++;

    processedAnswers.push({
      questionId: answer.questionId,
      selectedOption: answer.selectedOption,
      isCorrect,
      timeTaken: answer.timeTaken || 0,
    });
  }

  studentResult.answers = processedAnswers;
  studentResult.totalCorrect = totalCorrect;
  studentResult.score = (totalCorrect / answers.length) * 100; // Assuming equal weight
  studentResult.status = 'submitted';
  studentResult.submittedAt = new Date();

  await studentResult.save();
  return studentResult.populate(['assignmentId', 'studentId']);
}

async function getStudentResults(filter = {}) {
  return StudentResultModel.find(filter)
    .populate(['assignmentId', 'studentId'])
    .sort({ submittedAt: -1 });
}

async function getAssignmentResults(assignmentId) {
  return StudentResultModel.find({ assignmentId })
    .populate(['studentId'])
    .sort({ submittedAt: -1 });
}

async function getStudentAssignmentResult(assignmentId, studentId) {
  return StudentResultModel.findOne({ assignmentId, studentId }).populate([
    'assignmentId',
  ]);
}

module.exports = {
  submitAssignment,
  getStudentResults,
  getAssignmentResults,
  getStudentAssignmentResult,
};
