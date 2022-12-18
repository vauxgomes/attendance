module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: `${__dirname}/db/dev.sqlite3`
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: `${__dirname}/src/database/migrations`
    },
    seeds: {
      tableName: 'knex_migrations',
      directory: `${__dirname}/src/database/seeds`
    },
    useNullAsDefault: true
  }
}
