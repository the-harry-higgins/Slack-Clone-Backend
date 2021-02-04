const express = require('express');
const router = express.Router();

const { asyncHandler } = require('../utils');
const { authenticated } = require('./auth-utils');
const { Channel, ChannelUser } = require('../../db/models');

// Get direct messages and last message for each
router.get('/all/users/:userId/', authenticated, asyncHandler(async (req, res, next) => {
  try {

    const dmChannels = await Channel.findAll({
      where: {
        channelTypeId: 3
      },
      include: [
        {
          model: ChannelUser,
          where: {
            userId: req.params.userId
          }
        },
      ],
      order: [['updatedAt', 'DESC']]
    });

    const directMessagesResponse = await Promise.all(
      dmChannels.map((dmChannel) => {
        return dmChannel.toDirectMessagePreview(req.user.id);
      })
    );

    res.json(directMessagesResponse);

  } catch (e) {
    console.log(e);
  }

}));


// Create a direct message channel
router.post('/', authenticated, asyncHandler(async (req, res) => {
  try {
    const { otherUser } = req.body;

    const dmChannel = await Channel.build({
      topic: null,
      channelTypeId: 3,
    });

    await dmChannel.save();

    const channelUser = ChannelUser.build({
      userId: req.user.id,
      channelId: dmChannel.id
    });

    await channelUser.save();

    const otherChannelUser = ChannelUser.build({
      userId: otherUser.id,
      channelId: dmChannel.id
    });

    await otherChannelUser.save();

    res.json({
      id: dmChannel.id,
      channelTypeId: 3,
      otherUser,
      notification: false,
    });

  } catch (e) {
    console.log(e);
  }

}))

module.exports = router;
