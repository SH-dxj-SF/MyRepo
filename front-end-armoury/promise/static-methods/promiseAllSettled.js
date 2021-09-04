const isIterable = require('../../isIterable');
/**
 * 模拟Promise.allSettled方法
 * @param {*} promises
 * @returns {Promise}
 * 返回的promise的值为一个对象数组
 * 对于每个结果对象，都有一个 status 字符串。如果它的值为 fulfilled，则结果对象上存在一个 value 。
 * 如果值为 rejected，则存在一个 reason 。value（或 reason ）反映了每个 promise 决议（或拒绝）的值。
 */
function promiseAllSettled(promises) {
  if (!isIterable(promises)) {
    return Promise.reject(
      TypeError(`${typeof promises} ${promises} is not iterable`)
    );
  }

  return new Promise((resolve) => {
    const length = promises.length;
    const result = [];
    let count = 0;

    const handler = (value, index, status) => {
      result[index] = {
        value,
        status,
      };
      count++;
      if (count === length) {
        resolve(result);
      }
    };

    for (let i = 0; i < length; ++i) {
      Promise.resolve(promises[i]).then(
        (value) => {
          handler(value, i, 'fulfilled');
        },
        (reason) => {
          handler(reason, i, 'rejected');
        }
      );
    }
  });
}

promiseAllSettled(1);
