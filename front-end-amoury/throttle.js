/**
 * 节流
 * @param {*Function} func // 需要执行的函数
 * @param {*Number} interval // 函数执行的间隔
 * @param {*Object} options // leading：开始立即执行一次，trailing：最后至少执行一次
 * @returns 节流处理后的函数
 */
function throttle(func, interval, options = { leading: true }) {
  let timer = null;
  let pre = 0;

  return function (...args) {
    const context = this;
    const params = args;

    if (pre === 0 && !options.leading) {
      pre = Date.now();
    }
    const remaining = interval - (Date.now() - pre);
    if (remaining <= 0 || remaining > interval) {
      pre = Date.now();
      func.apply(context, params);
    } else if (options.trailing) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        pre = Date.now();
        func.apply(context, args);
      }, remaining);
    }
  };
}

module.exports = throttle;
