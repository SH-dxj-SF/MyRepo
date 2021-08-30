# Promise

Promise 对象用于表示一个异步操作的最终完成（或失败）及其结果值。

一个 Promise 对象代表一个在这个 promise 被创建出来时不一定已知的值。他让你能够把异步操作最终的成功返回值或失败原因和处理程序关联起来。这使得异步方法可以和同步方法一样返回值：异步方法并不会立即返回最终的值，而是返回一个 promise，以便在未来某个时候将值交给使用者。

一个 Promise 必然处于以下几个状态之一：

- 待定（pending）：初始状态，既没有被兑现，也没有被拒绝
- 已兑现（fulfilled）：意味着操作成功完成
- 已拒绝（rejected）：意味着操作失败

待定状态的 Promise 对象要么会通过一个值被兑现（fulfilled），要么会通过一个原因（错误）被拒绝（rejected）。当这些情况之一发生时，我们用的 promise 的 then 方法排列起来的相关处理程序就会被调用。如果 promise 在一个相应的处理程序被绑定时就已经被兑现或者拒绝了，那么这个处理程序就会被调用，因此在完成异步操作和绑定处理方法之间不会存在竞争状态。

并且因为 Promise.prototype.then 和 Promise.prototype.catch 方法返回的是 promise，所以它们可以被链式调用。

