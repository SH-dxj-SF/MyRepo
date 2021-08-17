/**
 * 二叉树遍历，调整当前node二次入栈位置即可实现前中后序。
 * @param {TreeNode} root
 * @returns {Number[]}
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

module.exports = postorderTraversal;
