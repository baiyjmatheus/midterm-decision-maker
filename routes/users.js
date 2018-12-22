"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {
	router.post('/', (req, res) => {
		let email = req.body.$email;
		let name = req.body.$username;
		knex.select('email', 'id')
			.from('users')
			.where('email', email)
			.then((rows) => {
				// console.log(rows)
				if (rows.length === 0) {
					knex('users')
					.returning('id')
					.insert({email: email, name: name})
					.then((newId) => {
						console.log(newId);
						req.session.id = newId[0];
						res.send("done");
					});
				} else {
					console.log("already exists");
					// console.log(rows[0].id)
					req.session.id = rows[0].id;
					// console.log(req.session.id)
					res.send("done");
				}

			})
			.catch((err) => {
				console.log(err)
			})
		})

	return router;
}
