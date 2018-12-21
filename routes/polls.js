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
    let descriptions;
    let data = {};
    let scores = [];
    isCreator(userId, pollId).then((result) => {
      if (result) {
        getOptionsByPollId(pollId).then((options) => {
          descriptions = options;
        })
        .then(() => {
          getRanksByPollId(pollId).then((result) => {
            // count scores
            result.forEach((element) => {
              if (data[element.description]) {
                data[element.description] += element.rank;
              } else {
                data[element.description] = element.rank;
              }
            });

            //Get scores from data and push to data array
            descriptions.forEach((description) => {
              console.log(description);
              scores.push(data[description.description]);
            });

            const templatedVars = {
              descriptions,
              scores
            };
            res.render("admin_poll", templatedVars);
          });
        })
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
      res.render("voting-poll", templatedVars);
    });

  });

  // Submit participant choices
  router.post("/:poll_id", (req, res) => {
    // Set ranks for each option
    const userId = req.session.id[0];
    const pollId = req.params.poll_id;
    const {options} = req.body;
    const ranks = [];

    for (let i = options.length; i >= 1; i--) {
      ranks.push(i);
    }

    // Sent user choices to database
    ranks.forEach((rank, i) => {
      knex('users_choices')
      .insert({user_id: userId, option_id: options[i].id, rank: rank})
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
  //returns number of options of a poll
  function getOptionsByPollId (pollId) {
    return new Promise((resolve, reject) => {
      knex.select('description')
        .from('options')
        .where('poll_id', pollId)
        .then((result) => {
          resolve(result)
        });
    })
  }
  //returns array of descriptions from options 
  function getRanksByPollId (pollId) {
    return new Promise((resolve, reject) => {
      knex.select('options.description', 'users_choices.rank')
        .from('options')
        .innerJoin('users_choices', 'options.id', 'users_choices.option_id')
        .innerJoin('polls', 'polls.id', 'options.poll_id')
        .where('polls.id', pollId)
        .then((result) => {
          resolve(result)
      })
    })
  }

  // return number of ocurrences of a rank in a option
  function getNumRanksInOption(rank, optionDesc) {
    return new Promise((resolve, reject) => {
      knex('options').count()
      .innerJoin('users_choices', 'options.id', 'users_choices.option_id')
      .where('users_choices.rank', rank)
      .andWhere('options.description', optionDesc)
      .then((result) => {
        resolve(result);
      });
    });
  }

  // Descript, ranks
  function getRanksByPollId (pollId) {
    return new Promise((resolve, reject) => {
      knex.select('options.description', 'users_choices.rank')
        .from('options')
        .innerJoin('users_choices', 'options.id', 'users_choices.option_id')
        .innerJoin('polls', 'polls.id', 'options.poll_id')
        .where('polls.id', pollId)
        .then((result) => {
          resolve(result)
      })
    })
  }

  // get options counter by poll
  function getOptionsByPollId (pollId) {
    return new Promise((resolve, reject) => {
      knex.select('description')
        .from('options')
        .where('poll_id', pollId)
        .then((result) => {
          resolve(result)
        });
    })
  }


  return router;
}
