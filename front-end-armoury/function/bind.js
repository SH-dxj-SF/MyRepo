/* eslint-disable prefer-rest-params */

/**
 * bind
 * @param {Function} func
 * @param {*} context
 * @returns {Function}
 */
function bind(func, context) {
  const slice = Array.prototype.slice;
  const args = slice.call(arguments, 2);

  return function () {
    const argsFinal = args.concat(slice.call(arguments));
    return func.apply(context, argsFinal);
  };
}

/**
 * 模拟Function.prototype.bind
 * @returns
 */
function bindFake() {
  const funcOrigin = this;
  const slice = Array.prototype.slice;
  const thisArg = arguments[0];
  const args = slice.call(arguments, 1);

  if (typeof funcOrigin !== 'function') {
    throw new TypeError('正在绑定一个不可调用的值');
  }

  return function () {
    const argsFinal = args.concat(slice.call(arguments));
    return funcOrigin.apply(thisArg, argsFinal);
  };
}

/**
 *
 * const unboundSlice = Array.prototype.slice;
 * const slice = Function.prototype.call.bind(unboundSlice)
 * ...
 * const args = slice(arguments, 2);
 *
 * >>>等价于>>>
 *
 * const slice = Array.prototype.slice;
 * ...
 * const args = slice(arguments, 2);
 */

module.exports = {
  bind,
  bindFake,
};
