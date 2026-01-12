// Shared response helpers for API

function _toPlain(obj) {
  // If Mongoose document, convert to plain object
  if (obj && typeof obj.toObject === 'function') return obj.toObject();
  return obj;
}

function sanitize(obj) {
  if (obj === null || obj === undefined) return obj;

  if (Array.isArray(obj)) return obj.map(sanitize);

  if (typeof obj === 'object') {
    // leave Date, RegExp, Buffer as-is
    if (obj instanceof Date) return obj;
    if (obj instanceof RegExp) return obj;
    if (typeof Buffer !== 'undefined' && Buffer.isBuffer(obj)) return obj;

    const plain = _toPlain(obj);
    const out = {};
    for (const key of Object.keys(plain)) {
      if (key === '_id' || key === '__v') continue;
      out[key] = sanitize(plain[key]);
    }
    return out;
  }

  // primitives
  return obj;
}

function success(res, data = null, message = 'Success', status = 200) {
  const clean = sanitize(data);
  const payload = { success: true, data: clean, message };

  // Attach total for list responses.
  let total = null;
  if (Array.isArray(clean)) {
    total = clean.length;
  } else if (clean && typeof clean === 'object') {
    // Support services that return { items, total }
    if (Array.isArray(clean.items) && typeof clean.total === 'number') {
      payload.data = clean.items;
      total = clean.total;
    }
  }

  if (total !== null) payload.total = total;

  return res.status(status).json(payload);
}

function error(res, message = 'Error', status = 500, errors = null) {
  const payload = { success: false, message };
  if (errors) payload.errors = sanitize(errors);
  return res.status(status).json(payload);
}

module.exports = { success, error, sanitize };
