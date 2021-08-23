class EventEmitter {
  constructor() {
    this.events = Object.create(null);
  }

  /**
   * 监听事件
   * @param {string | Array<string>} eventName
   * @param {Function} func
   * @returns {EventEmitter}
   * @memberof EventEmitter
   */
  on(eventName, func) {
    if (Array.isArray(eventName)) {
      // 事件名是数组：监听多个事件
      for (let i = 0, length = eventName.length; i < length; ++i) {
        this.on(eventName[i], func);
      }
    } else {
      if (!this.events[eventName]) {
        this.events[eventName] = [];
      }
      this.events[eventName].push(func);
    }
    return this;
  }

  /**
   * 监听事件（仅执行一次）
   * @param {string} eventName
   * @param {Function} func
   * @returns {EventEmitter}
   * @memberof EventEmitter
   */
  once(eventName, func) {
    const emitter = this;
    function funcClone(...args) {
      emitter.remove(eventName, funcClone);
      func.apply(emitter, args);
    }
    funcClone.funcOrigin = func;
    this.on(eventName, funcClone);
    return this;
  }

  /**
   * 触发事件回调函数
   * @param {string} eventName
   * @param {Array<any>} args
   * @returns {EventEmitter}
   * @memberof EventEmitter
   */
  emit(eventName, ...args) {
    const funcs = this.events[eventName];
    if (funcs) {
      for (let i = 0, length = funcs.length; i < length; ++i) {
        funcs[i].apply(this, args);
      }
    }
    return this;
  }

  /**
   * 移除事件
   * @param {string | Array<string>} eventName
   * @param {Function} func
   * @returns {EventEmitter}
   * @memberof EventEmitter
   */
  remove(eventName, func) {
    if (!eventName) {
      // 未指定事件名：移除所有事件
      this.events = Object.create(null);
      return this;
    }

    if (Array.isArray(eventName)) {
      // 事件名是数组：移除多个事件
      for (let i = 0, length = eventName.length; i < length; ++i) {
        this.remove(eventName[i], func);
      }
      return this;
    }

    // 指定事件名
    const funcs = this.events[eventName];
    if (!funcs) {
      return this;
    }
    if (!func) {
      // 未指定方法：移除该事件下所有方法
      this.events[eventName] = null;
      return this;
    }

    // 移除指定方法
    for (let i = funcs.length - 1; i >= 0; --i) {
      const fn = funcs[i];
      if (fn === func || fn.funcOrigin === func) {
        funcs.splice(i, 1);
        break;
      }
    }
    return this;
  }
}

module.exports = EventEmitter;
