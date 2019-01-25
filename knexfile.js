// Update with your config settings.

module.exports = {
  development: {
    client: "sqlite3",
    connection: { filename: "./database/auth.sqlite3" }, // change this if you want a different name for the database

    migrations: {
      directory: "./database/migrations",
      tableName: "dbmigrations"
    },
    useNullAsDefault: true, // used to avoid warning on console
    seeds: { directory: "./database/seeds" }
  }
};
