
exports.up = function(knex, Promise) {
  return knex.schema.alterTable('options', table => {
    table.string('info').default("");
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('options', table => {
    table.dropColumn('info');
  })
};
