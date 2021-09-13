const isIterable = require('../../isIterable');
/**
 * 模拟Promise.any实现，目前认识实验性的，尚未被所有浏览器支持
 * @param {*} promises
 * @returns {Promise}
 */
function promiseAny(promises) {
  if (!isIterable(promises)) {
    return Promise.reject(
      TypeError(`${typeof promises} ${promises} is not iterable`)
    );
  }

  if (promises.length < 1) {
    // 如果传入的是一个空的可迭代对象，返回一个已拒绝的promise
    return Promise.reject(Error('All promises were rejected'));
  }

  return new Promise((resolve, reject) => {
    const length = promises.length;
    let count = 0;

    for (let i = 0; i < length; ++i) {
      Promise.resolve(promises[i]).then(
        (value) => {
          resolve(value);
        },
        () => {
          count++;
          if (count === length) {
            reject(Error('All promises were rejected'));
          }
        }
      );
    }
  });
}

module.exports = promiseAny;
