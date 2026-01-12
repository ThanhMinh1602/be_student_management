const setService = require('../services/set.service');
const response = require('../helpers/response');

async function createSet(req, res) {
  try {
    const set = await setService.createSet(req.body);
    return response.success(res, set, 'Set created', 201);
  } catch (err) {
    return response.error(res, err.message, 500);
  }
}

async function listSets(req, res) {
  try {
    const sets = await setService.getAllSets();
    return response.success(res, sets, 'Sets list', 200);
  } catch (err) {
    return response.error(res, err.message, 500);
  }
}

async function getSet(req, res) {
  try {
    const { id } = req.params;
    const set = await setService.getSetById(id);
    if (!set) return response.error(res, 'Set not found', 404);
    return response.success(res, set, 'Set found', 200);
  } catch (err) {
    return response.error(res, err.message, 500);
  }
}

async function updateSet(req, res) {
  try {
    const { id } = req.params;
    const set = await setService.updateSet(id, req.body);
    if (!set) return response.error(res, 'Set not found', 404);
    return response.success(res, set, 'Set updated', 200);
  } catch (err) {
    return response.error(res, err.message, 500);
  }
}

async function deleteSet(req, res) {
  try {
    const { id } = req.params;
    const set = await setService.deleteSet(id);
    if (!set) return response.error(res, 'Set not found', 404);
    return response.success(res, set, 'Set deleted', 200);
  } catch (err) {
    return response.error(res, err.message, 500);
  }
}

module.exports = { createSet, listSets, getSet, updateSet, deleteSet };