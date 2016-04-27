// require all of the modules we need
var http = require("http");
var path = require("path");
var express = require("express");
var logger = require("morgan");
var bodyParser = require("body-parser");

// create the express application
var app = express();

app.set("views", path.resolve(__dirname, "views")); // tells express that views are in the views folder
app.set("view engine", "ejs"); // tells express to use ejs templating engine

var entries = []; // create an empty array to store entries
app.locals.entries = entries; // allows all of our views to access the entries variable

// use morgan to log every request
app.use(logger("dev"));

// Populates a variable called req.body if the user is submitting a form.
// (The extended option is required.)
app.use(bodyParser.urlencoded({
  extended: false
}));

// render homepage when root is requested
app.get("/", function(request, response) {
  response.render("index");
});

// render new entry page when requested
app.get("/new-entry", function(request, response) {
  response.render("new-entry");
});

// adds a new entry to the list of entries
app.post("/new-entry", function(request, response) {
  if (!request.body.title || !request.body.body) {
    response.status(400).send("Entries must have a title and a body");
    return;
  }
  entries.push({
    title: request.body.title,
    content: request.body.body,
    published: new Date()
  });
  response.redirect("/");
});

// renders 404 when requesting an unknown source
app.use(function(request, response){
  response.status(404).render("404");
});

// starts the server on port 3000
http.createServer(app).listen(3000, function(){
  console.log("Guestbooks app started on port 3000");
});
