'use strict';
const faker = require('faker');
const { r, randomNumberInRange, uniqueRandomList } = require('../seeder-utils');

function createChannelUser(userId, channelId) {
  return r({ userId, channelId });
}

function createMessage(userId, channelId) {
  return r({
    userId,
    channelId,
    content: faker.lorem.text(),
    pinned: false,
  });
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const channelusers = [];
    const messages = [];
    for (let userId = 1; userId <= 101; userId++) {
      channelusers.push(createChannelUser(userId, 1));
      const iters = randomNumberInRange(1, 10);
      for (let j = 0; j < iters; j++) {
        messages.push(createMessage(userId, 1));
      };

      const channels = uniqueRandomList(2, 10, 4);
      channels.forEach(channelId => {
        channelusers.push(createChannelUser(userId, channelId));
        const iters = randomNumberInRange(1, 10);
        for (let j = 0; j < iters; j++) {
          messages.push(createMessage(userId, channelId));
        };
      });
    }
    await queryInterface.bulkInsert('ChannelUsers', channelusers, {});
    return await queryInterface.bulkInsert('Messages', messages, {});
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Messages', null, {});
    return queryInterface.bulkDelete('ChannelUsers', null, {});
  }
};
