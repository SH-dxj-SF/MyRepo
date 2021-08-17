// least recently used
// 原型写法
/**
 * 最近最少使用缓存策略
 * @param {Number} size 缓存数量
 */
function LRU(size) {
  this.cache = new Map();
  this.size = size;
}

LRU.prototype.set = function (key, value) {
  const { cache, size } = this;
  if (cache.has(key)) {
    cache.delete(key);
  } else if (size === cache.size) {
    cache.delete(cache.keys().next().value);
  }
  cache.set(key, value);
};

LRU.prototype.get = function (key) {
  const { cache } = this;
  if (cache.has(key)) {
    const value = cache.get(key);
    cache.delete(key);
    cache.set(key, value);
    return value;
  }
  return undefined;
};

module.exports = LRU;
