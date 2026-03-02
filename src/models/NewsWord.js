const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const newsWordSchema = Schema(
  {
    news: {
      type: Schema.Types.ObjectId,
      ref: "News",
      required: true,
    },
    word: {
      type: Schema.Types.ObjectId,
      ref: "Word",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

newsWordSchema.index({ news: 1, word: 1 }, { unique: true });

const NewsWord = mongoose.model("NewsWord", newsWordSchema);

module.exports = NewsWord;
