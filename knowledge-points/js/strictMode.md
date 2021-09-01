# JS 严格模式

ES5 的严格模式是采用具有限制性 JavaScript 变体的一种方式。从而使代码显示地脱离 sloppy mode（也成懒散模式、马虎模式、稀松模式）。

严格模式不仅仅是一个子集：它的产生是为了形成与正常代码不同的语义。

支持/不支持严格模式的浏览器在执行严格模式代码时会采取不同行为。

严格模式代码和非严格模式代码可以共存，因此项目代码可以渐进式地采用严格模式。

严格模式对于正常 JS 语义做出了一下更改：

1. 严格模式通过**抛出错误**来消除了一些原有**静默错误**。
2. 严格模式修复了一些导致 JS 引擎难以执行优化的缺陷：有时候相同的代码严格模式可以比非严格模式代码**执行地更快**。
3. 严格模式**禁用**了在 ECMAScript 的未来版本中可能会定义的一些语法。

## 调用严格模式

严格模式可以应用到整个脚本或者个别函数中。不要在封闭的{}大括号内这样做（这样的上下文中这么做是无效的）。在 eval、Function、内联事件处理属性、setTimeout 方法中传入的脚本字符串，其行为类似于开启了严格模式的一个单独脚本，它们会如预期一样工作。

### 为脚本开启严格模式

为整个脚本文件开启严格模式，需要在所有语句之前放一个特定语句”use strict”；或‘use strict’；

```js
// 整个脚本都开启严格模式的语法
'use strict';
var v = "Hi!  I'm a strict mode script!";
```

这种语法存在缺陷：不能盲目地合并冲突的脚本。试想我们合并一个严格模式的脚本和另一个非严格模式的脚本：合并后的脚本看起来是严格的；反过来我们合并一个非严格模式的脚本和另一个严格模式的脚本：合并后的脚本看起来是不严格的。合并均为严格模式或者均为非严格模式的脚本是没问题的。建议一个个函数去开启严格模式。

### 为函数开启严格模式

将”use strict”；或‘use strict’；一字不漏地放在所有函数体语句之前。

```js
function strict() {
  'use strict';
  function nested() {
    return 'And so am I!';
  }

  return "Hi!  I'm a strict mode function!  " + nested();
}

function notStrict() {
  return "I'm not strict.";
}
```

## 严格模式中的变化

严格模式同时改变了语法及运行时行为。变化通常分为这几类：

1. 将问题直接转化为错误（如语法错误或运行时错误）；
2. 简化了如何为给定名称的特定变量计算；
3. 简化了 eval 及 arguments；
4. 将写“安全”JS 的步骤变得更简单；
5. 改变了预测未来 ECMAScript 行为的方式。

### 过失错误转化为异常

严格模式下某些先前被接受的过失错误转化为异常：

1. 严格模式下无法在意外创建全局变量。在普通的 JS 里面给一个错误命名的变量名赋值会使全局对象新增一个属性并继续 “工作”（尽管未来可能失败）。严格模式中将抛出错误

```js
'use strict';
// 假如有一个全局变量叫做mistypedVariable
mistypedVaraible = 17; // 因为变量名拼写错误
// 这一行代码就会抛出 ReferenceError
```

2. 严格模式下会使引起静默失败（silently fail，不报错也没任何效果）的赋值操作抛出异常。例如 NaN 是一个不可写全局变量，普通模式下给 NaN 赋值不会产生任何作用；开发者也不会收到任何错误反馈。但严格模式下，给 NaN 赋值会抛出一个异常。任何正常模式下引起静默失败的赋值操作都会抛出异常，比如：给不可写属性赋值、给只读属性赋值、给不可扩展对象的新属性赋值...

