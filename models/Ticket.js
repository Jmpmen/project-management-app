const mongoose = require("mongoose");

const TicketSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  cloudinaryId: {
    type: String,
  },
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
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

//MongoDB Collection named here - will give lowercase plural of name 
module.exports = mongoose.model("Ticket", TicketSchema);
