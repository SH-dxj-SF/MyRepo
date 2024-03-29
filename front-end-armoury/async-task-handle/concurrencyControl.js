/**
 * 实现一个异步任务处理函数，n代表可以同时发起的任务数
 * 所有任务完成后把处理结果按顺序放在数组里返回
 * @param {Array} asyncTasks
 * @param {Number} n
 * @returns {Promise}
 */
function concurrencyControl(asyncTasks, n) {
  return new Promise((resolve) => {
    const length = asyncTasks.length;
    const result = new Array(length).fill('placeholder');
    let count = 0;

    const run = () => {
      const index = count++;

      if (index >= length) {
        if (!result.includes('placeholder')) {
          resolve(result);
        }
        return;
      }

      const curTask = asyncTasks[index];

      Promise.resolve(curTask())
        .then(
          (value) => {
            result[index] = {
              value,
              status: 'fulfilled',
            };
          },
          (reason) => {
            result[index] = {
              reason,
              status: 'rejected',
            };
          }
        )
        .finally(() => {
          if (index < length) {
            run();
          }
        });
    };

    // 并发数量控制
    while (count < n) {
      run();
    }
  });
}

module.exports = concurrencyControl;
