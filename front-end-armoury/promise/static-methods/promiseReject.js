/**
 * 模拟Promise.reject实现
 * @param {*} reason
 * @returns
 */
function promiseReject(reason) {
  return new Promise((resolve, reject) => {
    reject(reason);
  });
}

module.export = promiseReject;
