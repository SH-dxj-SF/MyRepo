/**
 * 模拟setInterval实现
 * @param {*} func
 * @param {*} interval
 * @param {*} args
 * @returns {object}
 */
function setIntervalFake(func, interval, ...args) {
  let pre = Date.now();
  let stopFlag = false;

  const loop = () => {
    if (!stopFlag) {
      if (Date.now() - pre >= interval) {
        pre = Date.now();
        func.apply(this, args);
      }
      // 注意与timeout区别，除非手动stop否则一直loop
      if (typeof window === 'undefined') {
        // 非浏览器环境，例如node
        setImmediate(loop);
      } else {
        // 浏览器环境
        requestAnimationFrame(loop);
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

module.exports = setIntervalFake;
