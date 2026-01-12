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

        // --- ĐOẠN CẦN THÊM VÀO ĐÂY ---
        // Kiểm tra nếu là ObjectId (dựa vào thuộc tính _bsontype hoặc constructor name)
        // Mongoose ObjectId hoặc MongoDB ObjectId đều có thuộc tính này hoặc hàm toString trả về hex 24 ký tự
        if (obj._bsontype === 'ObjectId' || (obj.constructor && obj.constructor.name === 'ObjectId')) {
            return obj.toString();
        }
        // -----------------------------

        const plain = typeof obj.toJSON === 'function' ? obj.toJSON() : obj;

        const out = {};
        for (const key of Object.keys(plain)) {
            // 1. Bỏ qua các trường không cần thiết
            if (key === '__v' || key === 'password') continue;

            // 2. Map _id -> id
            if (key === '_id') {
                out.id = plain[key].toString();
                continue; 
            }

            // 3. Đệ quy cho các trường còn lại
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
