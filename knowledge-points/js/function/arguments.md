# Arguments 对象

arguments 是一个类数组（Array-like）对象，函数内部可以访问的，包含传递给函数的参数的值。

## 描述

注意 ⚠️：如果你在写 ES6 兼容的代码，那么更推荐使用剩余参数语法。

注意 ⚠️：类数组意思是 arguments 参数有一个 length 属性，还有从索引 0 开始的一系列属性。但是它没有 Array 内建的方法，例如 forEach、map、push...

arguments 是所有非箭头函数中都可用的一个局部变量。你可以使用 arguments 对象在函数中引用函数的参数。此对象包含传递给函数的每个参数，第一个参数在索引 0 处。

```js
function test(a, b, c) {
  console.log(arguments[0]);
  console.log(arguments[1]);
  console.log(arguments[2]);
}

test(1, 2, 3);
// 1
// 2
// 3
```

参数也可以被设置：

```js
arguments[0] = 'changed';
```

arguments 可以被转换为一个真正的数组：

```js
let args = Array.prototype.slice.call(arguments);
let args = [].slice.call(arguments);

// ES 2015
let args = Array.from(arguments);
let args = [...arguments];
```

当调用时的参数比正式声明的参数多的时候，arguments 对象会比较有用。这种技术对于传递可变数量的参数的函数很有用，比如说 Math.min()。我们看一个函数，它接受任意个数的字符串参数，然后返回最长的一个。

```js
function longestString() {
  let result = '';

  for (let i = 0; i < arguments.length; ++i) {
    if (arguments[i].length > result.length) {
      result = arguments[i];
    }
  }

  return result;
}
```

我们可以通过 arguments.length 属性知道函数调用时的参数个数。但是如果我们想知道函数声明时候的参数个数，那么需要使用 function.length 属性。

## 属性

- arguments.callee

  指向 arguments 所属的正在执行的函数。严格模式下被限制。

- arguments.length

  调用时传递给函数的参数个数。

- arguments[@@iterator]

  返回新的 Array iterator 对象，该对象包含 arguments 中每个索引的值。

## 示例

### 连接字符串的函数

```js
function concatString(separator) {
  let args = Array.prototype.slice.call(arguments, 1);
  return args.join(separator);
}
```

我们可以传递任意个数的参数，它会返回每一个参数拼接起来的字符串。

```js
myConcat(', ', 'red', 'orange', 'blue'); // 返回 "red, orange, blue"

myConcat('; ', 'elephant', 'giraffe', 'lion', 'cheetah'); // 返回 "elephant; giraffe; lion; cheetah"
```

### 创建 HTML 列表的函数

```js
function list(type) {
  let result = `<${type}l><li>`;
  let args = Array.prototype.slice.call(arguments, 1);
  result += args.join('</li><li>');
  result += `</li></${type}l>`;

  return result;
}

list('o', 1, 2, 3); // '<ol><li>1</li><li>2</li><li>3</li></ol>'
```

### 剩余参数、默认参数、解构赋值

arguments 可以和剩余参数、默认参数、解构赋值参数结合使用

```js
function test(...args) {
  return args;
}

test(1, 2, 3); // [1,2,3]
```

严格模式下剩余参数、默认参数、解构赋值参数的存在与否，arguments 的行为都是一致的。也就是 argumetns 中的值和参数的值不会互相影响。

**非严格模式下**的函数如果**不包含**剩余参数、默认参数、解构赋值参数，那么 arguments 对象中的值会跟踪参数的值，反之亦然（参数的值会跟踪 arguments 对象中的值）。

```js
// 更新了arguments[0] 同样更新了a
function func(a) {
  arguments[0] = 99;
  console.log(a);
}
func(10); // 99

// 更新了a 同样更新了arguments[0]
function func(a) {
  a = 99;
  console.log(arguments[0]);
}
func(10); // 99
```

**非严格模式下**的函数如果**有包含**剩余参数、默认参数、解构赋值参数，那么 arguments 对象中的值**不会**跟踪参数的值，反之亦然（参数的值不会跟踪 arguments 对象中的值）。

```js
// 更新了arguments[0] 不会更新a
function func(a = 5) {
  arguments[0] = 99;
  console.log(a);
}
func(10); // 10

// 更新了a 不会更新arguments[0]
function func(a = 5) {
  a = 99;
  console.log(arguments[0]);
}
func(10); // 10
```

arguments 反映了调用时的提供的参数，和严格模式表现一致

```js
function func(a = 55) {
  console.log(arguments[0]);
}
func(); // undefined
```
