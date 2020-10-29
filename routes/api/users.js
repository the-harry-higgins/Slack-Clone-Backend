const express = require('express');
const router = express.Router();

const { User } = require('../../db/models');
const { asyncHandler } = require('../utils');

router.get('/', asyncHandler(async(req, res, next) => {
  const users = await User.findAll({
    attributes: ['id', 'email', 'fullName', 'displayName', 'phoneNumber', 'profileImage', 'themeId', 'lightMode', 'createdAt', 'updatedAt']
  });
  res.json(users);
}));

router.get('/:id', asyncHandler(async (req, res, next) => {
  const user = await User.findByPk(req.params.id, {
    attributes: ['id', 'email', 'fullName', 'displayName', 'phoneNumber', 'profileImage', 'themeId', 'lightMode', 'createdAt', 'updatedAt']
  });
  res.json(user);
}));

module.exports = router;
