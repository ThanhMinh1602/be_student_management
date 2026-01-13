const userService = require('../services/user.service');
const response = require('../helpers/response');
const MessageCodes = require('../constants/messageCodes');
// Import schema validation đã tạo
const { studentCreateSchema } = require('../helpers/validation_schema');

async function list(req, res) {
  try {
    const { classId, page, limit } = req.query;
    const result = await userService.listStudents({ classId, page, limit }); // Đổi tên hàm cho đúng service
    return response.success(res, result, MessageCodes.USER.CURRENT_USER, 200);
  } catch (err) {
    return response.error(res, err.message || MessageCodes.INTERNAL, err.status || 500);
  }
}

async function add(req, res) {
  try {
    // 1. Validate dữ liệu đầu vào bằng Joi
    const { error, value } = studentCreateSchema.validate(req.body);

    // Nếu có lỗi (vd: role là "string" thay vì "student"), trả về lỗi Validation ngay
    if (error) {
      return response.error(res, MessageCodes.VALIDATION.MISSING_FIELDS, 400);
    }

    // 2. Gọi service với dữ liệu đã qua validate (value)
    const s = await userService.addStudent(value);
    return response.success(res, s, MessageCodes.AUTH.USER_REGISTERED, 201);
  } catch (err) {
    return response.error(res, err.message || MessageCodes.INTERNAL, err.status || 500);
  }
}

async function assign(req, res) {
  try {
    const { id } = req.params;
    const { classId } = req.body;

    // Kiểm tra classId có trống không
    if (!classId) return response.error(res, MessageCodes.VALIDATION.MISSING_FIELDS, 400);

    const updated = await userService.assignStudentToClass(id, classId);
    if (!updated) return response.error(res, MessageCodes.USER.NOT_FOUND, 404);

    return response.success(res, updated, 'Assigned to class', 200);
  } catch (err) {
    return response.error(res, err.message || MessageCodes.INTERNAL, err.status || 500);
  }
}

async function removeFromClass(req, res) {
  try {
    const { id } = req.params;
    const updated = await userService.removeStudentFromClass(id);
    if (!updated) return response.error(res, MessageCodes.USER.NOT_FOUND, 404);

    return response.success(res, updated, 'Removed from class', 200);
  } catch (err) {
    return response.error(res, err.message || MessageCodes.INTERNAL, err.status || 500);
  }
}

async function toggleStatus(req, res) {
  try {
    const { id } = req.params;
    const updated = await userService.toggleStatus(id);
    if (!updated) return response.error(res, MessageCodes.USER.NOT_FOUND, 404);

    return response.success(res, updated, 'Toggled status', 200);
  } catch (err) {
    return response.error(res, err.message || MessageCodes.INTERNAL, err.status || 500);
  }
}

async function resetPassword(req, res) {
  try {
    const { id } = req.params;
    const updated = await userService.resetPassword(id);
    if (!updated) return response.error(res, MessageCodes.USER.NOT_FOUND, 404);

    return response.success(res, updated, 'Password reset', 200);
  } catch (err) {
    return response.error(res, err.message || MessageCodes.INTERNAL, err.status || 500);
  }
}

async function remove(req, res) {
  try {
    const { id } = req.params;
    const removed = await userService.deleteStudent(id);
    if (!removed) return response.error(res, MessageCodes.USER.NOT_FOUND, 404);

    return response.success(res, removed, 'Student deleted', 200);
  } catch (err) {
    return response.error(res, err.message || MessageCodes.INTERNAL, err.status || 500);
  }
}

module.exports = {
  list,
  add,
  assign,
  removeFromClass,
  toggleStatus,
  resetPassword,
  remove,
};