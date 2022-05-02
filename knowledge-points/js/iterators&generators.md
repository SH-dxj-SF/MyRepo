# 迭代协议

迭代协议具体分为：可迭代协议、迭代器协议

## 可迭代协议

该协议允许 JS 对象定义或制定它们的迭代行为。例如：for…of 中哪些值可以被遍历到。一些内置类型同时是内置可迭代对象，并且有默认的迭代行为，目前有：String、Array、TypedArray、Map、Set；而其他一些则不是，比如 Object。

要成为**可迭代**对象，一个对象必须实现@@iterator 方法。意味着该对象或者其原型链上的某个对象必须有一个键为@@iterator 的属性。可通过常量 Symbol.iterator 访问该属性：

[Symbol.iterator]：一个无参数函数，返回一个符合**迭代器协议**的对象。
当一个对象要被迭代的时候，比如被置入一个 for…of 循环中，首先会不带参数的调用它的@@iterator 函数，然后使用该方法返回的迭代器（对象）获得要迭代的值。

此函数可以是普通函数，也可以是生成器函数，以便在调用时返回**迭代器**对象。在这个生成器函数中，每个条目可以通过 yield 来提供。

## 迭代器协议

**迭代器协议**定义了产生一系列值（无论有限个还是无限个）的标准方式。当值为有限个时，所有的值被迭代完毕后，会返回一个默认返回值。

只有实现了拥有以下语义（semantic）的 **next** 方法，一个对象才能成为迭代器（对象）：

### next

一个函数，可以传入一个参数或者不传参数。如果传入了一个参数，那么这个参数在 next 方法被调用时可用。

返回一个对象（应当有 done 和 value 属性），如果返回了一个非对象值（比如 false，undefined），将会抛出 TypeError 异常。返回的对象，拥有两个属性：

1. done：布尔值，如果迭代器可以产生序列中的下一个值，为 false（相当于没有指定 done 属性）；
   如果迭代器已将序列迭代完毕，则为 true，此时 value 值可选，如果它依然存在则为迭代器的默认返回值。
2. value：迭代器返回的任何 JS 值，done 为 true 时可省略。

注意 ⚠️：我们不可能知道一个特定的对象是否实现了迭代器协议，然而创建一个同时满足**可迭代协议**和**迭代器协议**的对象是很容易的。就像下例一样：

```js
const myIterator = {
  next: function () {
    // ...
  },
  [Symbol.iterator]: function () {
    return this;
  },
};
```

这样做允许一个迭代器能被各种需要可迭代对象的语法所使用。因此，很少会只实现迭代器协议，而不实现可迭代协议。

# 迭代器&生成器

处理集合中的每一个项，是很常见的操作。JS 提供了很多迭代集合的方法，从简单的 for 循环到 map、filter。迭代器和生成器将这迭代的概念直接代入核心语言，并提供一种机制来自定义 for…of 循环的行为。

## 迭代器（Iterator）

在 JS 中，迭代器是一个对象，它定义一个序列，并在终止时可能返回一个返回值。更具体地说，迭代器是通过 next 方法实现的**迭代器协议（Iterator Protocol）** 的任何一个对象。next 方法返回一个具有 value 和 done 属性的对象。

一旦创建，迭代器可以通过重复调用 next 方法显示地迭代，迭代一个迭代器被称为消耗了这个迭代器，因为它通常只能被执行一次。在产生终止值后，对 next 方法的额外调用应该继续返回{done: true}
示例：

我们看一个例子，创建一个简单的范围迭代器，它定义了从开始 start（包含）到结束 end（不包含），间隔 step 相同的整数序列。最终返回值是序列的大小，由 iterationCount 追踪。

```js
function makeRangeIterator(start = 0, end = Infinity, step = 1) {
  let nextIndex = start;
  let iterationCount = 0;

  const rangeIterator = {
    next: function () {
      let result;
      if (nextIndex < end) {
        result = {
          value: nextIndex,
          done: false,
        };
        nextIndex += step;
        iterationCount++;
        return result;
      }
      return {
        value: iterationCount,
        done: true,
      };
    },
  };
  return rangeIterator;
}
```

使用这个迭代器：

```js
let it = makeRangeIterator(1, 10, 2);
let result = it.next();
while (!result.done) {
  console.log(result.value); // 依次输出 1 3 5 7 9
  result = it.next();
}

console.log('size', result.value); // size 5
```

虽然自定义迭代器是一个有用的工具，但由于需要显示地维护其内部状态，因此需要谨慎地创建。生成器函数提供了一个强大的选择：它允许你定义一个包含自有迭代算法的函数。同时它可以自己维护自己的状态。

## 生成器函数（Generator functions）

