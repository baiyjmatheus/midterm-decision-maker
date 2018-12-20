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

  // Update poll info
  router.put("/:poll_id", (req ,res) => {
    res.send("Update poll information");
  });

  // Render participant page
  router.get("/:poll_id", (req, res) => {
    const pollId = req.params.poll_id;
  
    // Get polls.question and options for that poll
    knex.select('polls.question', 'options.description')
    .from('polls')
    .innerJoin('options', 'polls.id', 'options.poll_id')
    .where('polls.id', pollId)
    .then((result) => {
      let options = [];
      let question = "";

      question = result[0].question;
      result.forEach((element) => {
        options.push(element.description);
      });

      const templatedVars = {
        id: pollId,
        question,
        options
      }

      console.log(templatedVars);
      // console.log(templatedVars);
      res.render("voting-poll", templatedVars);
    });

  });

  // Submit participant choices
  router.post("/:poll_id", (req, res) => {
    console.log(req.body);
    res.send("Participant submits his/her choices to db");
  });

  return router;
}