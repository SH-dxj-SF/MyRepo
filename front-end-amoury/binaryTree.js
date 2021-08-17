/**
 * 二叉树遍历，调整当前node二次入栈位置即可实现前中后序。
 * @param {TreeNode} root
 * @returns Array
 */
function postorderTraversal(root) {
  // 后续遍历
  if (!root) {
    return [];
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
 * 层级遍历，每一层依次访问
 * @param {TreeNode} root
 * @returns Array
 */
function levelTraversal(root) {
  if (!root) {
    return [];
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

/**
 * 锯齿形（之字形）遍历，第一层从左到右，第二层从右到左，第三层从左到右...
 * @param {TreeNode} root
 * @returns {number[][]}二维数组
 */
function zigzagTraversal(root) {
  if (!root) {
    return [];
  }
  const result = [];
  const queue = [];
  queue.push({ depth: 0, node: root });

  while (queue.length) {
    const { depth, node } = queue.shift();
    if (result[depth]) {
      if (depth % 2 === 0) {
        // 左 => 右
        result[depth].push(node.value);
      } else {
        // 右 => 左
        result[depth].unshift(node.value);
      }
    } else {
      result[depth] = [node.value];
    }
    if (node.left) {
      queue.push({ depth: depth + 1, node: node.left });
    }
    if (node.right) {
      queue.push({ depth: depth + 1, node: node.right });
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
  zigzagTraversal,
  testTree,
};
