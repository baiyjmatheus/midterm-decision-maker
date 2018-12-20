
// exports.seed = function(knex, Promise) {
//   // Deletes ALL existing entries
//   return knex('table_name').del()
//     .then(function () {
//       return Promise.all([
//         // Inserts seed entries
//         knex('table_name').insert({id: 1, colName: 'rowValue1'}),
//         knex('table_name').insert({id: 2, colName: 'rowValue2'}),
//         knex('table_name').insert({id: 3, colName: 'rowValue3'})
//       ]);
//     });
// };


exports.seed = function(knex, Promise) {

  function deleteUsersChoices() {
    return knex('users_choices').del()
  }

  function deleteOptions() {
    return knex('options').del()
  }

  function deletePolls() {
    return knex('polls').del()
  }

  function deleteUsers() {
    return knex('users').del()
  }

  function insertUsers() {
    return knex('users').insert([
      {email: 'test1@test.com', name: 'test1'},
      {email: 'test2@test.com', name: 'test2'},
      {email: 'test3@test.com', name: 'test3'},
      {email: 'test4@test.com', name: 'test4'},
      {email: 'test5@test.com', name: 'test5'},
      {email: 'test6@test.com', name: 'test6'},
    ]).returning('*');
  }

  function insertPolls() {
    return knex('polls').insert([
      {question: 'Where should we go for lunch?', type: '1', creator_id: '1'},
      {question: 'What video game should we play?', type: '1', creator_id: '2'}
    ]).returning('*');
  }

  function insertOptions() {
    return knex('options').insert([
      {description: 'mcds', poll_id: '1'},
      {description: 'burger king', poll_id: '1'},
      {description: 'fat bastards', poll_id: '1'},
      {description: 'pizza nova', poll_id: '1'},
      {description: 'popeyes', poll_id: '1'},
      {description: 'league of legends', poll_id: '2'},
      {description: 'overwatch', poll_id: '2'},
      {description: 'rdr2', poll_id: '2'},
      {description: 'smash bros', poll_id: '2'},
      {description: 'minecraft', poll_id: '2'}
    ]).returning('*');
  }

  function insertUsersChoices() {
    return knex('users_choices').insert([
      {user_id: '2', option_id: '1', rank: '1'},
      {user_id: '2', option_id: '2', rank: '2'},
      {user_id: '2', option_id: '3', rank: '3'},
      {user_id: '2', option_id: '4', rank: '4'},
      {user_id: '2', option_id: '5', rank: '5'},

      {user_id: '3', option_id: '1', rank: '5'},
      {user_id: '3', option_id: '2', rank: '4'},
      {user_id: '3', option_id: '3', rank: '3'},
      {user_id: '3', option_id: '4', rank: '2'},
      {user_id: '3', option_id: '5', rank: '1'},

      {user_id: '4', option_id: '1', rank: '3'},
      {user_id: '4', option_id: '2', rank: '2'},
      {user_id: '4', option_id: '3', rank: '5'},
      {user_id: '4', option_id: '4', rank: '1'},
      {user_id: '4', option_id: '5', rank: '4'},

      {user_id: '5', option_id: '1', rank: '4'},
      {user_id: '5', option_id: '2', rank: '2'},
      {user_id: '5', option_id: '3', rank: '5'},
      {user_id: '5', option_id: '4', rank: '3'},
      {user_id: '5', option_id: '5', rank: '1'},

      {user_id: '1', option_id: '6', rank: '2'},
      {user_id: '1', option_id: '7', rank: '1'},
      {user_id: '1', option_id: '8', rank: '3'},
      {user_id: '1', option_id: '9', rank: '5'},
      {user_id: '1', option_id: '10', rank: '4'},

      {user_id: '3', option_id: '6', rank: '1'},
      {user_id: '3', option_id: '7', rank: '5'},
      {user_id: '3', option_id: '8', rank: '2'},
      {user_id: '3', option_id: '9', rank: '3'},
      {user_id: '3', option_id: '10', rank: '4'},

      {user_id: '5', option_id: '6', rank: '4'},
      {user_id: '5', option_id: '7', rank: '1'},
      {user_id: '5', option_id: '8', rank: '2'},
      {user_id: '5', option_id: '9', rank: '3'},
      {user_id: '5', option_id: '10', rank: '5'},

      {user_id: '6', option_id: '6', rank: '5'},
      {user_id: '6', option_id: '7', rank: '2'},
      {user_id: '6', option_id: '8', rank: '1'},
      {user_id: '6', option_id: '9', rank: '4'},
      {user_id: '6', option_id: '10', rank: '3'},
    ]).returning('*')
  }

  return deleteUsersChoices()
    .then(deleteOptions)
    .then(deletePolls)
    .then(deleteUsers)
    .then(insertUsers)
    .then(insertPolls)
    .then(insertOptions)
    .then(insertUsersChoices)
};

