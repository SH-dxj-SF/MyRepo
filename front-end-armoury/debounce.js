/**
 * 防抖
 * @param {Funcntion} func 需要执行的方法
 * @param {Number} interval 执行延迟
 * @returns {Function} 防抖处理后的函数
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
