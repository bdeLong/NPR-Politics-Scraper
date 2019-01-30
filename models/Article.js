var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ArticleSchema = new Schema({

  note: [{
    type: Schema.Types.ObjectId,
    ref: "Note",
  }],
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
  }

});

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;
