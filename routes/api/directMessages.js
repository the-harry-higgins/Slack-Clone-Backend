const express = require('express');
const router = express.Router();

const { asyncHandler } = require('../utils');
const { authenticated } = require('./auth-utils');
const { Message, User, Channel, ChannelUser } = require('../../db/models');

// Get direct messages and last message for each
router.get('/all/users/:userId/', authenticated, asyncHandler(async (req, res, next) => {
  const channels = await Channel.findAll({
    // where: {
    //   channelTypeId: [3],
    // },
    include: [
      // User,
      {
        model: ChannelUser,
        where: {
          userId: req.params.userId
        }
      },
      {
        model: ChannelType,
        where: {
          type: 'directMessage'
        }
      }
    ],
    order: [['updatedAt', 'DESC']]
  });

  console.log(channels);

  // const messages = await Message.findAll({
  //   where: {
  //     channelId: req.params.id
  //   },
  //   include: [User],
  //   order: [['createdAt', 'DESC']],
  //   limit: 50
  // });

  // const response = {
  //   channels: channels.map(channel => {
  //     return {
  //       id: channel.id,
  //       name: channel.name,
  //       topic: channel.topic,
  //       channelTypeId: channel.channelTypeId,
  //       members: channel.Users.length,
  //     }
  //   })
  // }

  const dummy = [
    {
      id: 1,
    }
  ]

  res.json(channels.length ? channels.toJSON() : dummy);
}));


// Create a direct message channel
router.post('/', authenticated, asyncHandler(async (req, res) => {
  try {
    // console.log('User', req.user);
  
    const { otherUser } = req.body;
  
    const dmChannel = await Channel.build({
      topic: null,
      channelTypeId: 3,
    });
  
    await dmChannel.save();
  
    // console.log('\n\nDM Channel', dmChannel);
  
    const channelUser = ChannelUser.build({
      userId: req.user.id,
      channelId: dmChannel.id
    });
  
    await channelUser.save();
    // console.log('\n\nChannel User', channelUser);
  
    const otherChannelUser = ChannelUser.build({
      userId: otherUser.id,
      channelId: dmChannel.id
    });
  
    await otherChannelUser.save();
    // console.log('\n\nOther Channel User', otherChannelUser);
  
    res.json({
      id: dmChannel.id,
      type: 'directMessage',
      otherUser,
      notification: false,
    });
    
  } catch (e) {
    console.log(e);
  }


}))

module.exports = router;
