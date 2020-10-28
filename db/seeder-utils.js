const faker = require('faker');

function r(o) {
  o.createdAt = faker.date.past();
  o.updatedAt = faker.date.past();
  return o;
}

function randomNumberInRange(min, max) {
  return Math.round(Math.random() * (max - min)) + min;
}

function uniqueRandomList(min, max, length) {
  if (length > max - min) throw new Error('Not enough unique numbers in range.');
  let i = 0;
  let list = [];
  while (i < length) {
    let num = randomNumberInRange(min, max);
    if (list.includes(num)) continue;
    list.push(num);
    i++;
  }
  return list;
}

module.exports = {
  r,
  randomNumberInRange,
  uniqueRandomList
}