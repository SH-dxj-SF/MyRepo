const { LRU_PROTO, LRU_CLS } = require('./front-end-amoury/leastRecentlyUsed');
const {
  postorderTraversal,
  levelTraversal,
  zigzagTraversal,
  testTree,
} = require('./front-end-amoury/binaryTree');

const lru = new LRU_CLS(3);
console.log(lru);

const resultPostorder = postorderTraversal(testTree);
const resultLevel = levelTraversal(testTree);
const resultZigzag = zigzagTraversal(testTree);
console.log(resultPostorder, resultLevel, resultZigzag);

module.exports = {
  LRU_PROTO,
  LRU_CLS,
  postorderTraversal,
  levelTraversal,
  zigzagTraversal,
};
