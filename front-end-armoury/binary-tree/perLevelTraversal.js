/**
 * 分层遍历，每一层的元素放到一个集合中
 * @param {TreeNode} root
 * @returns {Number[][]}
 */
function perLevelTraversal(root) {
  if (!root) {
    return [];
  }

  const result = [];
  const queue = [root];
  let index = 0;

  while (queue.length > 0) {
    let curLevelLength = queue.length;

    while (curLevelLength > 0) {
      if (!result[index]) {
        result[index] = [];
      }

      const curNode = queue.shift();
      result[index].push(curNode.value);

      if (curNode.left) {
        queue.push(curNode.left);
      }
      if (curNode.right) {
        queue.push(curNode.right);
      }

      curLevelLength--;
    }

    index++;
  }

  return result;
}

module.exports = perLevelTraversal;
