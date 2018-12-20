
exports.up = function(knex, Promise) {
 	return createUsersTable()
 		.then(createPollsTable)
 		.then(createOptionsTable)
 		.then(createUsersChoicesTable)

 	function createUsersTable() {
	 	return knex.schema.createTable('users', function(table) {
	 		table.increments();
	 		table.string('email')
	 		table.string('name')
	 	})
	 }

	 function createPollsTable () {
	 	return knex.schema.createTable('polls', function(table) {
	 		table.increments();
	 		table.string('question')
	 		table.integer('type')

	 		table.integer('creator_id').references('id').inTable('users')
	 	})
	 }

	 function createOptionsTable() {
	 	return knex.schema.createTable('options', function(table) {
	 		table.increments()
	 		table.string('description')

	 		table.integer('poll_id').references('id').inTable('polls')
	 	})
	 }

	 function createUsersChoicesTable () {
	 	return knex.schema.createTable('users_choices', function(table) {
	 		table.integer('user_id').references('id').inTable('users')
	 		table.integer('option_id').references('id').inTable('options')
	 		table.integer('rank')
	 	})
	 }
};

exports.down = function(knex, Promise) {
  return knex.schema
  	.dropTable(users_choices)
  	.dropTable(options)
  	.dropTable(polls)
  	.dropTable(users)
};
