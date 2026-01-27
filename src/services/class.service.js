const ClassModel = require('../models/Class');
const UserModel = require('../models/User');

async function listClasses(filter = {}) {
    // Không còn lọc theo teacherId nữa, query rỗng để lấy tất cả
    const query = {};

    // Xử lý phân trang
    const page = Math.max(parseInt(filter.page, 10) || 1, 1);
    const limit = Math.max(parseInt(filter.limit, 10) || 20, 1);
    const skip = (page - 1) * limit;

    // Chạy song song query lấy data và đếm tổng số lượng
    const [items, total] = await Promise.all([
        ClassModel.find(query)
            .sort({ createdAt: -1 }) // Sắp xếp mới nhất lên đầu
            .skip(skip)
            .limit(limit).populate('students'),
        ClassModel.countDocuments(query).populate('students'),
    ]);

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
}

async function getClassById(id) {
    return ClassModel.findById(id).populate('students');
}

async function createClass(data) {
    const c = new ClassModel(data);
    return c.save();
}

async function updateClass(id, data) {
    return ClassModel.findByIdAndUpdate(id, data, { new: true });
}

async function deleteClass(id) {
    return ClassModel.findByIdAndDelete(id);
}

async function addStudentToClass(classId, studentId) {
    const c = await ClassModel.findById(classId);
    if (!c) {
        const error = new Error('Class not found');
        error.status = 404;
        throw error;
    }

    // Kiểm tra trùng lặp
    const isExisted = c.students.includes(studentId);
    if (isExisted) {
        const error = new Error('Học sinh này đã có trong lớp học');
        error.status = 400; // Bad Request
        throw error;
    }

    // Nếu chưa có thì mới thêm
    c.students.push(studentId);
    await c.save();

    // Lấy thông tin student trả về
    const studentInfo = await UserModel.findById(studentId);
    if (!studentInfo) {
        const error = new Error('Student not found');
        error.status = 404;
        throw error;
    }

    return studentInfo;
}

async function removeStudentFromClass(classId, studentId) {
    const c = await ClassModel.findById(classId);
    if (!c) {
        const error = new Error('Không tìm thấy lớp học');
        error.status = 404;
        throw error;
    }

    // Kiểm tra xem học sinh có trong lớp không
    const isExisted = c.students.includes(studentId);
    if (!isExisted) {
        const error = new Error('Học sinh này không có trong lớp học này');
        error.status = 400;
        throw error;
    }

    // Xóa studentId khỏi mảng students
    c.students.pull(studentId);
    await c.save();

    return { studentId, classId }; // Trả về ID để phía Flutter cập nhật UI
}
module.exports = {
    listClasses,
    getClassById,
    createClass,
    updateClass,
    deleteClass,
    addStudentToClass, removeStudentFromClass
};
