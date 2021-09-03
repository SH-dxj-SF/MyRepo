/**
 * 模拟Array.prototype.reduce
 * @param {Function} callback
 * @param {Array} args
 * @returns {*}
 */
function reduceFake(callback, ...args) {
  if (this === null || typeof this === 'undefined') {
    throw new TypeError('Array.prototype.reduce called on null or undefined');
  }

  if (typeof callback !== 'function') {
    throw new TypeError(`${callback} is not a function`);
  }

  const origin = Object(this); // 实例对象
  const length = origin.length >>> 0; // 长度，可处理origin.length不存在，不是数字等情况

  let index = 0;
  let result;

  // 初始化result
  if (args.length > 0) {
    // 传入了initialValue参数
    result = args[0];
  } else {
    // 取数组实例的第一个元素作为初始值
    while (!(index in origin) && index < length) {
      index++;
    }

    if (index >= length) {
      throw new TypeError('Reduce of empty array with no initial value');
    }

    result = origin[index++]; // 注意将索引 + 1
  }

  while (index < length) {
    if (index in origin) {
      result = callback(result, origin[index], index, origin);
    }
    index++;
  }

  return result;
}

// 使用时需扩展数组原型，使用defineProperty定义的属性默认是不可枚举的
// Object.defineProperty(Array.prototype, 'reduceFake', {
//   value: reduceFake,
// });

module.exports = reduceFake;
