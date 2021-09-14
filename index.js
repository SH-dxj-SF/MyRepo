const debounce = require('./front-end-armoury/debounce');
const throttle = require('./front-end-armoury/throttle');
const cloneDeep = require('./front-end-armoury/cloneDeep');
const eventEmitter = require('./front-end-armoury/eventEmitter');
const { LRU_ES5, LRU_ES6 } = require('./front-end-armoury/least-recently-used');
const {
  postorderTraversal,
  levelTraversal,
  zigzagTraversal,
  // testTree,
} = require('./front-end-armoury/binary-tree');
const {
  find,
  flatFakeR,
  flatFakeI,
  flattenDeepR,
  flattenDeepI,
  mapFake,
  // testArrForFlat,
} = require('./front-end-armoury/array');

// const lru = new LRU_ES5(3);
// console.log(lru);

// const resultPostorder = postorderTraversal(testTree);
// const resultLevel = levelTraversal(testTree);
// const resultZigzag = zigzagTraversal(testTree);
// console.log(resultPostorder, resultLevel, resultZigzag);

// Array.prototype.flattenDeepR = flattenDeepR;
// Array.prototype.flattenDeepI = flattenDeepI;
// const result = testArrForFlat.flattenDeepR();
// const result3 = testArrForFlat.flattenDeepI();
// console.log(result, result3);

module.exports = {
  LRU_ES5,
  LRU_ES6,
  // 二叉树
  postorderTraversal,
  levelTraversal,
  zigzagTraversal,
  // 防抖节流
  debounce,
  throttle,
  // 数组
  find,
  flatFakeR,
  flatFakeI,
  flattenDeepR,
  flattenDeepI,
  mapFake,
  //
  cloneDeep,
  eventEmitter,
};
