/**
 * 锯齿形（之字形）遍历，第一层从左到右，第二层从右到左，第三层从左到右...
 * 层序遍历基础上反转结果，并非真正意义上的锯齿形遍历
 * @param {TreeNode} root
 * @returns {Number[][]} 二维数组
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

/**
 * 锯齿形（之字形）遍历，第一层从左到右，第二层从右到左，第三层从左到右...
 * 严格意义上的锯齿形遍历，遍历顺序就是结果顺序
 * @param {TreeNode} root
 * @returns {Number[][]} 二维数组
 */
function zigzagTraversalStrict(root) {
  if (!root) {
    return [];
  }
  const result = [];
  let queue = [root];
  let index = 0;

  while (queue.length) {
    const curLevelNodes = queue.concat();
    const ltr = index % 2 === 0;
    queue = [];

    for (let i = 0; i < curLevelNodes.length; ++i) {
      const node = curLevelNodes[i];
      if (node.left) {
        queue.push(node.left);
      }
      if (node.right) {
        queue.push(node.right);
      }
    }

    while (curLevelNodes.length > 0) {
      if (!result[index]) {
        result[index] = [];
      }
      const node = ltr ? curLevelNodes.shift() : curLevelNodes.pop();
      result[index].push(node.value);
    }

    index++;
  }
  return result;
}

module.exports = {
  zigzagTraversal,
  zigzagTraversalStrict,
};
