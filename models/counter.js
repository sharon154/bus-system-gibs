// models/Counter.js
const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  seq: { type: Number, default: 0 }
});

const counter = mongoose.model('Counter', counterSchema);

const getNextSequence = async (sequenceName) => {
  const sequenceDocument = await counter.findOneAndUpdate(
    { id: sequenceName },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return sequenceDocument.seq;
};

module.exports = { counter, getNextSequence };
