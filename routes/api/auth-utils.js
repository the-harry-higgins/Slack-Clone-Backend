const bearerToken = require('express-bearer-token');
const jwt = require('jsonwebtoken');

const { jwtConfig: { secret, expiresIn } } = require('../../config');

const { User } = require('../../db/models');


const generateToken = user => {
  return jwt.sign(
      { id: user.id },
      secret,
      // { expiresIn: Number.parseInt(expiresIn) }
      { expiresIn: 60 }
    );
}

function restoreUser(req, res, next) {
  console.log('RESTORING USER');
  const { token } = req;

  if (!token) {
    return next({ status: 401, message: 'no token' });
  }

  return jwt.verify(token, secret, null, async (err, payload) => {
    if (err) {
      err.status = 403;
      return next(err);
    }
    console.log(payload);
    const { id } = payload;
    console.log(id);

    try {
      req.user = await User.findByPk(parseInt(id));
    } catch (e) {
      console.log(e);
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
