const isIterable = require('../../isIterable'); // 判断是否可迭代
/**
 * 模拟Promise.race
 * @param {Array<Promise>} promises
 * @returns {Promise}
 */
function promiseRace(promises) {
  if (!isIterable(promises)) {
    return Promise.reject(
      new TypeError(`${typeof promises} ${promises} is not iterable`)
    );
  }

  if (promises.length < 1) {
    // 如果传的迭代是空的，则返回的 promise 将永远等待。
    return new Promise(() => {});
  }

  return new Promise((resolve, reject) => {
    for (const pro of promises) {
      Promise.resolve(pro).then(
        (value) => {
          resolve(value);
        },
        (reason) => {
          reject(reason);
        }
      );
    }
  });
}

module.exports = promiseRace;
