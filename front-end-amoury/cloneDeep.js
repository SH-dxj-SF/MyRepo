const getAccurateType = require('./getAccurateType');

function isObject(obj) {
  return obj !== null && typeof obj === 'object';
}

/**
 * 深拷贝（待完善）
 * @param {*} origin
 * @param {*} [cache=new Map()]
 * @returns {*}
 */
function cloneDeep(origin, cache = new Map()) {
  if (!isObject(origin)) {
    // 此处包含了原始数据类型和function
    return origin;
  }

  const accurateType = getAccurateType(origin);
  const ConOfOrigin = Reflect.getPrototypeOf(origin).constructor;

  if (
    accurateType === 'boolean' ||
    accurateType === 'string' ||
    accurateType === 'number' ||
    accurateType === 'error' ||
    accurateType === 'date' ||
    accurateType === 'regexp'
  ) {
    return new ConOfOrigin(origin);
  }

  if (cache.has(origin)) {
    // 缓存，为了处理循环引用问题
    return cache.get(origin);
  }

  // 暂未处理Map、Set...
  const result = accurateType === 'array' ? [] : {};
  cache.set(origin, result);
  for (const key of Object.keys(origin)) {
    result[key] = cloneDeep(origin[key], cache);
  }
  return result;
}

module.exports = cloneDeep;
