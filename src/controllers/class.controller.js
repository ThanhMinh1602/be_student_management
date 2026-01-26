const classService = require('../services/class.service');
const response = require('../helpers/response');

async function list(req, res) {
  try {
    const { page, limit } = req.query;
    const result = await classService.listClasses({ page, limit });
    return response.success(res, result, 'Classes list', 200);
  } catch (err) {
    return response.error(res, err.message || err, err.status || 500);
  }
}

async function get(req, res) {
  try {
    const { id } = req.params;
    const c = await classService.getClassById(id);
    if (!c) return response.error(res, 'Class not found', 404);
    return response.success(res, c, 'Class found', 200);
  } catch (err) {
    return response.error(res, err.message || err, err.status || 500);
  }
}

async function add(req, res) {
  try {
    const c = await classService.createClass(req.body);
    return response.success(res, c, 'Class created', 201);
  } catch (err) {
    return response.error(res, err.message || err, err.status || 500);
  }
}

async function update(req, res) {
  try {
    const { id } = req.params;
    const updated = await classService.updateClass(id, req.body);
    if (!updated) return response.error(res, 'Class not found', 404);
    return response.success(res, updated, 'Class updated', 200);
  } catch (err) {
    return response.error(res, err.message || err, err.status || 500);
  }
}

async function remove(req, res) {
  try {
    const { id } = req.params;
    const removed = await classService.deleteClass(id);
    if (!removed) return response.error(res, 'Class not found', 404);
    return response.success(res, removed, 'Class deleted', 200);
  } catch (err) {
    return response.error(res, err.message || err, err.status || 500);
  }
}

module.exports = { list, get, add, update, remove };