我们可以使用 function\*这种方式（function 关键字后跟一个星号\*），定义一个生成器函数（generator function），**生成器函数不可作为构造函数**。最初调用时，生成器函数不执行任何代码，而是返回一种称为生成器对象（Generator）的迭代器。通过调用生成器的 next 方法消耗值时，Generator 函数将执行，直到遇到 yield 关键字。

生成器对象符合**可迭代协议**和**迭代器协议**。

生成器函数可以根据需要多次调用，每次都会返回一个新的 Generator，但是每一个 Generator 只能迭代一次。

调整上边的例子，我们可以发现虽然代码行为相同，但是使用生成器函数会变得更加容易编写和阅读。

```js
function* makeRangeIterator(start = 0, end = Infinity, step = 1) {
  let iteratorCount = 0;
  for (let i = start; i < end; i += step) {
    iteratorCount++;
    yield i;
  }
  return iteratorCount;
}
```

生成器函数在执行时能暂停，后面又可以从暂停处继续执行。

调用**生成器函数**并不会马上执行它里边的语句，而是返回一个迭代器对象。当这个迭代器的 next 方法被首次（后续）调用时，其内部语句会执行到首个（后续）出现 yield 表达式的位置为止。yield 后紧跟迭代器要返回的值。或者如果用 yield\*（跟一个星号\*），则表示将执行权交个另一个生成器函数（当前生成器暂停执行）。

next 方法返回一个对象（包含 value 和 done 属性），value 表示本次 yield 表达式的返回值。done 属性（布尔值）表示生成器后续是否还有 yield 语句，即生成器函数是否执行完毕并返回。

调用 next 方法恢复生成器函数执行时，如果传入了参数，那么参数会替换上一条执行的 yield 语句：

```js
function* logGeneratorFunc() {
  console.log(0);
  console.log(1, yield);
  console.log(2, yield);
  console.log(3, yield);
}

var gen = logGeneratorFunc();

//第一个next方法调用从生成器函数的开始执行知道第一个yiled 语句
gen.next(); // 0
gen.next('pretzel'); // 1 pretzel
gen.next('california'); // 2 california
gen.next('mayonnaise'); // 3 mayonnaise

// ----------------------------------------

function* generatorFunc(n) {
  yield n;
  x = yield 'x';
  yield x + 1;
}
const gen = generatorFunc(10);
console.log(gen.next().value); // 10，从生成器函数的开始执行到yiled n，返回10
console.log(gen.next().value); // ‘x’，执行到 yield ‘x’，返回‘x’，但是此处赋值不会继续执行
console.log(gen.next(100).value); // 101，yield ‘x’赋值给x，执行到yield x + 1，因为next方法传入了参数100，所以yiled ‘x’被替换为100，所以x为100，返回101
```

当在生成器函数中显示 return 时，会导致生成器函数立即变为完成状态。即调用 next 方法返回的对象的 done 属性为 true。如果 return 后跟了个值，那么这个值为作为当前调用 next 返回对象的 value。

```js
function* generator(n) {
  yield n;
  yield n + 1;
  return n + 2;
  yield n + 3;
}
const gen = generator(10);
console.log(gen.next().value); // 10
console.log(gen.next().value); // 11
console.log(gen.next().value); // 12
console.log(gen.next().value); // undefined
```

### 示例

基础示例

```js
function* idMaker() {
  let index = 0;
  while (true) {
    index++;
  }
}

let generator = idMaker();
console.log(generator.next().value); // 0
console.log(generator.next().value); // 1
console.log(generator.next().value); // 2
console.log(generator.next().value); // 3
// ...
```

使用 yield\* 的示例

```js
function* generatorElse(n) {
  yield n + 1;
  yield n + 2;
}

function* generator(n) {
  yield n;
  yield* generatorElse(n);
  yield n + 10;
}

const gen = generator(10);
console.log(gen.next().value); // 10
console.log(gen.next().value); // 11
console.log(gen.next().value); // 12
console.log(gen.next().value); // 20
```

yield\* 多维数组一维遍历

```js
function* iterArray(arr) {
  if (Array.isArray(arr)) {
    for (let i = 0; i < arr.length; ++i) {
      yield* iterArray(arr[i]);
    }
  } else {
    yield arr;
  }
}
const arr = [1, [2, 3, [4, 5], 6, 7], 8, 9];
for (const num of iterArray(arr)) {
  console.log(num); // 依次输出 1 到 9
}
console.log(...iterArray(arr)); // 1 2 3 4 5 6 7 8 9;
console.log([...iterArray(arr)]); //[1 2 3 4 5 6 7 8 9];
```

生成器函数中的 return 语句

```js
function* generatorFuncAndReturn {
  yield 'A';
  return 'B';
  yield 'unreachable'; // 不会被执行到
}
let gen = generatorFuncAndReturn();
console.log(gen.next()); // { value: "A", done: false }
console.log(gen.next()); // { value: "B", done: true }
console.log(gen.next()); // { value: undefined, done: true }
```

