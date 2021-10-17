/**
 * 模拟提取（铺平）数组方法（Array.prototype.flat）
 * 递归写法
 * @param {number} [depth=1] // 提取深度，默认为1
 * @returns {array}
 */
function flatFakeR(depth = 1) {
  const origin = this;
  const result = [];

  origin.forEach((item) => {
    // forEach用于忽略empty
    if (Array.isArray(item)) {
      if (depth > 1) {
        item = item.flatFakeR(depth - 1);
      }
      item.forEach((itemInner) => {
        result.push(itemInner);
      });
    } else {
      result.push(item);
    }
  });
  return result;
}

/**
 * 模拟提取（铺平）数组方法（Array.prototype.flat）
 * 迭代写法
 * @param {number} [depth=1] // 提取深度，默认为1
 * @returns {array}
 */
function flatFakeI(depth = 1) {
  const origin = this;
  let result = origin;
  let again = true;

  while (depth-- && again) {
    const temp = [];
    again = false;
    result.forEach((item) => {
      if (Array.isArray(item)) {
        again = true;
        item.forEach((itemInner) => {
          temp.push(itemInner);
        });
      } else {
        temp.push(item);
      }
    });
    result = temp;
  }
  return result;
}

module.exports = {
  flatFakeR,
  flatFakeI,
};
