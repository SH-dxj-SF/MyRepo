/**
 * 获取准确类型
 * @param {*} obj 需要判断的对象（广义）
 * @returns {string} 准确类型
 */
function getAccurateType(obj) {
  const temp = Object.prototype.toString.call(obj);
  return temp.match(/\[object (\w+)\]/)[1].toLowerCase();
}

module.exports = getAccurateType;
