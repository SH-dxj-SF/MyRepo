/**
 * 给定方法失败后保证重试maxRetryCount次
 * async / await写法
 * @param {Function} funcAsync 一个需要执行的异步方法
 * @param {number} [maxRetryCount=3]
 * @param {number} [retryInterval=1000]
 * @returns {Promise}
 */
function retryA(funcAsync, maxRetryCount = 3, retryInterval = 1000) {
  const run = async (max) => {
    try {
      const result = await funcAsync();
      return result;
    } catch (e) {
      if (max) {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(run(max - 1));
          }, retryInterval);
        });
      }
      throw e;
    }
  };

  return run(maxRetryCount);
}

/**
 * 给定方法失败后保证重试maxRetryCount次
 * promise 写法
 * @param {Function} funcAsync 一个需要执行的异步方法
 * @param {number} [maxRetryCount=3]
 * @param {number} [retryInterval=1000]
 * @returns {Promise}
 */
function retryP(funcAsync, maxRetryCount = 3, retryInterval = 1000) {
  const run = (max) => {
    return funcAsync().then(
      (value) => Promise.resolve(value),
      (reason) => {
        if (max) {
          return new Promise((resolve) => {
            setTimeout(() => {
              resolve(run(max - 1));
            }, retryInterval);
          });
        }
        return Promise.reject(reason);
      }
    );
  };

  return run(maxRetryCount);
}

function testFunc() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // resolve(200);
      reject(new Error('errrrrrrrrr'));
    }, 500);
  });
}

module.exports = {
  retryA,
  retryP,
  testFunc,
};
