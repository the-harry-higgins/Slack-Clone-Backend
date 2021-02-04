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


const buildResponse = async (user) => {
  const channels = [];
  const directMessages = [];
  user.Channels.forEach(channel => {
    if (channel.ChannelType.type === 'directmessage') {
      directMessages.push(channel);
    } else {
      channels.push(channel);
    }
  });

  const directMessagesResponse = await Promise.all(
    directMessages.map((dmChannel) => {
      // console.log(dmChannel)
      return dmChannel.toDirectMessage(user.id);
    })
  );

  const response = {
    user: user.toSafeObject(),
    theme: user.Theme.toJSON(),
    channels: user.Channels.map(channel => {
      return {
        id: channel.id,
        name: channel.name,
        topic: channel.topic,
        type: channel.ChannelType.type,
        notification: false,
      }
    }),
    directMessages: directMessagesResponse,
  }

  return response;
}

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
  const response = await buildResponse(user);
  response['token'] = token;

  res.json(response);
}));

// LOGIN when token exists in localstorage
router.get('/currentuser', authenticated, asyncHandler(async (req, res, next) => {

  const response = await buildResponse(req.user);

  res.json(response);
}));

module.exports = router;