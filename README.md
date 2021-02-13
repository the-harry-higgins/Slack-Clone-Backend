# Slack-Clone-Backend
[MAIN README](https://github.com/the-harry-higgins/Slack-Clone-Frontend/blob/master/README.md)

## Getting started

1. Clone this repository

   ```bash
   git clone https://github.com/the-harry-higgins/Slack-Clone-Backend.git
   ```

2. Install dependencies

      ```bash
      npm install
      ```

3. Create a **.env** file based on the example with proper settings for your
   development environment


4. Create, migrate, and seed your database

   ```bash
   npx dotenv sequelize db:create
   ```

   ```bash
   npx dotenv sequelize db:migrate
   ```

   ```bash
   npx dotenv sequelize db:seed:all
   ```

5. Spin up the server.

   ```bash
   npm start
   ```

## Deploy to Heroku

1. Create a new project on Heroku
2. Under Resources click "Find more add-ons" and add the add on called "Heroku Postgres"
3. Under Settings find "Config Vars" and add any additional/secret .env variables.
4. Install the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-command-line)
5. Login

   ```bash
   heroku login
   ```

6. Push code to Heroku

   ```bash
   git push heroku master
   ```
