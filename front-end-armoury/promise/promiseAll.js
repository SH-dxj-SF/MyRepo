const isIterable = require('../isIterable'); // 判断是否可迭代
const getAccurateType = require('../getAccurateType'); // 返回准确类型

/**
 * 模拟Promise.all
 * @param {Array<Promise>} promises
 * @returns {Promise}
 */
function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    if (!isIterable(promises)) {
      reject(
        new TypeError(`参数类型错误：${getAccurateType(promises)} 不是可迭代的`)
      );
    }

    const length = promises.length;
    const result = new Array(length);
    let count = 0;

    for (let i = 0; i < length; ++i) {
      Promise.resolve(promises[i]).then(
        (value) => {
          result[i] = value;
          count++;
          if (count === length) {
            resolve(result);
          }
        },
        (reason) => {
          reject(reason);
        }
      );
    }
  });
}

module.exports = promiseAll;
