/**
 * 提取对象属性
 * @param {*} obj
 * @param {*} path 提取路径，例如：a.b.c；a[b][c]；[a].b[c]
 * @param {*} defaultValue 找不到时默认返回的值
 * @returns 查找到的值或者defaultValue
 */
function getValue(obj, path, defaultValue) {
  path = path.replace(/\[(\w+)\]/g, '.$1');
  path = path.replace(/^\./, '');
  const pathArr = path.split('.');
  let temp = obj;

  for (let i = 0; i < pathArr.length; ++i) {
    if (temp && Object.prototype.hasOwnProperty.call(temp, pathArr[i])) {
      temp = temp[pathArr[i]];
    } else {
      return defaultValue;
    }
  }

  return temp || defaultValue;
}

const testObj = {
  a: {
    name: 'a',
    b: {
      name: 'b',
      c: {
        name: 'c',
      },
    },
  },
  d: [
    1,
    2,
    {
      name: '3 of d',
    },
  ],
};

module.exports = {
  testObj,
  getValue,
};
