/**
 * 模拟Array.prototype.map方法
 * @param {*} func
 * @param {*} context
 */
function mapFake(func, context) {
  const origin = this;
  const result = new Array(origin.length);
  for (let i = 0; i < origin.length; ++i) {
    if (Object.prototype.hasOwnProperty.call(origin, i)) {
      // 保留empty，不做处理
      result[i] = func.call(context, origin[i], i, origin);
    }
  }
  return result;
}

module.exports = mapFake;
