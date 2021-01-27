const express = require('express');
const router = express.Router();

const { asyncHandler } = require('../utils');
const { authenticated } = require('./auth-utils');
const { Message, User, Channel } = require('../../db/models');

router.get('/:id/messages', authenticated, asyncHandler(async(req, res, next) => {
  const messages = await Message.findAll({
    where: {
      channelId: req.params.id
    },
    include: [ User ],
    order: [['createdAt', 'DESC']],
    limit: 50
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
    }).reverse()
  }
  res.json(response);
}));


router.get('/', authenticated, asyncHandler(async(req, res, next) => {
  console.log('Entered function');
  const channels = await Channel.findAll({
    // where: {
    //   channelTypeId: 1
    // },
    order: ['name']
  });

  const response = {
    channels: channels.map(channel => {
      return {
        id: channel.id,
        name: channel.name,
        topic: channel.topic,
        channelTypeId: channel.channelTypeId
      }
    })
  }

  res.json(response);
}));



module.exports = router;
