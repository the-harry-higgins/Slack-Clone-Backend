'use strict';
const faker = require('faker');
const bcrypt = require('bcryptjs');
const {randomNumberInRange} = require('./seeder-utils');

function createPassword(password) {
  return bcrypt.hashSync(password);
}

function createUser() {
  return {
    email: faker.internet.email(),
    fullName: faker.name.findName(),
    displayName: faker.name.findName(),
    phoneNumber: faker.phone.phoneNumber(),
    profileImage: faker.image.avatar(),
    themeId: randomNumberInRange(1, 4),
    lightMode: faker.random.boolean(),
    hashedPassword: createPassword(faker.internet.password()),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent()
  }
}

module.exports = {
  up: (queryInterface, Sequelize) => {
    const users = [];
    users.push({ email: 'demouser@demo.com', fullName: 'Demo User', displayName: 'Demo User', phoneNumber: '555-555-5555', profileImage: '', themeId: 1, lightMode: true, hashedPassword: createPassword('password'), createdAt: new Date(), updatedAt: new Date() });
    for (let i = 0; i < 100; i++) {
      const user = createUser();
      users.push(user);
    }
    return queryInterface.bulkInsert('Users', users, {});
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
