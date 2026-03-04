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
    example: {
      type: String,
    },
    example_meaning: {
      type: String,
    },
    type: {
      type: String,
      enum: ["word", "idiom", "abbreviation"],
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
