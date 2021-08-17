/**
 * 防抖
 * @param {*需要执行的方法} func
 * @param {*执行延迟} interval
 * @returns 防抖处理后的函数
 */
function debounce(func, interval) {
  let timer = null;
  return function (...args) {
    const context = this;
    const params = args;
    // const params = arguments;
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      func.apply(context, params);
    }, interval);
  };
}

module.exports = debounce;
