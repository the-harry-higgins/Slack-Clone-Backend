const { db } = require('.');

module.exports = {
  development: {
    username: db.username,
    password: db.password,
    database: db.database,
    host: db.host,
    dialect: "postgres",
    seederStorage: "sequelize"
  },
  production: {
    use_env_variable: "DATABASE_URL",
    dialect: "postgres",
    seederStorage: "sequelize"
  }
}