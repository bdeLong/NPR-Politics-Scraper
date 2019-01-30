const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const cheerio = require("cheerio");
const db = require("./models");

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

mongoose.connect("mongodb://bdelong:mongodb45@ds155411.mlab.com:55411/heroku_s19w3vgl", { useNewUrlParser: true });

// Routes

app.get("/scrape", function (req, res) {
  axios.get("https://www.npr.org/sections/politics/").then(function (response) {
    var $ = cheerio.load(response.data);

    $(".has-image").each(function (i, element) {
      var result = {};
      result.date = $(this)
        .children(".item-info")
        .children(".teaser")
        .children("a")
        .children("time")
        .attr("datetime")
      result.image = $(this)
        .children(".item-image")
        .children(".imagewrap")
        .children("a")
        .children("img")
        .attr("src")
      result.title = $(this)
        .children(".item-info")
        .children(".title")
        .children("a")
        .text();
      result.link = $(this)
        .children(".item-info")
        .children(".title")
        .children("a")
        .attr("href");
      result.summary = $(this)
        .children(".item-info")
        .children(".teaser")
        .children("a")
        .text();

      db.Article.updateMany(result, result, { upsert: true })
        .then(function (dbArticle) {
        })
        .catch(function (err) {
          if (err) { throw err };
        });
    });
  });
});

app.get("/articles", function (req, res) {

  db.Article.find({}).sort({ date: -1 })
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      res.json(err);
    });
});

app.get("/articles/:id", function (req, res) {

  db.Article.findOne({ _id: req.params.id })
    .populate("note")
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      res.json(err);
    });
});

app.post("/articles/:id", function (req, res) {
  db.Note.create(req.body)
    .then(function (dbNote) {
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { note: dbNote._id, $position: 0 } });
    })
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      res.json(err);
    });
});

// Start the server
app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});