```js
'use strict';

// 给不可写属性赋值
var obj1 = {};
Object.defineProperty(obj1, 'x', { value: 42, writable: false });
obj1.x = 9; // 抛出TypeError错误

// 给只读属性赋值
var obj2 = {
  get x() {
    return 17;
  },
};
obj2.x = 5; // 抛出TypeError错误

// 给不可扩展对象的新属性赋值
var fixed = {};
Object.preventExtensions(fixed);
fixed.newProp = 'ohai'; // 抛出TypeError错误
```

3. 严格模式下试图删除不可删除的属性时会抛出异常（普通模式中不产生任何效果）

```js
'use strict';
delete Object.prototype; // 抛出TypeError错误
```

4. 严格模式要求函数的参数名唯一。普通模式下，最后一个重名参数名会掩盖之前的重名参数。之前的参数仍可以通过 arguments[i]来访问（还不是完全无法访问）。然而这种隐藏毫无意义且可能是意料之外的（比如可能本来就是打错了）。严格模式下被认为是语法错误。

```js
function sum(a, a, c) {
  // !!! 语法错误
  'use strict';
  return a + a + c; // 代码运行到这里会出错
}

// --------------------------------------

// 非严格模式下
function sum(a, a, c) {
  return a + a + c;
}

sum(1, 2, 3); // 7 => 2 + 2 + 3
```

5. 严格模式禁止八进制数字语法。ECMAScript 并不包含八进制语法。但是所有的浏览器都支持以 0 开头的八进制语法：0644 === 420 还有”\045”=== “%”在 ES6 中支持为一个数字加“0o”的前缀来表示八进制数

```js
let a = 0o10; // ES6: 八进制
```

有些新手开发者任务前导零没有语法意义，所以他们会用作对齐措施—但其实这会改变数字的意义。八进制语法很少使用且可能会错误使用，所以严格模式下八进制语法会引起语法错误。

```js
'use strict';
let sum = 017 + 120 + 119; // SyntaxError: Octal literals are not allowed in strict mode.

let sumWithOctal = 0o10 + 8; // 正常执行
console.log(sumWithOctal); // 16
```

6. ES6 的严格模式禁止设置 primitive（原始）值的属性。普通模式设置属性将会简单忽略（no-op），采用严格模式，将抛出 TypeError 错误。

```js
(function () {
  'use strict';

  false.true = ''; // TypeError: Cannot create property 'true' on boolean 'false'
  (14).sailing = 'home'; //TypeError: Cannot create property 'sailing' on number '14'
  'with'.you = 'far away'; //TypeError: Cannot create property 'you' on string 'with'
})();
```

### 简化变量的使用

严格模式简化了代码变量名字映射到变量定义的方式。很多编译器的优化是依赖存储变量 X 位置的能力：这对全面优化 JS 代码有至关重要的作用。JS 有些情况会使得代码中名字到变量定义的基本映射只在运行时才产生。严格模式移除了大多数这种情况的发生，所以编译器能更好地优化严格模式的代码。

1. 严格模式禁用 with。with 所引起的问题是块内的任何名称可以映射（map）到 with 传进来的对象的属性，也可以映射到包围这个块的作用域内的变量（甚至全局变量）。这一切都是运行时决定的（代码执行之前无从知晓）。严格模式下使用 with 会引起语法错误，所以就不存在 with 块内变量在运行时才决定引用到哪里的情况了。

```js
'use strict';
var x = 17;
with (obj) {
  // SyntaxError: Strict mode code may not include a with statement
  // 如果没有开启严格模式，with中的这个x会指向with上面的那个x，还是obj.x？
  // 如果不运行代码，我们无法知道，因此，这种代码让引擎无法进行优化，速度也就会变慢。
  x;
}
```

一种取代 with 的简单方法就是将目标对象赋值给一个短命名变量，然后访问这个变量上的相应属性。

