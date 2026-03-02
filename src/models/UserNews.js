const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userNewsSchema = Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    news: {
      type: Schema.Types.ObjectId,
      ref: "News",
      required: true,
    },
    is_hidden: {
      type: Boolean,
      default: false,
    },
    hidden_at: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

userNewsSchema.index({ user: 1, news: 1 }, { unique: true });

const UserNews = mongoose.model("UserNews", userNewsSchema);

module.exports = UserNews;
