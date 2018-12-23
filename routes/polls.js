"use strict";
const mailgunConfig = require('./config');
const express = require('express');
const router  = express.Router();
const mailgun = require('mailgun-js')({apiKey: mailgunConfig.api_key, domain: mailgunConfig.domain});
const uuidv4 = require('uuidv4');

module.exports = (knex) => {
  // Submit new poll to db
  router.post("/", (req, res) => {
    let question = req.body.question;
    let options = req.body.options;
    let info = req.body.info;
    let user_id = req.session.id;
    console.log(user_id)
    let poll_id = uuidv4();
    knex('polls')
    .returning('id')
    .insert({id: poll_id, question: question, type: 1, creator_id: user_id})
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
    const userId = req.session.id;
    const pollId = req.params.poll_id;
    let descriptions = [];
    let data = {};
    let scores = [];
    let question = "";
    isCreator(userId, pollId).then((creator) => {
      if (creator) {
        getOptionsByPollId(pollId).then((options) => {
          // get descriptions
          options.forEach((element) => {
            descriptions.push(element.description);
          });
          // get poll question
          question = options[0].question
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
                scores.push(data[description]);
            });

            // vars to use um EJS template
            const templatedVars = {
              descriptions,
              scores,
              question,
              pollId
            };

            res.render("admin_poll", templatedVars);
          });
        })
      } else {
        res.send("You don't have permission to acess this page");
      }
    });


  });

  // send email from admin page to admin
  router.post('/:poll_id/admin', (req, res) => {
    let question = req.body.question;
    let descriptionsOptions = req.body.descriptionsOptions
    let pollId = req.body.pollId
    let emailMsg = "";
    for (let option in descriptionsOptions) {
      emailMsg += "\n" + option + ": " + descriptionsOptions[option] + " points" + "\n"
    }
    getEmailFromPollId(pollId).then((email) => {
      var data = {
        from: 'finest-devs@hotmail.com',
        to: email[0].email,
        subject: `Results to your question: ${question}`,
        text: `The votes are in, here are the final scores to your question: ${question} \n
          ${emailMsg}`
      };
      mailgun.messages().send(data, function (error, body) {
        console.log(body);
      });
    })
  })

  // New poll
  router.get("/new", (req, res) => {
    res.render("new_poll");
  });

  // Render participant page
  router.get("/:poll_id", (req, res) => {

    const pollId = req.params.poll_id;

    // Get polls.question and options for that poll
    knex.select('polls.question', 'options.description', 'options.id', 'options.info')
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
          description: element.description,
          info: element.info
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
    const userId = req.session.id;
    console.log(userId)
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


    res.send('<p style="font-family: Helvetica; font-size: 6vw;">Thank you for voting</p><img src="/images/qsmile.png" width="30%">');
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
      knex.select('options.description', 'polls.question')
        .from('options')
        .where('poll_id', pollId)
        .innerJoin('polls', 'polls.id', 'options.poll_id')
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
          resolve(result);
      });
    });
  }
  // returns email from users by matching pollId
  function getEmailFromPollId (pollId) {
    return new Promise((resolve, reject) => {
      knex.select('users.email')
      .from('users')
      .innerJoin('polls', 'polls.creator_id', 'users.id')
      .where('polls.id', pollId)
      .then((result) => {
        resolve(result);
      });
    });
  }

  return router;
}
