// 实现数组的一个查询方法(find)，并且find后可以实现where和orderBy的链式调用。

/**
 * 数组查询方法，重点在于扩展原型方法，where和orderBy以实现链式调用（chain call）
 * @param {*} [arr=[]]
 * @returns
 */
function find(arr = []) {
  return arr;
}

function where(key, pattern) {
  return this.filter((item) => pattern.test(item[key]));
}

function orderBy(key, type) {
  const result = this.concat();
  if (type === 'desc') {
    result.sort((a, b) => b[key] - a[key]);
  } else if (type === 'asce') {
    result.sort((a, b) => a[key] - b[key]);
  }
  return result;
}

// 扩展数组原型
Array.prototype.where = where;
Array.prototype.orderBy = orderBy;

module.exports = find;
