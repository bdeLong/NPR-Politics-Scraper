var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
  date: {
    type: Date,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },

  summary: {
    type: String,
    required: true,
    unique: true
  },
  note: [{
    type: Schema.Types.ObjectId,
    ref: "Note",
  }]
});

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;
