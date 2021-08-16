const { LRU_PROTO, LRU_CLS } = require('./front-end-amoury/leastRecentlyUsed');
const {
  postorderTraversal,
  levelTraversal,
  // testTree,
} = require('./front-end-amoury/binaryTree');

// const lru = new LRU_CLS(3);
// console.log(lru);

// const resultPostorder = postorderTraversal(testTree);
// const resultLevel = levelTraversal(testTree);
// console.log(resultPostorder, resultLevel);

module.exports = {
  LRU_PROTO,
  LRU_CLS,
  postorderTraversal,
  levelTraversal,
};