生成器函数作为对象的属性

```js
const obj = {
  *generatorFunc() {
    yield 'A';
    yield 'B';
  },
};

let gen = obj.generatorFunc();
console.log(gen.next()); // {value: "A", done: false}
console.log(gen.next()); // {value: "B", done: false}
console.log(gen.next()); // {value: undefined, done: true}
```

生成器函数作为一个类的方法

```js
class Test {
  *generatorFunc() {
    yield 1;
    yield 2;
    yield 3;
  }
}

const t = new Test();
const gen = t.generatorFunc();
console.log(gen.next()); // { value: 1, done: false }
console.log(gen.next()); // { value: 2, done: false }
console.log(gen.next()); // { value: 3, done: false }
console.log(gen.next()); // { value: undefined, done: true }
```

## yield

yield 关键字可以暂停和恢复生成器函数。

### 语法

```js
[rv] = yield[expression];
```

expression（可选）：定义要通过迭代器协议从生成器函数返回的值，如果省略了，则返回 undefined。

rv（可选）：返回传递给生成器的 next 方法的可选值，next 方法用于恢复生成器函数的执行。

### 描述

yield 关键字使生成器函数执行暂停，yield 关键字后的表达式的值返回给生成器的调用者。它可以被认为是一个基于生成器版本的 return 关键字。

yield 关键字实际返回一个 IteratorResult 对象，包含两个属性（value，done），value 时对表达式求值的结果，done 表示生成器函数是否完全完成。

一旦遇到 yield 表达式，生成器函数的代码将被暂停执行，直到生成器的 next 方法被调用。每次调用生成器的 next 方法时，生成器都会恢复执行，直到达到以下某个值：

- yield，导致生成器再次暂停并返回生成器的新值。下次调用 next 时，在 yield 后紧接着的语句继续执行。
- throw 用于从生成器中抛出异常。这让生成器完全停止执行，并在调用者中继续执行，就像正常情况下跑出异常一样。
- 到达生成器函数的结尾。这种情况下，生成器执行结束，并且 IteratorResult 给调用者返回 value 为 undefined 且 done 为 true
- 到达 return 语句。这种情况下，生成器执行结束，并且 IteratorResult 给调用者返回 value 由 return 语句指定且 done 为 true

如果将参数传递给生成器的 next 方法，那么参数会作为当前 （上一个）yield 操作的返回值。**yield 表达式本身无返回值。**

生成器处理异步操作的例子：

```js
function getUserCallback(userID, callback) {
  // 模拟异步操作，回调方式
  setTimeout(() => {
    callback({
      id: userID,
      name: 'userName' + userID,
    });
  }, 1000);
}

function getUserPromise(userID) {
  // 模拟异步操作，promise 方式
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: userID,
        name: 'userName' + userID,
      });
    }, 1000);
  });
}

function thunk(func) {
  // 回调方式时使用
  return function (...args) {
    return function (callback) {
      return func.call(this, ...args, callback);
    };
  };
}

const getUserCallbackThunk = thunk(getUserCallback);

function* someAsyncOpt(id) {
  // 生成器函数，返回一个生成器（实现了可迭代协议和迭代器协议）

  const user1 = yield getUserPromise(id);
  const user2 = yield getUserPromise(user1.id + 1);
  const user3 = yield getUserPromise(user2.id + 1);
  const user4 = yield getUserCallbackThunk(user3.id + 1);
  const user5 = yield getUserCallbackThunk(user4.id + 1);
  const user6 = yield getUserCallbackThunk(user5.id + 1);

  console.log(user6); // { id: 9532, name: userName9532 }
}

function run(funcGen, ...argsInitial) {
  const generator = funcGen(...argsInitial);

  function next(...args) {
    const { value, done } = generator.next(...args);

    if (!done) {
      if (value.then) {
        value.then((v) => {
          // promise方式
          next(v);
        });
      } else {
        value(next); // callback方式
      }
    }
  }
  next();
}

run(someAsyncOpt, 9527);
```

# Symbol.iterator

指定对象的默认迭代器

[…5]如何能扩展成[0,1,2,3,4,5]?

数组展开操作符只能作用于部署了遍历器对象的数据结构，Number 的原型是没有是没有实现的，所以非要实现这个效果可以这样：

```js
Number.prototype[Symbol.iterator] = function* () {
  let index = 0;
  const num = this.valueOf();
  while (index <= num) {
    yield index++;
  }
};
console.log(...5); // 0 1 2 3 4 5
console.log([...5]); // [0,1,2,3,4,5]
for (let item of 2) {
  console.log(item);
}
// 0
// 1
// 2
```

判断一个对象是否是可迭代的

```js
function isIterable(obj) {
  if (typeof obj = 'undefined') {
    return false;
  }
  return obj !== null && typeof obj[Symbol.iterator] === 'function';
}
```