2. _严格模式下的 eval 不再为上层范围（surrounding scope，注：包围 eval 代码块的范围）引入新变量_。普通模式下代码 eval(“var x;”)会给上层函数或者全局引入一个新变量 x。这意味着，一般情况下在一个包含 eval 调用的函数内有所有没有引用到参数或者局部变量的名称都必须在运行时才能被映射到特定的定义。（因为 eval 可能引入的新变量会覆盖它的外层变量）。严格模式下 eval 仅仅为被运行的代码创建变量，所以 eval 并不会使得名称映射到外部变量或者其他局部变量：

```js
var x = 17;
var evalX = eval("'use strict'; var x = 42; x");
console.assert(x === 17);
console.assert(evalX === 42);
```

相应的，如果函数 eval 被在严格模式下的 eval(…)以表达式的形式调用时，其代码会被当作严格模式下的代码执行。

```js
function strict1(str) {
  'use strict';
  return eval(str); // str中的代码在严格模式下运行
}
function strict2(f, str) {
  'use strict';
  return f(str); // 没有直接调用eval(...): 当且仅当str中的代码开启了严格模式时
  // 才会在严格模式下运行
}
function nonstrict(str) {
  return eval(str); // 当且仅当str中的代码开启了"use strict"，str中的代码才会在严格模式下运行
}

strict1("'Strict mode code!'");
strict1("'use strict'; 'Strict mode code!'");
strict2(eval, "'Non-strict code.'");
strict2(eval, "'use strict'; 'Strict mode code!'");
nonstrict("'Non-strict code.'");
nonstrict("'use strict'; 'Strict mode code!'");
```

因此，在 eval 执行的严格模式代码下，变量的行为与严格模式下非 eval 执行的代码中的变量相同。

3. 严格模式下禁止删除普通的名称。delete name 在严格模式下会引起语法错误

```js
'use strict';

var x;
delete x; // !!! syntax error

eval('var y; delete y;'); // !!! syntax error
```

### 让 eval 和 arguments 变得更简单

严格模式让 arguments 和 eval 少了一些奇怪的行为。

1. 名称 eval 和 arguments 不能通过程序语法被绑定或赋值。一下所有尝试将引起语法错误

```js
"use strict";
eval = 17;
arguments++;
++eval;
var obj = { set p(arguments) { } };
var eval;
try { } catch (arguments) { }
function x(eval) { }
function arguments() { }
var y = function eval() { };
var f = new Function("arguments", "'use strict'; return 17;");
```

2. 严格模式下，参数的值不会随 arguments 对象的值变化而改变。普通模式下对于第一个参数是 arg 的函数，对 arg 赋值会同时赋值给 arguments[0]，反之亦然。（除非没有参数或者 arguments[0]被删除）。严格模式下，函数的 arguments 对象会保存函数被调用时的原始参数。arguments[i]的值不会随着与之相应的参数的值的改变而变化。同名参数的值也不会随与之相应的 arguments[i]的值的改变而变化。

```js
// 严格模式下，改变参数不会影响arguments
function f(a, b) {
  'use strict';
  a = 42;
  return [a, b, arguments[0], arguments[1]];
}

f(1, 2); // [42, 2, 1, 2]

// 非严格模式下，改变参数会同时改变arguments

function f(a, b) {
  a = 42;
  return [a, b, arguments[0], arguments[1]];
}

f(1, 2); // [42, 2, 42, 2]

// ----------------------------------------

// 严格模式下，改变arguments不会影响参数
function f(a, b) {
  'use strict';
  a = 42;
  arguments[0] = 10;
  return [a, b, arguments[0], arguments[1]];
}

f(1, 2); // [42, 2, 10, 2]

// 非严格模式下，改变arguments会影响参数

function f(a, b) {
  a = 42;
  arguments[0] = 10;
  return [a, b, arguments[0], arguments[1]];
}

f(1, 2); // [10, 2, 10, 2]
```

3. 严格模式下，不再支持 arguments.callee。普通模式下 arguments.callee 指向当前正在执行的函数。这个作用很小，直接给执行函数命名就行。此外 arguments.callee 十分不利于优化。严格模式下 arguments.callee 是一个不可删除属性，赋值和读取时都会抛出异常。

