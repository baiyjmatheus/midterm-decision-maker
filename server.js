"use strict";

require('dotenv').config();

const PORT        = process.env.PORT || 8080;
const ENV         = process.env.ENV || "development";
const express     = require("express");
const bodyParser  = require("body-parser");
const sass        = require("node-sass-middleware");
const app         = express();

const knexConfig  = require("./knexfile");
const knex        = require("knex")(knexConfig[ENV]);
const morgan      = require('morgan');
const knexLogger  = require('knex-logger');

// Seperated Routes for each Resource
const usersRoutes = require("./routes/users");

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));

// Mount all resource routes
app.use("/api/users", usersRoutes(knex));

// Home page
app.get("/", (req, res) => {
  res.render("index");
});

// Add new user to db
app.post("/users", (req, res) => {
  res.send("Send new user info to db");
});

// Submit new poll to db
app.post("/polls", (req, res) => {
  res.send("Send new poll to db")
});

// Render poll admin page
app.get("/polls/:poll_id/admin", (req, res) => {
  res.send("Poll page / Admin perspective");
});

// Update poll info
app.put("/polls/:poll_id", (req ,res) => {
  res.send("Update poll information");
});

// Render participant page
app.get("/polls/:poll_id", (req, res) => {
  res.send("Poll page / Participant perspective");
});

// Submit participant choices
app.post("/polls/:poll_id", (req, res) => {
  res.send("Participant submits his/her choices to db");
});

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
