var express = require("express");
var cors = require("cors"); // We will use CORS to enable cross origin domain requests.
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var app = express();

var schemaName = new Schema(
  {
    request: String,
    time: Number,
  },
  {
    collection: "collectionName",
  }
);

var Model = mongoose.model("Model", schemaName);
mongoose.connect("mongodb://localhost:27017/dbName");

app.get("/find/:query", cors(), function (req, res, next) {
  var query = req.params.query;

  Model.find({
    request: query,
  })
    .exec() //remember to add exec, queries have a .then attribute but aren't promises
    .then(function (result) {
      if (result) {
        res.json(result);
      } else {
        next(); //pass to 404 handler
      }
    })
    .catch(next); //pass to error handler
});

var port = process.env.PORT || 8080;
app.listen(port, function () {
  console.log("Node.js listening on port " + port);
});

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.use(function (req, res, next) {
  res.status(404).send("Sorry cant find that!");
});
