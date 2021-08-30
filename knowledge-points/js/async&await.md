# async/await

async functions 和 await 是 ES2017 的一部分。他是基于 Promise 的语法糖。使得异步代码变得更容易编写和阅读。通过使用它们，异步代码更像老式的同步代码。

## async 关键字

我们使用 async 关键字，把它放在函数声明前，使其成为 async function。异步函数是一个知道如何使用 await 关键字调用异步代码的函数。异步函数的特征之一就是保证返值是 promise。

要实际使用 promise 完成时返回的值，我们可以使用.then()块，因为它返回的是一个 promise:

```js
const func = async () => {
  return 'Hello world!';
};

func().then((value) => {
  console.log(value); // 'Hello world!'
});
```

将 async 添加到函数声明中，可以告诉它们返回的是 promise，而不是直接返回值。此外，它避免了同步函数为支持使用 await 带来的任何潜在开销。在函数声明为 async 时，JS 引擎会添加必要的处理，以优化你的程序。

## await 关键字

当 await 关键字和异步函数一起使用时，它的真正优势就变得明显了—事实上，**await 只在异步函数中起作用**。它可以放在任何异步的，基于 promise 的函数之前。它会暂停代码在该行上，知道 promise 完成，然后返回结果值。在暂停的同时，其他正在等待执行的代码就有机会执行了。

你可以在调用任何返回 promise 的函数时使用 **await**，包括 WebAPI 函数：

```js
async function func() {
  return (greeting = Promise.resolve('Hello world!'));
}
func().then((value) => {
  console.log('Hello world!');
});
// 上述代码仅仅展示了语法
```

## 使用 async/await 重写 promise 代码

我们回顾 fetch 例子：

```js
fetch('coffee.jpg')
  .then((response) => response.blob())
  .then((myBlob) => {
    let objectURL = URL.createObjectURL(myBlob);
    let image = document.createElement('img');
    image.src = objectURL;
    document.body.appendChild(image);
  })
  .catch((e) => {
    console.log(
      'There has been a problem with your fetch operation: ' + e.message
    );
  });
```

我们将其使用 async/awai 转换一下，看看简单了多少：

```js
async function myFetch() {
  const response = await fetch('coffe.jpg');
  const myBlob = response.blob();
  const objectUrl = URL.ceateObjectURL(myBlob);
  const img = document.createElement('img');
  img.src = objectURL;
  document.body.appendChild(image);
}

myFetch().catch((e) => {
  console.log(
    'There has been a problem with your fetch operation: ' + e.message
  );
});
```

去除了.then()块，使得代码简单多了，更易理解。

由于 async 关键字可以将函数转换为 promise，可重构代码，使用 promise 和 await 的混合方式，将函数的后半部分抽取到新代码中，变得更加灵活:

```js
async function myFetch() {
  const response = await fetch('coffee.jpg');
  return await response.blob();
}
myFetch().then((blob) => {
  const objURL = URL.createObjectURL(blob);
  const image = document.createElement(objURL);
  image.src = objURL;
  document.appendChild(image);
});
```

## 它是如何工作的？

在 myFetch 函数中和先前（async/await 转换）的 promise 版本非常相似，但存在一些差异。我们不需要附加.then()块到每一个 promise-based 方法结尾，只需要在方法调用前使用 await 关键字，然后把结果赋给变量。await 关键字使 JS 运行时暂停于此行，允许其他代码在此期间执行，直到异步函数调用返回结果。一旦完成，你的代码将继续从下一行开始执行。例如：

```js
const response = await fetch('coffee.jpg');
```

解析器会在该行暂停，直到服务器返回响应变得可用时。此时 fetch()返回的 promise 将会完成（fulfilled），返回的 response 会赋值给 response 变量。一旦服务器返回的响应可用，解析器就会移动到下一行，从而创建一个 Blob。Blob 这一行也调用基于异步 promise 的方法，因此我们也在此行使用 await。当操作结果返回时，我将将它从 myFetch 函数返回。

这意味着当我们在调用 myFetch 函数时，它会返回一个 promise，因此我们可以将.then()链接到它的末尾，在其中我们处理显示在屏幕上的 blob。

## 添加错误处理

我们可以有几种选择：

1. 将同步代码的 try…catch 结构和 async/await 一起使用

