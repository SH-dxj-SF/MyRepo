/**
 * 二叉树遍历，调整当前node二次入栈位置即可实现前中后序。
 * @param {TreeNode} root
 * @returns Array
 */
function postorderTraversal(root) {
  // 后续遍历
  if (!root) {
    return root;
  }
  const stack = [root];
  const result = [];

  while (stack.length) {
    let cur = stack.pop();
    if (cur) {
      stack.push(cur);
      stack.push(null);
      if (cur.right) {
        stack.push(cur.right);
      }
      if (cur.left) {
        stack.push(cur.left);
      }
    } else {
      cur = stack.pop();
      result.push(cur.value);
    }
  }
  return result;
}

/**
 * 层级遍历
 * @param {TreeNode} root
 * @returns Array
 */
function levelTraversal(root) {
  if (!root) {
    return root;
  }
  const queue = [root];
  const result = [];
  while (queue.length) {
    const cur = queue.shift();
    result.push(cur.value);
    if (cur.left) {
      queue.push(cur.left);
    }
    if (cur.right) {
      queue.push(cur.right);
    }
  }
  return result;
}

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
  postorderTraversal,
  levelTraversal,
  testTree,
};
