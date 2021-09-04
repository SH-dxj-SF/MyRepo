const STATUS_PENDING = 'pending';
const STATUS_FULFILLED = 'fulfilled';
const STATUS_REJECTED = 'rejected';

const resolvePromise = (promiseNew, result, resolve, reject) => {
  // 因为result可能是原始值、函数对象、promise，所以不能简单的resolve出去
  // resolvePromise函数判断result和promiseNew的状态，来决定promiseNew是成功还是失败
  if (promiseNew === result) {
    // 如果 promiseNew 和 result 相等，那么 reject promise with a TypeError
    reject(TypeError('Chain cycle'));
  }

  if (
    (result !== null && typeof result === 'object') ||
    typeof result === 'function'
  ) {
    let used = false;
    // 防止then.call中两个回调函数resolvePromiseFunc和rejectPromiseFunc重复调用
    // 规范中指出：如果两个函数都调用了，或者对同一参数进行了多次调用，那么第一个调用优先，任何后续调用将被忽略
    try {
      const then = result.then;
      if (typeof then === 'function') {
        then.call(
          result,
          (v) => {
            // resolvePromiseFunc
            if (used) {
              return;
            }
            used = true;
            // 同理，因为v可能是原始值、函数对象、promise，所以不能简单的resolve，递归处理，直到解析出原始值
            resolvePromise(promiseNew, v, resolve, reject);
          },
          (r) => {
            // rejectPromiseFunc
            if (used) {
              return;
            }
            used = true;
            reject(r);
          }
        );
      } else {
        // 如果 then 不是一个function. fulfill promise with result
        resolve(result);
      }
    } catch (e) {
      reject(e);
    }
  } else {
    // result是一个原始值：如果 resutl 不是一个 object 或者 function，fulfill promise with resutl.
    resolve(result);
  }
};

class PromiseFake {
  constructor(executor) {
    this.status = STATUS_PENDING;
    this.value = undefined;
    this.reason = undefined;
    this.fulfilledCallbacks = [];
    this.rejectedCallbacks = [];

    const resolve = (value) => {
      // 使用箭头函数：保证this为声明时所在父作用域的this，也就是PromiseFake的实例

      if (this.status === STATUS_PENDING) {
        this.status = STATUS_FULFILLED;
        this.value = value;
        // 状态改变，触发成功回调函数
        this.fulfilledCallbacks.forEach((func) => func());
      }
    };

    const reject = (reason) => {
      if (this.status === STATUS_PENDING) {
        this.status = STATUS_REJECTED;
        this.reason = reason;
        this.rejectedCallbacks.forEach((func) => func());
      }
    };

    try {
      // 立即执行executor
      executor(resolve, reject);
    } catch (e) {
      reject(e);
    }
  }

  then(onFulfilled, onRejected) {
    if (typeof onFulfilled !== 'function') {
      // 如果 onFulfilled 不是一个函数，则新promise以前一个promise的值fulfilled
      onFulfilled = (value) => value;
    }
    if (typeof onRejected !== 'function') {
      // 如果 onRejected 不是一个函数，则新promise以前一个promise的reason rejected
      onRejected = (reason) => {
        throw reason;
      };
    }

    const promiseNew = new PromiseFake((resolve, reject) => {
      if (this.status === STATUS_PENDING) {
        // 异步：promise终态尚未确定
        // 先将成功、失败的处理函数存储起来，待终态确定时再进行调用也就是resolve和reject函数中进行调用
        this.fulfilledCallbacks.push(() => {
          queueMicrotask(() => {
            // onFulfilled和onRejected应该是微任务，所以这里使用queueMicrotask
            try {
              const result = onFulfilled(this.value);
              // 因为result可能是原始值、函数对象、promise，所以不能简单的resolve出去
              // resolvePromise函数判断result和promiseNew的状态，来决定promiseNew是成功还是失败
              resolvePromise(promiseNew, result, resolve, reject);
            } catch (e) {
              reject(e);
            }
          });
        });

        this.rejectedCallbacks.push(() => {
          queueMicrotask(() => {
            try {
              const result = onRejected(this.reason);
              resolvePromise(promiseNew, result, resolve, reject);
            } catch (e) {
              reject(e);
            }
          });
        });
      } else if (this.status === STATUS_FULFILLED) {
        // 同步：终态已确定为fulfilled
        queueMicrotask(() => {
          try {
            const result = onFulfilled(this.value);
            resolvePromise(promiseNew, result, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
      } else if (this.status === STATUS_REJECTED) {
        // 同步：终态已确定为rejected
        queueMicrotask(() => {
          try {
            const result = onRejected(this.reason);
            resolvePromise(promiseNew, result, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
      }
    });

    // then方法需返回一个promise
    return promiseNew;
  }
}

module.exports = PromiseFake;