```js
'use strict';
let f = function () {
  return arguments.callee;
};
f(); // 抛出类型错误
```

### “安全的”JavaScript

严格模式下更容易写出“安全”的 JavaScript。

1. 严格模式下通过 this 传递给一个函数的值不会被强制转换为一个对象。对一个普通的函数来说，this 总会是一个对象：不管调用时 this 本身就是一个对象，还是布尔值、字符串或者数字调用函数时函数里边被封装成对象的 this；还是使用 undefined 或 null 调用函数式 this 代表的全局对象。这种自动转换为对象的过程不仅是一种性能上的损耗，同时在浏览器暴露出全局对象也会成为安全隐患（因为全局对象提供了访问那些所谓安全的 JS 环境必须限制的功能的途径）。所以对于一个开启严格模式的函数，指定的 this 不再被封装成对象，而且没有指定 this 的话它的值时 undefined。

```js
// 严格模式下
'use strict';
function func() {
  return this;
}
console.log(func()); // window
console.log(func.call(2)); // Number {2}
console.log(func.apply(null)); // window
console.log(func.call(undefined)); // window
console.log(func.bind(true)()); // Boolean(true)

// 非严格模式下
function func() {
  return this;
}
console.log(func()); // undefined
console.log(func.call(2)); // 2
console.log(func.apply(null)); // null
console.log(func.call(undefined)); // undefined
console.log(func.bind(true)()); // true
```

2. 严格模式下再也不能通过广泛的 ECMAScript 扩展“游走于”JS 的栈中。普通模式下，用这些扩展的话，当一个叫 fun 的函数正在被调用的时候，fun.caller 是最后一个调用 fun 的函数，而且 fun.arguments 包含调用 fun 时用的的行参。这两个扩展接口对于“安全”JavaScript 而言都是有问题的，因为他们允许“安全的”代码访问“专有”函数和它们的（通常是没有经过保护的）形参。如果在严格模式下，那么 fun.caller 和 fun.arguments 都是不可删除的属性，而且赋值和取值时都会抛出异常

```js
function restricted() {
  'use strict';
  restricted.caller; // 抛出类型错误
  restricted.arguments; // 抛出类型错误
}

function privilegedInvoker() {
  return restricted();
}

privilegedInvoker();
```

3. 严格模式下的 arguments 不会再提供访问与这个函数相关的变量的途径。在一些旧时的 ECMAScript 实现中 arguments.caller 曾经是一个对象，里边存储的属性指向那个函数的变量，这是一个安全隐患；它同时也是引起大量优化工作的原因。严格模式下 arguments.caller 同样是一个不可被删除的属性，赋值和取值时都抛出异常

```js
'use strict';
function fun(a, b) {
  'use strict';
  var v = 12;
  return arguments.caller; // 抛出类型错误
}
fun(1, 2); // 不会暴露v（或者a，或者b）
```

### 为未来的 ECMAScript 铺平道路

1. 严格模式中一部分字符变成了保留的关键字。包括：implements、interface、let、package、private、protected、public、static、yield。严格模式下你不能再使用这些名字作为变量名或者行参名。

```js
function package(protected) {
  // !!!
  'use strict';
  var implements; // !!!

  // !!!
  interface: while (true) {
    break interface; // !!!
  }

  function private() {} // !!!
}

function fun(static) {
  'use strict';
} // !!!
```

2. 严格模式禁止了不在脚本或者函数层面上的函数声明。在浏览器的普通代码中，“所有地方”的函数声明都是合法的。

```js
'use strict';
if (true) {
  function f() {} // !!! 语法错误
  f();
}

for (var i = 0; i < 5; i++) {
  function f2() {} // !!! 语法错误
  f2();
}

function baz() {
  // 合法
  function eit() {} // 同样合法
}
```
