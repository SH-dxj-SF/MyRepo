// least recently used

// 原型写法
function LRU_PROTO(size) {
  this.cache = new Map();
  this.size = size;
}

LRU_PROTO.prototype.set = function (key, value) {
  const { cache, size } = this;
  if (cache.has(key)) {
    cache.delete(key);
  } else if (size === cache.size) {
    cache.delete(cache.keys().next().value);
  }
  cache.set(key, value);
};

LRU_PROTO.prototype.get = function (key) {
  const { cache } = this;
  if (cache.has(key)) {
    const value = cache.get(key);
    cache.delete(key);
    cache.set(key, value);
    return value;
  }
  return undefined;
};

// class写法
class LRU_CLASS {
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

module.exports = {
  LRU_PROTO,
  LRU_CLASS,
};
