/**
 * 模拟setTimeout实现
 * @param {*} func
 * @param {*} interval
 * @param {*} args
 * @returns {object}
 */
function setIimeoutFake(func, interval, ...args) {
  const start = Date.now();
  let stopFlag = false;

  const loop = () => {
    if (!stopFlag) {
      if (Date.now() - start >= interval) {
        func.apply(this, args);
      } else if (typeof window === 'undefined') {
        // 注意与interval差别，只有未执行过才会继续loop

        // 非浏览器环境，例如node
        setImmediate(loop); // 一般为：几万次/s
      } else {
        // 浏览器环境
        requestAnimationFrame(loop); // 频率和浏览器刷新频率一致，一般为：60次/s
      }
    }
  };

  const stop = () => {
    stopFlag = true;
  };

  loop();
  return {
    stop,
  };
}

module.exports = {
  setIimeoutFake,
};
