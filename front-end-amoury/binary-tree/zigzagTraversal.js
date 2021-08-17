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

module.exports = zigzagTraversal;
