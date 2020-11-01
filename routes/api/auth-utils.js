const bearerToken = require('express-bearer-token');
const jwt = require('jsonwebtoken');

const { jwtConfig: { secret, expiresIn } } = require('../../config');
const { getUserThemeAndChannels } = require('../utils');


const generateToken = user => {
  return jwt.sign(
    { id: user.id },
    secret,
    { expiresIn: Number.parseInt(expiresIn) }
  );
}

function restoreUser(req, res, next) {
  const { token } = req;

  if (!token) {
    return next({ status: 401, message: 'no token' });
  }

  return jwt.verify(token, secret, null, async (err, payload) => {
    if (err) {
      err.status = 403;
      return next(err);
    }
    const { id } = payload;

    try {
      req.user = await getUserThemeAndChannels(req, parseInt(id));
    } catch (e) {
      return next(e);
    }

    if (!req.user) {
      return next({ status: 404, message: 'session not found' });
    }

    next();
  });
}

const authenticated = [bearerToken(), restoreUser];

module.exports = { generateToken, authenticated };
