// least recently used
// class写法
class LRU {
  constructor(size) {
    this.cache = new Map();
    this.size = size;
  }

  set(key, value) {
    const { cache, size } = this;
    if (cache.has(key)) {
      cache.delete(key);
    } else if (size === cache.size) {
      cache.delete(cache.keys().next().value);
    }
    cache.set(key, value);
  }

  get(key) {
    const { cache } = this;
    if (cache.has(key)) {
      const value = cache.get(key);
      cache.delete(key);
      cache.set(key, value);
      return value;
    }
    return undefined;
  }
}

module.exports = LRU;
