# Function

每一个 JS 函数，其实都是一个 Function 对象：

```js
(function () {}.constructor === Function); // true
```

## 构造函数

Function 构造函数创建一个新的 Function 对象。直接调用此构造函数可用于动态动态创建函数，但是会遭遇和 eval 类似的**安全问题**以及（相对较小）的**性能问题**。

然而与 eval 不同的是，Function 创建的函数只能在全局作用域中运行——即函数的词法环境指向全局环境，只能访问全局变量

## 语法

```js
new Function ([arg1[, arg2[, ...argN]],] functionBody)
```

参数：

- arg1, arg2, …argN：被函数使用的参数的名称必须是合法命名的。一个有效的 JS 标识符的字符串，或者一个用逗号分隔的有效字符串的列表。例如：'x', 'y'或者'x, y'

- functionBody：一个含有 JS 语句（包括函数定义的）的字符串。

例子：

```js
const sum = new Function('x', 'y', 'return x + y');
console.log(sum(1, 2)); // 3
```

## 描述

使用 Function 构造器创建的 Function 对象是在函数创建时解析的。这比使用**函数声明**或者**函数表达式**在代码调用中更为**低效**，因为后两者是和其他代码一起解析的。

所有被传递到 Function 构造器中的参数，都将被视为被创建函数的参数，并且顺序和标识符名称相同。

以函数调用的方式（即不使用 new 关键字）调用 Function 的构造函数跟以构造函数的调用方式调用是一样的。

# 实例属性

过滤了不推荐以及被删除了的属性：

- Function.prototype.length：获取函数接受参数的个数

- Function.prototype.name：获取函数的名称

# 实例方法

- Function.prototype.apply(thisArg [, argsArray])：调用一个具有特定 this 值（thisArg）的函数，以及一个数组（或类数组对象）提供的参数。与 call 方法作用类似，只是 apply 方法接受一个数组（或类数组对象）的参数，而 call 方法接受一个参数列表。

- Function.prototype.bind(thisArg [, arg1 [, arg2 [, …argN]]])：创建一个新的函数，在 bind 被调用时，新函数的 this 被指定为 bind 方法的第一个参数，其余参数作为新函数的参数。新函数有以下特性：

  1. 新函数的 this 值不可再被修改
  2. 新函数的 name 属性会在原 name 前多出一个 bound 标识，可以用于判断
  3. 如果过 thisArg 对象的属性更新了，那么新函数中属性也会更新。

- Function.prototype.call(thisArg [, arg1 [, arg2 [, …argN]]])：调用一个具有特定 this 值（thisArg）的函数，调用参数可以 0 个或者多个。与 apply 方法作用类似，只是 call 方法接受一个参数列表，而 apply 方法接受一个包含多个参数的数组.。

- Function.prototype.toString()：返回一个表示当前函数的源代码字符串。覆盖了 Object.prototype.toString 方法。

注意 ⚠️：apply、bind、call 方法中，如果 thisArg 为 null 或者 undefined，那么会被替换成全局对象（非严格模式下）

## Function.prototype.bind 实现

不支持 new 关键字调用

```js
Function.prototype.bindFake = function () {
  const slice = Array.prototype.slice;
  const funcOrigin = this;
  const thisArg = arguments[0];
  const args = slice.call(arguments, 1);
  if (typeof funcOrigin !== 'function') {
    throw new TypeError('正在绑定一个不可调用的值');
  }
  return function () {
    const argsFunc = args.concat(slice.call(arguments));
    return funcOrigin.apply(thisArg, argsFunc);
  };
};
```

# 箭头函数

箭头函数的 this 与封闭词法环境的 this 保持一致（创建箭头函数时的环境的 this）。

并且箭头函数不能被用作构造函数。

箭头函数表达式的语法比函数表达式更简洁，并且没有自己的 this、arguments、super、new.target，箭头函数表达式更适用于那些本来需要匿名函数的地方。

箭头函数中严格模式的规则将被忽略：

```js
var f = () => {
  'use strict';
  return this;
};
f(); // 返回全局对象
```

如果不是箭头函数则：

```js
function f() {
  'use strict';
  return this;
}
f(); // 返回 undefined
```

由于箭头函数没有自己的 this，所以通过 call、apply、bind 方法使用时，只能传递参数，第一个参数将被忽略。

```js
var adder = {
  base: 1,
  add: function (num) {
    var f = (v) => v + this.base;
    return f(num);
  },
  addThruCall: function (num) {
    var f = (v) => v + this.base;
    var b = {
      base: 2,
    };
    return f.call(b, num);
  },
};
adder.add(1); // 返回 2
adder.addThruCall(1); // 仍然返回 2
```

**不绑定 arguments**

```js
var arguments = [10,20,30];
var arr = () => arguments[0];
arr(); // 10，没有 arguments 对象，所以相当于取了数组 arguments 的第一个元素返回
function foo(num) {
// 函数 foo 具有 arguments 对象，并且 arguments 对象的第一个元素就是 num
// 但箭头函数 f 没有 arguments 对象，所以它取了父级（foo）的 arguments 对象
var f = v => arguments[0] + num;
return f();
};
foo(1); // 2
foo(2); // 4
foo(3); // 6
foo(4, 5); // 8
```

所以箭头函数想获取自身参数列表时需使用**剩余参数运算符**:

```js
var arr = (...args) => console.log(args, args instanceof Array);
arr(1, 2, 3); // [1, 2, 3] true
```

使用 new 操作符：将抛出错误

```js
var Foo = () => {};
var foo = new Foo(); // TypeError: Foo is not a constructor
```

使用 prototype 属性：箭头函数没有该属性

```js
var foo = () => {};
console.log(foo.prototype); // undefined
```

返回对象字面量：params => {name: ‘test’}这种简单语法返回对象字面量是不行的。因为大括号{}里的代码被解析为一系列语句。所以记得永远括号将对象字面量包裹起来

```js
var func = () => {foo: 1};
func(); // undefined // 没有返回东西
var func = () => {foo: function() {}} // 语法错误，函数声明需要名字
-----------------------------分隔线------------------------
var func = () => ({foo: 1});
func(); // {foo: 1}
```

换行：箭头函数参数和箭头之间不能换行，但是在箭头=>之后或者用()、{}来实现换行,下边这些写法都是可以的。

<!-- prettier-ignore -->
```js
var func = (a,b) =>
1;
var func = (a,b) => (
1
);
var func = (a,b) => {
return 1
};
var func = (
a,
b,
c) => 1;
```

解析顺序

```js
let callback;
callback = callback || function() {}; // ok
callback = callback || () => {}; // Syntax Error: invalid arrow-function arguments
callback = callback || (() => {}); // ok
```

# 函数拷贝

```js
function cloneFunction(origin) {
  const copy = new Function(`return ${origin.toString()};`)();
  copy.prototype = origin.prototype; // 修复原型指向
  return copy;
}
```
