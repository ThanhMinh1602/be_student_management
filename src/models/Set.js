const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const SetSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    questionCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const SetModel = mongoose.model('Set', SetSchema);
module.exports = SetModel;
