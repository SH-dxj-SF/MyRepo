/**
 * 模拟new操作符
 * 即解释new主要干了什么：
 * 1 使用构造函数生成一个新的对象
 * 2 以新生成的对象为上下文执行构造函数
 * 3 如果构造函数返回了一个对象那么返回该对象，否则返回新生成的这个对象
 * @param {Function} con
 * @param {Array<any>} args
 * @returns {Object}
 */
function newOpt(con, ...args) {
  // const obj = Object.create(con.prototype);
  const obj = Reflect.construct(con, args);

  const result = con.apply(obj, args);
  return result instanceof Object ? result : obj;
}

module.exports = newOpt;
