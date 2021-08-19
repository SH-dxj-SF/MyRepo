/**
 * 判断对象是否部署了迭代器，即是否可迭代（for of 遍历）
 * @param {*} obj
 * @returns {boolean}
 */
function isIterable(obj) {
  if (typeof obj === 'undefined') {
    return false;
  }
  return obj !== null && typeof obj[Symbol.iterator] === 'function';
}

module.exports = isIterable;
