const setService = require('../services/set.service');
const {
  setCreateSchema,
  setUpdateSchema,
} = require('../helpers/validation_schema');

async function createSet(req, res) {
  try {
    const { error, value } = setCreateSchema.validate(req.body);
    if (error)
      return res.status(400).json({ success: false, message: error.message });
    const set = await setService.createSet(value);
    return res
      .status(201)
      .json({ success: true, data: set, message: 'Set created' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

async function listSets(req, res) {
  try {
    const sets = await setService.getAllSets();
    return res.json({ success: true, data: sets, message: 'Sets list' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

async function getSet(req, res) {
  try {
    const { id } = req.params;
    const set = await setService.getSetById(id);
    if (!set)
      return res.status(404).json({ success: false, message: 'Set not found' });
    return res.json({ success: true, data: set, message: 'Set found' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

async function updateSet(req, res) {
  try {
    const { id } = req.params;
    const { error, value } = setUpdateSchema.validate(req.body);
    if (error)
      return res.status(400).json({ success: false, message: error.message });
    const set = await setService.updateSet(id, value);
    if (!set)
      return res.status(404).json({ success: false, message: 'Set not found' });
    return res.json({ success: true, data: set, message: 'Set updated' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

async function deleteSet(req, res) {
  try {
    const { id } = req.params;
    const set = await setService.deleteSet(id);
    if (!set)
      return res.status(404).json({ success: false, message: 'Set not found' });
    return res.json({ success: true, data: set, message: 'Set deleted' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = { createSet, listSets, getSet, updateSet, deleteSet };
