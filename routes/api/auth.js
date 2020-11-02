const express = require('express');
const { check, validationResult } = require('express-validator');

const { asyncHandler, getUserThemeAndChannels } = require('../utils');
const { authenticated, generateToken } = require('./auth-utils');

const router = express.Router();

const email =
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail();

const password =
  check('password')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a password');

// LOGIN from form
router.put('/', [email, password], asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next({ status: 422, errors: errors.array() });
  }

  const { email, password } = req.body;

  const user = await getUserThemeAndChannels(req, null, email);

  if (!user || !user.isValidPassword(password)) {
    const err = new Error('Login failed');
    err.status = 401;
    err.title = 'Login failed';
    err.errors = ['Invalid credentials'];
    return next(err);
  }

  const token = generateToken(user);
  const response = {
    token,
    user: user.toSafeObject(),
    theme: user.Theme.toJSON(),
    channels: user.Channels.map(channel => {
      return {
        id: channel.id,
        name: channel.name,
        topic: channel.topic,
        type: channel.ChannelType.type,
        notification: false
      }
    })
  }
  
  res.json(response);
}));

// LOGIN when token exists in localstorage
router.get('/currentuser', authenticated, asyncHandler(async (req, res, next) => {
  const response = {
    user: req.user.toSafeObject(),
    theme: req.user.Theme.toJSON(),
    channels: req.user.Channels.map(channel => {
      return {
        id: channel.id,
        name: channel.name,
        topic: channel.topic,
        type: channel.ChannelType.type,
        notification: false
      }
    })
  }
  res.json(response);
}));

module.exports = router;