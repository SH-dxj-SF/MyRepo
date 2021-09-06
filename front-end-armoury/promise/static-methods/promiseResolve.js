/**
 * 模拟Promise.resolve实现
 * @param {*} value
 * @returns {Promise}
 */
function promiseResolve(value) {
  if (value instanceof Promise) {
    return value;
  }

  return new Promise((resolve, reject) => {
    if (value && value.then && typeof value.then === 'function') {
      queueMicrotask(() => {
        try {
          value.then(resolve, reject);
        } catch (e) {
          reject(e);
        }
      });
    } else {
      resolve(value);
    }
  });
}

module.exports = promiseResolve;
