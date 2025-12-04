const mongoose = require('mongoose');

const OptionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  votes: { type: Number, default: 0 }
});

const PollSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [OptionSchema],
  isActive: { type: Boolean, default: true },
  totalVotes: { type: Number, default: 0 },
  timeLimit: { type: Number, default: 60 },
  noAnswerCount: { type: Number, default: 0 },
  answers: [
    {
      studentId: String,
      name: String,
      optionIndex: Number,
      answeredAt: { type: Date, default: Date.now }
    }
  ],
  allowedVoters: [String],
  teacherName: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Poll', PollSchema);
