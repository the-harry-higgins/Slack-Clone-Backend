'use strict';
const faker = require('faker');
const { r } = require('./seeder-utils');

const PUBLIC = 1;
const PRIVATE = 2;
const DM = 3;

function createChannel(channelType) {
  return r({
    name: faker.random.word(),
    topic: faker.lorem.sentence(),
    channelTypeId: channelType,
  });
}

const createDM = () => r({ channelTypeId: DM });

module.exports = {
  up: (queryInterface, Sequelize) => {
    const channels = [];
    for (let i = 0; i < 10; i++) {
      if (i < 5) {
        channels.push(createChannel(PUBLIC));
      }
      else {
        channels.push(createChannel(PRIVATE));
      }
    }
    return queryInterface.bulkInsert('Channels', channels, {});
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Channels', null, {});
  }
};
