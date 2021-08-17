/**
 * 层级遍历，每一层依次访问
 * @param {TreeNode} root
 * @returns {Number[]}
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

module.exports = levelTraversal;
