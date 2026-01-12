const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const QuestionSchema = new Schema(
  {
    setId: { type: Schema.Types.ObjectId, ref: 'Set', required: true },
    type: {
      type: String,
      required: true,
      enum: ['multipleChoice', 'trueFalse', 'typing', 'rearrange'],
    },
    content: { type: String, required: true },
    timeLimit: { type: Number, default: 30 },
    isRandom: { type: Boolean, default: false },
    options: { type: [String], default: undefined },
    answers: { type: [String], required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const QuestionModel = mongoose.model('Question', QuestionSchema);
module.exports = QuestionModel;
