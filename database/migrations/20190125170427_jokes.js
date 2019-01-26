exports.up = function(knex) {
  return knex.schema.createTable("jokes", users => {
    users.increments();

    users
      .string("joke", 128)
      .notNullable()
      .unique();
    users.string("punchline", 128).notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("jokes");
};
