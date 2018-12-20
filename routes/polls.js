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

    const pollId = req.params.poll_id;

    // Get polls.question and options for that poll
    knex.select('polls.question', 'options.description', 'options.id')
    .from('polls')
    .innerJoin('options', 'polls.id', 'options.poll_id')
    .where('polls.id', pollId)
    .then((result) => {
      let options = [];
      let question = "";

      question = result[0].question;
      result.forEach((element) => {
        let option = {
          id: element.id,
          description: element.description
        }
        options.push(option);
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
    // Set ranks for each option
    const pollId = req.params.poll_id;
    const {options} = req.body;
    const ranks = [];
    for (let i = 1; i <= options.length; i++) {
      ranks.push(i);
    }

    // Sent user choices to database
    ranks.forEach((rank, i) => {
      knex('users_choices')
      .insert({user_id: 2, option_id: options[i].id, rank: rank})
      .then(() => {
        console.log("sucessfully inserted to users_choices");
      });
    });


    res.send("Thanks for voting");
  });

  return router;
}
