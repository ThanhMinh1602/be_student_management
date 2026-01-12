const ClassModel = require('../models/Class');

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
            .limit(limit),
        ClassModel.countDocuments(query),
    ]);

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
}

async function getClassById(id) {
    return ClassModel.findById(id);
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

module.exports = {
    listClasses,
    getClassById,
    createClass,
    updateClass,
    deleteClass,
};
