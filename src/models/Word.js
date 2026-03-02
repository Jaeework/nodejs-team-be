const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const wordSchema = Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
    },
    meaning: {
      type: String,
    },
    type: {
      type: String,
      enum: ["word", "idiom"],
    },
    tts_url: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

const Word = mongoose.model("Word", wordSchema);

module.exports = Word;