![promiseChainCall](https://raw.githubusercontent.com/SH-dxj-SF/MyRepo/master/images/promiseChainCall.png)

<font color="#b6cbef">
注意: 如果一个 promise 已经被兑现（fulfilled）或被拒绝（rejected），那么我们也可以说它处于已敲定（settled）状态。您还会听到一个经常跟 promise 一起使用的术语：已决议（resolved），它表示 promise 已经处于已敲定(settled)状态，或者为了匹配另一个 promise 的状态被"锁定"了。
</font>

## Promise 的链式调用

我们可以用 promise.then()、promise.catch()和 promise.finally()将进一步的操作与一个变为已敲定状态的 promise 关联起来。这些方法还会返回一个新的 promise 对象。这个对象可以被非强制性的用来做链式调用，就像这样：

```js
const myPromise = new Promise(myExecutorFunc)
  .then(handleFulfilledA, handleRejectedA)
  .then(handleFulfilledB, handleRejectedB)
  .then(handleFulfilledC, handleRejectedC);

// 或者，这样可能会更好...

const myPromise = new Promise(myExecutorFunc)
  .then(handleFulfilledA)
  .then(handleFulfilledB)
  .then(handleFulfilledC)
  .catch(handleRejectedAny); // .catch() 其实只是没有给 handleFulfilled 预留参数位置的 .then() 而已。
```

过早地处理被拒绝的 promise 会对之后 promise 的链式调用造成影响。不过有时候我们需要马上处理一个错误也只能这样做。另一个方面，在没有迫切需要的情况下，可以在最后一个.catch（）语句时在进行错误处理，这种做法更加简单。

这两个函数的签名很简单，它们只接受一个任意类型的参数。这些函数由你（编程者）编写，这些函数的终止状态决定着链式调用下一个 promise 的“已敲定”（settled）状态是什么。任何不是 throw 的终止都会创建一个“已决议（resolved）”状态，而以 throw 终止则会创建一个“已拒绝”状态。

```js
handleFulfilled(value)       { /*...*/; return nextValue;  }
handleRejection(reason)  { /*...*/; throw  nextReason; }
handleRejection(reason)  { /*...*/; return nextValue;  }
```

被返回的 nextValue 可能是另一个 promise 对象，这种情况下这个 promise 对象会被动态地插入链式调用。也就是说后一个处理函数会等待该 promise 对象的状态发生变化，才被调用。

当.then()中缺少能够返回 promise 对象的函数时，链式调用就直接进行下一环操作。因此，链式调用可以在最后一个.catch()之前把所有 handleRejection 都省略掉。类似的.catch()其实只是没有给 handleFulfilled 参数的.then()而已。

一个 promise 对象可能会参与不止一次的嵌套，下例中，promiseA 向“已敲定（settled）”状态的过渡会导致两个实例的.then()都被调用。

```js
const promiseA = new Promise(myExecutorFunc);
const promiseB = promiseA.then(handleFulfilled1, handleRejected1);
const promiseC = promiseA.then(handleFulfilled2, handleRejected2);
```

一个已经处于“已敲定”状态的 promise 也可以接受操作。在那种情况下（如果没有问题的话），这个操作会被作为第一个异步操作被执行。注意，所有的 promise 都一定是异步的。因此，一个处于“已敲定”状态的 promise 中的操作只有 promise 链式调用的栈被清空了和一个事件循环过去了之后才会被执行。

```js
let promise1 = new Promise((resolve, reject) => {
  console.log('logging1');
  resolve(1);
});
// 这时promise已经敲定了
promise1.then((value) => console.log('settled', value));
console.log('logging3');
// produces output in this order
// logging1
// logging3
// settled 1
```

我们再看一个和没有立马敲定的例子：

```js
let promise1 = new Promise((resolve, reject) => {
  console.log('logging1');
  setTimeout(() => {
    console.log('logging2');
    resolve(1);
  }, 1000);
}).then((value) => {
  console.log('unsettled', value);
  return value * 2;
});
promise1.then((value) => console.log('settled', value));
console.log('logging3');
// produces output in this order
// logging1
// logging3
// ...等待至少1000ms
// logging2
// unsettled 1
// settled 2
```

## 构造函数

Promise(),创建一个新的 promise 对象，主要用于包装还未支持 promise 的函数。

注意 ⚠️：构造函数的参数 executor 中的 resolve 和 reject 函数执行了以后，executor 中在这两个函数的之后的语句还是会执行，但是 resolve 后的 throw error 会被忽略。（所以一般建议加 return），就像下边这样：

```js
// ...
resolve(someValue);
return;

// ...
reject(someReason);
return;
```

## 静态方法

1. Promise.all(iterable)

   返回一个新的 promise 对象，该 promise 对象在 iterable 参数对象里的所有 promise 对象都成功的时候才会出发成功。一旦有任何一个 iterable 里边的 promise 对象失败则立即触发该 promise 对象的失败。这个新 promise 对象在触发成功状态后，会把一个包含所有 iterable 里所有 promise 返回值的数组作为成功回调的返回值，顺序和 iterable 顺序一致；如果触发了失败状态，它会把 iterable 里第一个触发失败的 promise 对象的错误信息作为它的失败错误信息。该方法常用于处理多个 promise 对象的状态集合。

2. Promise.allSettled(iterable)

   等到所有 promises 都已敲定（settled）（每一个 promise 都已兑现（fulfilled）或者已拒绝（rejected））。返回一个 promise，该 promise 在所有 promise 都完成后完成。并带有一个对象数组，每个对象对应每一个 promise 的结果。

3. Promise.any(iterable)

   接受一个 promise 对象集合，当其中的一个 promise 成功，就返回那个成功的 promise 的值。

4. Promise.race(iterable)

   当 iterable 参数里的任意一个子 promise 成功或失败后，父 promise 立马也会用子 promise 的成功返回或者失败详情作为参数调用父 promise 绑定的响应具柄。并返回该 promise。

5. Promise.reject(reason)

   返回一个状态为失败的 promise 对象，并将给定的失败信息传递给对应的处理方法。

6. Promise.resolve(value)

   返回一个由给定 value 决定的 promise 对象。如果该值是 thenable（即，带 then 方法的对象），返回 promise 的最终状态由 then 方法执行决定；否则的话（该 value 为空、基本类型或着不带 then 方法的对象），返回 promise 对象的状态为 fulfilled，并且将该 value 传递给对应的 then 方法。通常而言，如果你不知道一个 value 是否为 promise 对象，使用 Promise.resolve(value)来返回一个 promise 对象，这样就能将该 value 以 promise 对象形式使用了。

## 原型方法（实例方法）

1.  Promise.prototype.then(onFulfilled, onRejected)

    then 方法一个 promise，最多需要两个参数，即 promise 成功和失败情况的回调函数。

    ### 参数

    - onFulfilled：promise 变成接受（fulfilled）状态时调用的函数。有一个参数，即接受的最终结果。如果该参数不是函数，则会在内部被替换为 (x) => x，即原样返回最终结果的函数。

    - onRejected：promise 变成拒绝（rejected）状态时调用的函数。有一个参数，即拒绝的原因。如果该参数不是函数，则会在内部被替换为一个“Thrower“函数（用拒绝原因作为参数抛出一个错误）。

    ### 返回值

    当一个 promise 完成（fulfilled、resolved）或者失败（rejected）时，各自的处理函数（onFulfilled、onRejected）将会被异步调用（在当前线程循环中调度）。处理函数的行为遵循一组特定的规则，如果一个处理函数：

    - 返回一个值，那么 then 方法返回一个接受（resolved）状态的 promise，且 promise 的值为这个返回值。
    - 不返回任何东西，那么 then 方法返回一个接受（resolved）状态的 promise，且 promise 的值为 undefined。
    - 抛出一个错误（error），那么 then 方法返回一个失败（rejected）状态的 promise，且 promise 的值为这个抛出的错误。
    - 返回一个接受（resolved）状态的 promise，那么 then 方法返回一个接受（resolved）状态的 promise，且 promise 的值为“那个”（处理函数返回的）promise 的值。
    - 返回一个拒绝（rejected）状态的 promise，那么 then 方法返回个拒绝（rejected）状态的 promise，且 promise 的值为“那个”（处理函数返回的）promise 的值。
    - 返回一个未定（pending）状态的 promise，那么 then 方法返回一个未定（pending）状态的 promise，且 promise 的终态和值与“那个”（处理函数返回）promise 的一致。

    <font color="#b6cbef">
    注意 ⚠️：如果忽略针对某个状态的回调函数参数，或者提供了非函数（nonfunction）参数。那么 then 方法将会丢失关于该状态的回调函数信息，但并不会产生错误。如果调用 then 的 promise 的状态（fulfillment 或者 rejection）发生改变，但是 then 中并没有关于这种状态的回调函数，那么 then 将返回一个没有经过回调函数处理的新 Promise 对象，这个新 promise 只是简单地接受调用这个 then 方法的原 promise 的终态作为它的终态。
    </font>

我们看一个 then 方法异步性的例子：

```js
// 使用一个完成状态的promise，then方法块将会被立即触发
// 但是通过console.log打印出的信息，我们可以发现处理函数十倍异步执行的
const resolvedProm = Promise.resolve(11);

let thenProm = resolvedProm.then((value) => {
  console.log('主栈结束后调用该方法，接受到的参数和返回值为：', value);
  return value;
});

// 立即打印thenProm
console.log('立即', thenProm);

// 使用setTimeout我们可以将打印操作延迟到主栈空了以后
setTimeout(() => {
  console.log('延迟', thenProm);
});

// 上述代码会返回：
// 立即 Promise {[[PromiseStatus]]: "pending", [[PromiseValue]]: undefined}
// "主栈结束后调用该方法，接受到的参数和返回值为: 11"
// 延迟 Promise {[[PromiseStatus]]: "resolved", [[PromiseValue]]: 11}
```

2. Promise.prototype.catch(onRejected)

   catch 方法返回一个 promise，并且只处理失败情况。它的行为就像调用 Promise.prototype.then(undefined, onRejected)。事实上调用 obj.catch(onRejected)内部就是调用的 obj.then(undefined, onRejected)。这意味着你必须得提供一个错误处理函数 onRejected，即使你想把返回值回退到 undefined。就像这样：obj.catch(() => {})

   ### 参数

   - onRejected：promise 变成拒绝（rejected）状态时调用的函数。有一个参数，即拒绝的原因。

   ### 返回值

   catch 方法返回一个 promise，且如果处理函数抛出一个错误或者返回一个本身是失败状态的 promise 那么 promise 的状态为失败（rejected），其他情况 promise 状态为完成（resolved）。

   ### 示例

   捕获抛出的错误：异步函数中抛出的错误不会被 catch 捕获，并且 resolve 后抛出的错误将会被忽略

   ```js
    // 抛出一个错误，大多数时候将调用catch方法
    var{ p1 = new Promise(function(resolve, reject) {
      throw 'Uh-oh!';
    });

    p1.catch(function(e) {
      console.log(e); // "Uh-oh!"
    });

    // 在异步函数中抛出的错误不会被catch捕获到
    var p2 = new Promise(function(resolve, reject) {
      setTimeout(function() {
        throw 'Uncaught Exception!';
      }, 1000);
    });

    p2.catch(function(e) {
      console.log(e); // 不会执行
    });

    // 在resolve()后面抛出的错误会被忽略
    var p3 = new Promise(function(resolve, reject) {
      resolve();
      throw 'Silenced Exception!';
    });

    p3.catch(function(e) {
      console.log(e); // 不会执行
    });}
   ```

3. Promise.prototype.finally(onFinally)

   当一个 promise 状态被敲定（settled）时执行处理函数，无论是完成（fulfilled）还是拒绝（rejected）。finally 方法返回一个 promise。这提供了一种无论是成功完成还是被拒绝，只要是 promise 被处理后就执行相应代码的方式。

   这可以帮助我们避免在 then 方法和 catch 方法中写重复的代码。

   ### 参数

   - onFinally：promise 结束后调用的函数，该函数无任何参数。

   ### 返回值

   返回一个 promise

   ### 描述

   虽然.finally()和.then(onFinally, onFinally)类似，但是它们有一些不同：

   - 创建内联函数时，只需要传递一次。而不是被迫声明两次或者为其创建一个变量。
   - finally 的处理函数不接收任何参数，因为我们无法知道 promise 的最终状态是完成（fulfilled、resolved）还是拒绝（rejected）。而且这正好就是我们不需要关心他的失败原因或者成功返回值的场景，所以这里不需要提供参数。我们看下例：
     - Promise.resolve(2).then(() => {}, () => {})会返回完成状态的 promise，值为 undefined；而 Promise.resolve(2).finally(() => {})也会返回完成状态的 promise，但是值为 2
     - Promise.reject(3).then(() => {}, () => {})会返回成功状态的 promise，值为 undefined；而 Promise.reject(3).finally(() => {})则会返回失败状态的 promise，且值为 3

    <font color="#b6cbef">
    注意：如果在finally的处理函数中抛出一个错误或者返回了一个失败状态的promise，那么finally方法新返回的promsie将会以抛出错误的原因被reject。
    </font>

## 创建 Promise

promise 对象由 new 关键字及其构造函数来创建。该构造函数会把一个叫做“处理器函数”（executor function）的函数作为它的参数。这个处理器函数接受两个函数（resolve 和 reject）作为其参数。当异步任务顺利完成并返回结果时，回调用 resolve 函数；而当异步任务失败且返回失败原因（通常是一个错误对象）时，会调用 reject 函数。

```js
const myProm = new Promise((resolve, reject) => {
  // 做一些异步操作，最终调用resolve或者reject
  // ...
  resolve(someValue); // fulfilled
  // 或者
  reject('someReason'); // rejected
});
```

想要某个函数拥有 promise 功能，只需让其返回一个 promise 即可：

```js
function myAsyncFunc(url) {
  return new Promise(() => {
    const xhr = new XMLHttpRequest();
    xhr.open('get', url);
    xhr.onload = () => resolve(xhr.responseTexgt);
    xhr.onerror = () => reject(xhr.statusText);
    xhr.send();
  });
}
```

## Promise 相关方法实现

### Promise.all()

参数接收一个 promise 的 iterable 类型（Array，Map，Set 都属于 ES6 的 iterable 类型）。返回一个新的 promise 实例。

```js
const isIterable = require('../isIterable'); // 判断是否可迭代
const getAccurateType = require('../getAccurateType'); // 返回准确类型

/**
 * 模拟Promise.all
 * @param {Array<Promise>} promises
 * @returns {Promise}
 */
function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    if (!isIterable(promises)) {
      reject(
        new TypeError(`参数类型错误：${getAccurateType(promises)} 不是可迭代的`)
      );
    }

    const length = promises.length;
    const result = new Array(length);
    let count = 0;

    for (let i = 0; i < length; ++i) {
      Promise.resolve(promises[i]).then(
        (value) => {
          result[i] = value;
          count++;
          if (count === length) {
            resolve(result);
          }
        },
        (reason) => {
          reject(reason);
        }
      );
    }
  });
}
```

### Promise.race()

参数同样是接收一个 promise 的 iterable 类型（Array，Map，Set 都属于 ES6 的 iterable 类型）。返回一个新的 promise 实例。

```js
const isIterable = require('../isIterable'); // 判断是否可迭代
const getAccurateType = require('../getAccurateType'); // 返回准确类型

/**
 * 模拟Promise.race
 * @param {Array<Promise>} promises
 * @returns {Promise}
 */
function promiseRace(promises) {
  return new Promise((resolve, reject) => {
    if (!isIterable(promises)) {
      reject(
        new TypeError(`参数类型错误：${getAccurateType(promises)} 不是可迭代的`)
      );
    }

    promises.forEach((pro) => {
      Promise.resolve(pro).then(
        (value) => {
          resolve(value);
        },
        (reason) => {
          reject(reason);
        }
      );
    });
  });
}
```
