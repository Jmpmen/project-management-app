const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  severity: {
    type: String,
    required: true,
  },
  assignedTo: {
    type: String,
  },
  status: {
    type: String,
    required: true,
    default: 'todo'
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  dueDate: {
    type: Date,
    required: true,
  },
});

//MongoDB Collection named here - will give lowercase plural of name 
module.exports = mongoose.model("Task", TaskSchema);