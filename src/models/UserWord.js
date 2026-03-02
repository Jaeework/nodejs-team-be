const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userWordSchema = Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    word: {
      type: Schema.Types.ObjectId,
      ref: "Word",
      required: true,
    },
    isDone: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

userWordSchema.index({ user: 1, word: 1 }, { unique: true });

const UserWord = mongoose.model("UserWord", userWordSchema);

module.exports = UserWord;
