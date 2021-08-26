/**
 * 深度提取（完全铺平）数组
 * 递归写法
 * @returns {array} // 提取后的数组
 */
function flattenDeepR() {
  const origin = this;
  const result = [];
  origin.forEach((item) => {
    if (Array.isArray(item)) {
      item = item.flattenDeepR();
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
 * 深度提取（完全铺平）数组
 * 迭代写法
 * @returns {array} // 提取后的数组
 */
function flattenDeepI() {
  const origin = this;
  let result = origin;
  let again = true; // 标记是否还需再深一层提取。即此次提取过程中，是否又碰到数组，无则代表无需再迭代。初始化为true，保证提取至少一次

  while (again) {
    again = false;
    const temp = [];
    result.forEach((item) => {
      if (Array.isArray(item)) {
        item.forEach((itemInner) => {
          temp.push(itemInner);
        });
        again = true;
      } else {
        temp.push(item);
      }
    });
    result = temp;
  }

  return result;
}

module.exports = {
  flattenDeepR,
  flattenDeepI,
};
