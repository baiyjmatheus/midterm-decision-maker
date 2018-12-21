"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {
  // Submit new poll to db
  router.post("/", (req, res) => {
    let question = req.body.question;
    let options = req.body.options;
    let user_id = req.session.id[0];
    let poll_id;
    knex('polls')
    .returning('id')
    .insert({question: question, type: 1, creator_id: user_id})
    .then(function(newId) {
      poll_id = newId;
      options.forEach((option) => {
        knex('options')
        .insert({description:option, poll_id: newId[0]})
        .finally();
      })
    })
    .then(() => {
      res.send(poll_id);
    });
  });

  // Render poll admin page
  router.get("/:poll_id/admin", (req, res) => {
    const userId = req.session.id[0];
    const pollId = req.params.poll_id;
    isCreator(userId, pollId).then((result) => {
      if (result) {
        res.render("admin_poll");
      } else {
        res.send("You don't have permission to acess this page");
      }
    });
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

  // returns if the poll belongs to user
  function isCreator(userId, pollId) {
    return new Promise((resolve, reject) => {
      knex.select('creator_id')
        .from('polls')
        .where({'id': pollId})
        .then((result) => {
          if (result[0].creator_id === userId) {
            resolve(true);
          } else {
            resolve(false);
          }
          reject();
        });
    });
  }

  function bordaCount() {
    
  }

  return router;
}
