const router = require('express').Router();

// const routes = ['channels', 'messages', 'search', 'themes', 'users']
const routes = ['auth', 'users', 'channels', 'directMessages']

for (let route of routes) {
  router.use(`/${route}`, require(`./${route}`));
}

module.exports = router;

