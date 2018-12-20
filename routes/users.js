"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {
	router.post('/', (req, res) => {
		let email = req.body.$email;
		let name = req.body.$username;
		knex.from('users')
			.select('email', 'id')
			.where('email', email)
			.then((rows) => {
				console.log(rows);
				if (rows.length === 0) {
					knex('users').insert({email: email, name: name});
					req.session.id = rows.id;
				} else {
					console.log("already exists");
					req.session.id = rows.id;
				}
				res.send("done");
			})
			.catch((err) => {
				console.log(err)
			})
		})

	return router;
}
