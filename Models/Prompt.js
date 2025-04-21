const mongoose = require("mongoose");

const promptSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: String,
  content: {
    type: String,
    required: true,
  },
  tags: [String],
  category: {
    type: String,
    default: "General",
  },
  favourites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // each user who liked/favourited
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Prompt", promptSchema);
