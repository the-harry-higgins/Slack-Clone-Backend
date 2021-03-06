const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const { asyncHandler } = require('../utils');
const { authenticated, generateToken } = require('./auth-utils');
const { User, Theme } = require('../../db/models');

const { Op } = require("sequelize");

const displayName =
  check('displayName')
    .exists({ checkFalsy: true })

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


// GET users that match the search term
router.get('/matching/:term/', authenticated, asyncHandler(async (req, res, next) => {

  const users = await User.findAll({
    where: {
      displayName: {
        [Op.iLike]: `${req.params.term}%`
      }
    },
    attributes: ['id', 'email', 'displayName', 'phoneNumber', 'profileImage', 'themeId', 'lightMode', 'createdAt', 'updatedAt'],
    order: [['displayName', 'DESC']],
    limit: 5,
  });

  res.json(users);

}));


// CREATE a new user
router.post('/', [displayName, email, password], asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next({ status: 422, errors: errors.array() });
  }

  const { displayName, email, password } = req.body;

  const user = User.build({
    email,
    displayName,
    lightMode: true,
    themeId: 1,
  });

  user.setPassword(password);

  await user.save();

  const theme = await Theme.findByPk(1);

  const token = generateToken(user);

  res.json({
    token,
    user: user.toSafeObject(),
    theme,
    channels: [],
    directMessages: [],
  });

}))

module.exports = router;