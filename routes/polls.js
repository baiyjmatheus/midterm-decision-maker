"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {
  // Submit new poll to db
  router.post("/", (req, res) => {
    res.send("Send new poll to db")  
  });

  // Render poll admin page
  router.get("/:poll_id/admin", (req, res) => {
    res.send("Poll page / Admin perspective");
  });
  // New poll
  router.get("/new", (req, res) => {
    res.render("new_poll");
  });


  // Update poll info
  router.put("/:poll_id", (req ,res) => {
    res.send("Update poll information");
  });

  // Render participant page
  router.get("/:poll_id", (req, res) => {
    var data = knex('users_choices')
    .join('options', 'users_choices.option_id', '=', 'options.id')
    .join('polls', 'polls.id', '=', 'options.poll_id')
    .select('rank', 'id')
    .where('options.poll_id', '=', '2')
    .then(function(result) {
      console.log(result)
    })
    res.send("Poll page / Participant perspective");
  });

  // Submit participant choices
  router.post("/:poll_id", (req, res) => {
    res.send("Participant submits his/her choices to db");
  });

  return router;
}