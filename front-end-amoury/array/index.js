const find = require('./find');
const { flatFakeR, flatFakeI } = require('./flatFake');
const { flattenDeepR, flattenDeepI } = require('./flattenDeep');
const mapFake = require('./mapFake');

const testArrForFlat = [1, [2, undefined, [3, 4, [5, 6]], 7], 8, 9];

module.exports = {
  testArrForFlat,
  find,
  flatFakeR,
  flatFakeI,
  flattenDeepR,
  flattenDeepI,
  mapFake,
};