```js
async function myFetch() {
  try {
    let response = await fetch('coffee.jpg');
    let myBlob = await response.blob();

    let objectURL = URL.createObjectURL(myBlob);
    let image = document.createElement('img');
    image.src = objectURL;
    document.body.appendChild(image);
  } catch (e) {
    console.log(e);
  }
}

myFetch();
```

catch {}代码块会接受一个错误对象 e。

2. 将.catch()块链接到.then()调用的末尾（比如碰到上边我们重构代码的情况）

```js
async function myFetch() {
  let response = await fetch('coffee.jpg');
  return await response.blob();
}

myFetch()
  .then((blob) => {
    let objectURL = URL.createObjectURL(blob);
    let image = document.createElement('img');
    image.src = objectURL;
    document.body.appendChild(image);
  })
  .catch((e) => console.log(e));
```

因为.catch()将捕获异步调用函数及其 promise 链中的错误。如果此处你使用了 try…catch{}代码块，那么在 调用 myFetch 函数时，仍可能会收到未处理的错误。

## 等待 Promise.all()

async/await 建立在 promises 之上，因此它与 promises 的所有功能兼容。包括 Promise.all()，所以完全可以通过调用 await Promise.all()将所有结果返回到变量中，就像同步代码一样。

注意: 也可以在异步函数中使用同步 finally 代码块代替 .finally() 异步代码块

## async/await 的缺陷

async/await 使得你的代码看起来是同步的，在某种程度上，也使得它的行为更加同步。await 会阻塞后边的代码，直到 promise 完成，就像执行同步操作一样。它确实可以允许其他任务在此期间继续，但你自己的代码将被阻塞。

这意味着你的代码可能会因为大量 await 的 promises 相继发生而变慢。每一个 await 都等待前一个完成，而你实际想要的可能是所有这些 promises 同时开始处理（就像没有使用 async/await 那样）。

有一种模式可以缓解该问题，通过将 promise 存储在变量中来**同时**开始它们，然后等待他们全部执行完毕。我们用 setTimeout 调用伪造异步进程：

```js
function timeoutPromise(interval) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('done');
    }, interval);
  });
}
async function timeTest() {
  // timeTest 至少 9 秒
  // await timeoutPromise(3000);
  // await timeoutPromise(3000);
  // await timeoutPromise(3000);

  // 同时启动 timeTest 至少 3 秒
  const tp1 = timeoutPromise(3000);
  const tp2 = timeoutPromise(3000);
  const tp3 = timeoutPromise(3000);
  await tp1;
  await tp2;
  await tp3;
}
const startTime = Date.now();
timeTest().then(() => {
  const finishTime = Date.now();
  const timeTaken = finishTime - startTime;
  console.log(timeTaken);
});
```

timeTest 中如果我们使用三个变量存储 promise 对象，就可以同时开启它们。这将使得总耗时仅仅为非同时启动的 1/3。

还有个小小不便之处就是你必须将等待执行的 promise 封装在异步函数中

**forEach** 方法执行多个 Promise 也可以达到同时开启的效果。（注意 for of、for in 不行）:

```js
function timeoutPromise(interval) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('done');
    }, interval);
  });
}

const arr = new Array(3).fill(() => timeoutPromise);

async function timeTest() {
  // 如果这样使用，timeTest 至少 9 秒
  // for (const func of arr) {
  //   const result = await func(3000);
  // }

  // 同时启动 timeTest 至少 3 秒
  arr.forEach((func) => {
    const result = await func(3000);
  });
}

const startTime = Date.now();
timeTest().then(() => {
  const finishTime = Date.now();
  const timeTaken = finishTime - startTime;
  console.log(timeTaken);
});
```

## async/await 的类方法

我们可以在类/对象方法前添加 async 以使它们返回 promises，并 await 它们内部的 promises：

```js
class Person {
  constructor(first, last, age, gender, interests) {
    this.name = {
      first,
      last,
    };
    this.age = age;
    this.gender = gender;
    this.interests = interests;
  }

  async greeting() {
    return await Promise.resolve(`Hi! I'm ${this.name.first}`);
  }

  farewell() {
    console.log(`${this.name.first} has left the building. Bye for now!`);
  }
}

let han = new Person('Han', 'Solo', 25, 'male', ['Smuggling']);
```

实例方法 greeting 可以这么使用：

```js
han.greeting().then(console.log);
```
