/**
 * 模拟Promise.prototype.catch
 * @param {*} onRejected
 * @returns {Promise}
 */
function promisePrototypeCatch(onRejected) {
  return this.then(undefined, onRejected);
}

/**
 * 模拟Promise.prototype.finally
 * @param {*} onFinally
 * @returns {Promise}
 */
function promisePrototypeFinally(onFinally) {
  return this.then(
    (value) => {
      Promise.resolve(onFinally()).then(() => {
        return value;
      });
    },
    (reason) => {
      Promise.resolve(onFinally()).then(() => {
        throw reason;
      });
    }
  );
}

// Promise.prototype.catch = promisePrototypeCatch;
// Promise.prototype.finally = promisePrototypeFinally;

module.exports = {
  promisePrototypeCatch,
  promisePrototypeFinally,
};
