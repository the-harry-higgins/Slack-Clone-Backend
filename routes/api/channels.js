const express = require('express');
const router = express.Router();

const { asyncHandler } = require('../utils');
const { authenticated } = require('./auth-utils');
const { Message, User } = require('../../db/models');

router.get('/:id/messages', authenticated, asyncHandler(async(req, res, next) => {
  const messages = await Message.findAll({
    where: {
      channelId: req.params.id
    },
    include: [ User ],
    order: [['createdAt']]
  });
  const response = {
    messages: messages.map(message => {
      return { 
        id: message.id,
        channelId: message.channelId,
        content: message.content,
        pinned: message.pinned,
        createdAt: message.createdAt,
        userId: message.userId, 
        displayName: message.User.displayName,
        profileImage: message.User.profileImage
      }
    })
  }
  res.json(response);
}));

module.exports = router;
