const debounce = require('./front-end-amoury/debounce');
const throttle = require('./front-end-amoury/throttle');
const { LRU_ES5, LRU_ES6 } = require('./front-end-amoury/least-recently-used');
const {
  postorderTraversal,
  levelTraversal,
  zigzagTraversal,
  // testTree,
} = require('./front-end-amoury/binary-tree');

// const lru = new LRU_ES5(3);
// console.log(lru);

// const resultPostorder = postorderTraversal(testTree);
// const resultLevel = levelTraversal(testTree);
// const resultZigzag = zigzagTraversal(testTree);
// console.log(resultPostorder, resultLevel, resultZigzag);

module.exports = {
  LRU_ES5,
  LRU_ES6,
  postorderTraversal,
  levelTraversal,
  zigzagTraversal,
  debounce,
  throttle,
};
