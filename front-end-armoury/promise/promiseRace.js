const isIterable = require('../isIterable'); // 判断是否可迭代
const getAccurateType = require('../getAccurateType'); // 返回准确类型

/**
 * 模拟Promise.race
 * @param {Array<Promise>} promises
 * @returns {Promise}
 */
function promiseRace(promises) {
  return new Promise((resolve, reject) => {
    if (!isIterable(promises)) {
      reject(
        new TypeError(`参数类型错误：${getAccurateType(promises)} 不是可迭代的`)
      );
    }

    promises.forEach((pro) => {
      Promise.resolve(pro).then(
        (value) => {
          resolve(value);
        },
        (reason) => {
          reject(reason);
        }
      );
    });
  });
}

module.exports = promiseRace;
