"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

	router.post('/', (req, res) => {
		// var test = knex('users')
		// 	.select('email')
		// 	.where('')

		// 	.then((result) => {
		// 		console.log(result)
		// 	})


		// console.log(test)
		console.log(req.body)

		knex('users')
			.insert({email: "ethena@ethena.com", name: 'ethena'})
			.then(function(result) {
				console.log(result)
			})
			.finally(() => {
				knex.destroy()
			})

		})

	return router;
}

		// $(".submitbutton").on("click", function() {
		// 	var $username = $(".username")
		// 	var $email = $(".email")
		// 	$.ajax({
		// 		url: '/users',
		// 		type: 'POST',
		// 		body: {
		// 			$username: username,
		// 			$email: email
		// 		},
		// 	success: function() {			
		// 	}
		// })

//   router.get("/", (req, res) => {
//     knex
//       .select("*")
//       .from("users")
//       .then((results) => {
//         res.json(results);
//     });
//   });

//   return router;
// }
