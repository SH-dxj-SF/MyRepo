const postorderTraversal = require('./postorderTraversal');
const levelTraversal = require('./levelTraversal');
const zigzagTraversal = require('./zigzagTraversal');

const testTree = {
  value: 1,
  left: {
    value: 2,
    left: {
      value: 4,
    },
    right: {
      value: 5,
    },
  },
  right: {
    value: 3,
    left: {
      value: 6,
    },
    right: {
      value: 7,
    },
  },
};

module.exports = {
  testTree,
  postorderTraversal,
  levelTraversal,
  zigzagTraversal,
};
