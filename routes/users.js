"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

	router.post('/', (req, res) => {
		let email = req.body.email;
		let name = req.body.username;
		knex.from('users')
			.select('email')
			.where('email', email)
			.then((rows) => {
				if (rows.length === 0) {
					return knex('users').insert({email: email, name: name});
				} else {
					console.log("already exists");
				}
				res.send("test")
			})
			.catch((err) => {
				console.log(err)
			})
		})

	return router;
}
