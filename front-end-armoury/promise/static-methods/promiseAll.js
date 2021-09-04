const isIterable = require('../../isIterable'); // 判断是否可迭代
/**
 * 模拟Promise.all
 * @param {Array<Promise>} promises
 * @returns {Promise}
 */
function promiseAll(promises) {
  if (!isIterable(promises)) {
    return Promise.reject(
      new TypeError(`${typeof promises} ${promises} is not iterable`)
    );
  }

  if (promises.length < 1) {
    // 如果传入的参数是一个空的可迭代对象，则返回一个已完成（already resolved）状态的promise。
    return Promise.resolve([]);
  }

  return new Promise((resolve, reject) => {
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
