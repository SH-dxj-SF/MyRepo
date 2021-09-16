# this（MDN 版）

与其他语言相比，**函数的 this 关键字**在 JavaScript 中的表现略有不同，此外，在严格模式和非严格模式之间也会有一些差别。

在绝大多数情况下，函数的调用方式决定了 this 的值（运行时绑定）。this 不能在执行期间被赋值，并且在每次函数被调用时 this 的值也可能会不同。ES5 引入了 _bind_ 方法来设置函数的 this 值，而不用考虑函数如何被调用的。ES2015 引入了*箭头函数*，箭头函数不提供自身的 this 绑定（this 的值将保持为闭合词法上下文的值）。

## 值

当前执行上下文（global、function 或 eval）的一个属性，在非严格模式下，总是指向一个对象，在严格模式下可以是任意值。

## 描述

### 全局上下文

无论是否在严格模式下，在全局执行环境中（在任何函数体外部）this 都指向全局对象。

```js
// 浏览器中window对象同时也是全局对象
console.log(this === window); // true

a = 'aaa';
console.log(this.a); // "aaa"

this.b = 'bbb';
console.log(b); // "bbb"
console.log(window.b); // "bbb"
```

注意 ⚠️：无论你运行的代码当前的上下文如何，都可以使用 globalThis 轻松地获取到全局对象。

### 函数上下文

在函数内部，this 的值取决于函数被调用的方式。

非严格模式下，this 不是被调用指定的，所以这里的 this 默认指向了全局对象，浏览器中也就是 window

```js
function f1() {
  return this;
}
//在浏览器中：
f1() === window; //在浏览器中，全局对象是window

//在Node中：
f1() === globalThis;
```

严格模式下，如果进入执行上下文时没有指定 this，那么它会保持为 undefined

```js
function f2() {
  'use strict'; // 这里是严格模式
  return this;
}

f2() === undefined; // true

// 这个例子中，this应该是undefined。因为f2是被直接调用的，而不是作为对象的属性或者方法调用（比如：window.f2()）。部分浏览器在最初设计严格模式的时候没有正确的实现这个功，所以错误的返回了window对象。
```

要在调用函数时将 this 的值设置为特定值，请使用 call() 或 apply()，可以看后面的例子

### 类上下文

this 在**类**中的表现与在函数中类似，因为类本质上也是函数，但也有一些区别和注意事项。

在类的构造函数中，this 是一个常规对象。类中所有非静态的方法都会被添加到 this 的原型中

```js
class Example {
  constructor() {
    const proto = Object.getPrototypeOf(this);
    console.log(Object.getOwnPropertyNames(proto));
  }
  first() {}
  second() {}
  static third() {}
}

new Example(); // ['constructor', 'first', 'second']
```

注意 ⚠️：静态方法不是 this 的属性，它们是类本身的属性。

### 派生类

不像基类的构造函数，派生类的构造函数没有初始的 this 绑定。在构造函数中调用 super() 会生成一个 this 绑定，并相当于执行如下代码，Base 为基类：

```js
this = new Base();
```

注意 ⚠️：在 super 之前引用 this 会抛出错误。

派生类在调用 super()方法之前不能返回，除非它的构造函数返回一个对象或者它压根没有构造函数。

```js
class Base {}

class Good extends Base {} // 没有构造函数

class AlsoGood extends Base {
  constructor() {
    // 构造函数返回了一个对象
    return { a: 5 };
  }
}

class Bad extends Base {
  constructor() {}
}

new Good();
new AlsoGood();
new Bad(); // ReferenceError
```

## 示例

### 函数上下文中的 this

```js
// 对象可以作为 call 或 apply 的第一个参数传递，并且该参数将绑定到this对象。
var obj = { a: 'Custom' };

// 声明一个变量，并将该变量作为全局对象 window 的属性。
var a = 'Global';

function whatsThis() {
  return this.a; // this 的值取决于函数被调用的方式
}

whatsThis(); // 'Global' 因为在这个函数中 this 没有被设定，所以它默认为 全局/ window 对象
whatsThis.call(obj); // 'Custom' 因为函数中的 this 被设置为obj
whatsThis.apply(obj); // 'Custom' 因为函数中的 this 被设置为obj
```

### this 和对象转换

**非严格模式下**使用 call 和 apply 时，如果用作 this 的值不是对象，则会被尝试转换为对象。null 和 undefined 被转换为全局对象。原始值如 7 或 'foo' 会使用相应构造函数转换为对象。因此 7 会被转换为 new Number(7) 生成的对象，字符串 'foo' 会转换为 new String('foo') 生成的对象。

```js
function bar() {
  console.log(Object.prototype.toString.call(this));
}

bar.call(7); // [object Number]
bar.call('foo'); // [object String]
bar.call(undefined); // [object global]
```

### bind 方法

ES 5 引入了 Function.prototype.bind()。调用 func.bind(someObject)会创建一个与 func 具有相同函数体和作用域的函数，但是在这个新函数中，this 将永久地被绑定到了 bind 的第一个参数，无论这个函数是如何被调用的。

注意 ⚠️：bind 方法返回的新函数的 this 值不再能被改变。

```js
function f() {
  return this.a;
}

let g = f.bind({ a: 'azerty' });
console.log(g()); // azerty

let h = g.bind({ a: 'yoo' }); // bind只生效一次！
console.log(h()); // azerty

let o = { a: 37, f: f, g: g, h: h };
console.log(o.a, o.f(), o.g(), o.h()); // 37, 37, azerty, azerty
```

### 箭头函数

请查看 function/function.md 中的[箭头函数](https://github.com/SH-dxj-SF/MyRepo/blob/master/knowledge-points/js/function/function.md#%E7%AE%AD%E5%A4%B4%E5%87%BD%E6%95%B0)部分

### 作为对象的方法

当函数作为对象里的方法被调用时，this 被设置为调用该函数的对象。

下面的例子中，当 o.f() 被调用时，函数内的 this 将绑定到 o 对象。

```js
let o = {
  prop: 37,
  f: function () {
    return this.prop;
  },
};

console.log(o.f()); // 37
```

这样的行为完全不会受函数定义方式或位置的影响。在前面的例子中，我们在定义对象 o 的同时，将其中的函数定义为成员 f 。但是，我们也可以先定义函数，然后再将其附属到 o.f。这样做的结果是一样的：

```js
let o = { prop: 37 };

function independent() {
  return this.prop;
}

o.f = independent;

console.log(o.f()); // 37
```

这表明函数是从 o 的 f 成员调用的才是重点。

类似的，this 的绑定只受**最接近**的成员引用的影响。在下面的这个例子中，我们把一个方法 g 当作对象 o.b 的函数调用。在这次执行期间，函数中的 this 将指向 o.b。事实证明，这与他是对象 o 的成员没有多大关系，最近的引用才是最重要的。

```js
o.b = { g: independent, prop: 42 };
console.log(o.b.g()); // 42
```

### 原型链中的 this

```js
let o = {
  f: function () {
    return this.a + this.b;
  },
};
let p = Object.create(o);
p.a = 1;
p.b = 4;

console.log(p.f()); // 5
```

### getter 和 setter 中的 this

相同的概念也适用于当函数在一个 getter 或者 setter 中被调用。用作 getter 或 setter 的函数都会把 this 绑定到设置、获取属性的对象。

```js
function sum() {
  return this.a + this.b + this.c;
}

let o = {
  a: 1,
  b: 2,
  c: 3,
  get average() {
    return (this.a + this.b + this.c) / 3;
  },
};

Object.defineProperty(o, 'sum', {
  get: sum,
  enumerable: true,
  configurable: true,
});

console.log(o.average, o.sum); // 输出 2 6
```

### 作为构造函数

当一个函数用作构造函数时（使用 new 关键字），它的 this 被绑定到正在构造的新对象。

注意 ⚠️：虽然构造函数返回的默认值是 this 所指的那个对象，但它仍可以手动返回其他的对象（如果返回值不是一个对象，则返回 this 对象）。

```js
function C() {
  this.a = 37;
}

let o = new C();
console.log(o.a); // 37

function C2() {
  this.a = 37;
  return { a: 38 };
}

o = new C2();
console.log(o.a); // 38
```

### 作为一个 DOM 事件处理函数

当函数用作事件处理程序时，它的 this 设置为**放置侦听器（事件处理函数）**的元素（对于使用 addEventListener() 以外的方法动态添加的侦听器，某些浏览器不遵循此约定）。

```js
// 被调用时，将关联的元素变成蓝色
function bluify(e) {
  console.log(this === e.currentTarget); // 总是 true

  // 当 currentTarget 和 target 是同一个对象时为 true
  console.log(this === e.target);
  this.style.backgroundColor = '#A5D9F3';
}

// 获取文档中的所有元素的列表
let elements = document.getElementsByTagName('*');

// 将bluify作为元素的点击监听函数，当元素被点击时，就会变成蓝色
for (let i = 0; i < elements.length; i++) {
  elements[i].addEventListener('click', bluify, false);
}
```

### 作为一个内联事件处理函数

当代码被内联 on-event 处理函数 (en-US) 调用时，它的 this 指向监听器所在的 DOM 元素：

```html
<button onclick="alert(this.tagName.toLowerCase());">Show this</button>
```

上面的 alert 会显示 button。

注意如果外层代码中的 this 是这样设置的：

```html
<button onclick="alert((function(){return this})());">Show inner this</button>
```

在这种情况下，没有设置内部函数的 this，所以它指向 global/window 对象（即非严格模式下调用的函数未设置 this 时指向的默认对象）。

### 类中的 this

和其他普通函数一样，方法中的 this 值取决于它们如何被调用。有时，改写这个行为，让类中的 this 值总是指向这个类实例会很有用。为了做到这一点，可在构造函数中绑定类方法：

```js
class Car {
  constructor() {
    // Bind sayBye but not sayHi to show the difference
    this.sayBye = this.sayBye.bind(this);
  }
  sayHi() {
    console.log(`Hello from ${this.name}`);
  }
  sayBye() {
    console.log(`Bye from ${this.name}`);
  }
  get name() {
    return 'Ferrari';
  }
}

class Bird {
  get name() {
    return 'Tweety';
  }
}

const car = new Car();
const bird = new Bird();

// The value of 'this' in methods depends on their caller
car.sayHi(); // Hello from Ferrari
bird.sayHi = car.sayHi;
bird.sayHi(); // Hello from Tweety

// For bound methods, 'this' doesn't depend on the caller
bird.sayBye = car.sayBye;
bird.sayBye(); // Bye from Ferrari
```

注意 ⚠️：类的内部总是严格模式，所以调用一个 this 值为 undefined 的函数会抛出错误。

---

# this（自己整理的版本）

我们看，即使普通的全局函数也可以通过不同形式的调用表达式激活，这会影响 this 的值。

```js
function foo() {
  console.log(this);
}
foo(); // 全局对象
console.log(foo === foo.prototype.constructor); // true
// 但是另一种形式的调用表达式（同一个函数），this 值却不同
foo.prototype.constructor(); // foo.prototype
```

类似地我们可以调用一个被定义为某个对象方法的函数，但是 this 值并不会被设置为那个对象。

```js
var foo = {
  bar: function () {
    console.log(this);
    console.log(this === foo);
  },
};

foo.bar(); // foo true

var funcTest = foo.bar;
console.log(funcTest === foo.bar); // true
// 再一次，我们使用不同形式的调用表达式（同一个函数），this 值不相同
funcTest(); // 全局对象 false
```

那么调用函数表达式的形式又是如何影响 this 值的呢？这个和引用类型相关（Reference）引用类型我们可以抽象为：

```js
// 伪代码将应用类型表示为一个具有两个属性的对象
// base: 属性的所属对象
// propertyName: 属性名
// ES5 中，引用类型还会有一个 strict 属性，标识一个引用是否在严格模式下处理
var valueOfReferenceType = {
  base: <base object>,
  propertyName: <property name>
}
```

引用类型的值只会存在于两种情况下：

1. 当我们处理一个标识符
2. 或使用属性访问器

标识符有：变量名称、函数名称、函数参数名、全局对象的非完全限定属性名，标识符被算法处理完总是返回一个引用类型的值（这对 this 值很重要）

```js
var foo = 10;
function bar() {}
// 相应的引用类型值大概如下：
var fooReference = {
  base: global,
  propertyName: 'foo',
};
var barReference = {
  base: global,
  propertyName: 'bar',
};
```

属性访问器有两种变体：

```js
foo.bar();
foo['bar']();
// 相应的引用类型值大概这样：
var barReference = {
  base: foo,
  propertyName: 'bar',
};
```

我们来看在函数执行上下文中，引用类型的值是如何与 this 值关联起来的？在一个函数上下文中决定 this 值的一般规则如下：

如果在调用括号(…)的左侧有一个引用类型的值，那么 this 值将设置为这个引用类型值的 base 对象。

其他情况下（具有不同于引用类型的任何其他值类型），那么 this 值总是会被设置为 null。但是由于 this 值置为 null 并没有任何意义，所以会被隐式地转换为全局对象。注意 ⚠️：ES5 的严格模式下，不会强制把 null 转为全局对象，而是置为 undefined

下面我门再看一些例子：

```js
function foo() {
  return this;
}
foo(); // 全局对象（非严格模式下）；undefined（严格模式下）
windiw.foo(); // 全局对象（无论严格还是非严格模式）
// 这时(…)的左侧是一个引用类型的值（因为 foo 是一个标识符）。然后 this 值被设置为 base 对象，即全局对象。
```

属性访问器也是类似地：

```js
var foo = {
  bar: function () {
    return this;
  },
};
foo.bar(); // foo
// 此时我们也在(…)左侧有一个引用类型的值（base 对象为 foo），这个 base 对象在函数激活时被用作了 this 值。
```

然而激活同一个函数用不同形式的调用表达式，我们有其他的 this 值：

```js
var foo = {
  bar: function () {
    return this;
  },
};
test = foo.bar;
test(); // 全局对象
// 此时 test 是一个标识符，会生成一个引用类型值（base 对象为全局对象）
```

现在我们可以准确地给说出，为什么同一个方法在不同的函数调用表达式形式下会有不一样的 this 值。答案就是引用（Reference）类型的中间值不一样

```js
function foo() {
  console.log(this);
}
foo(); // global
// 因为
// var fooReference = {
//   base: global,
//   propertyName: 'foo',
// };

console.log(foo === foo.prototype.constructor); // true

// 另一种形式的调用表达式
foo.prototype.constructor(); // foo.prototype
// 因为
// var fooPrototypeConstructorReference = {
//   base: foo.prototype,
//   propertyName: 'constructor',
// };
```

另一个（典型的）通过调用表达式形式动态确定 this 值的例子：

```js
function foo() {
  console.log(this.bar);
}
var x = { bar: 10 };
var y = { bar: 20 };
x.test = foo;
y.test = foo;
x.test(); // 10
y.test(); // 20
```

(…)左侧为非引用类型值的情况，this 值被设置为 null，然后隐式地被置为全局对象。

我们看一些例子：

```js
(function () {
  console.log(this); // null => 全局对象
})();
// 此时没有引用类型值（既不是标识符，也不是属性访问器）this 值最终被置为全局对象。
```

```js
(function () {
  'use strict';
  console.log(this); // undefined
})();
// 严格模式下，不会设置为全局对象，而是 undefined
```

一些更复杂的例子：

```js
var foo = {
  bar: function () {
    console.log(this);
  },
};
foo.bar(); // Reference 输出 foo
foo.bar(); // Reference 输出 foo
(foo.bar = foo.bar)(); // null => 全局对象
(false || foo.bar)(); // null => 全局对象
(foo.bar, foo.bar)(); // null => 全局对象
```

引用类型但 this 值为 null：

```js
function foo() {
  function bar() {
    console.log(this);
  }
  bar(); // 相当于 AO.bar() ES3 中如果 base 对象是一个活动对象，那么返回 null
}
foo(); // null => 全局对象
// 此时局部变量、内部函数、形式参数存储在活动对象（AO）中。AO.bar()又等价于 null.bar()。所以 this 值又被隐式地只为全局对象。
// 注意 ⚠️：ES3 规范中，当一个 base 对象是一个 AO 时，返回 null。
```

```js
var x = 10;
with ({
  foo: function () {
    console.log(this.x);
  },
  x: 20,
}) {
  foo(); // 20 因为 with 语句将 fooReference 的 base 对象置为了__withObject
}
try {
  throw function () {
    console.log(this);
  };
} catch (e) {
  e(); // 在 ES3 中：__catchObject；在 ES5 中：全局对象
}
```

当一个函数被当作构造函数调用时的 this 值：

```js
function A() {
  console.log(this); // 新创建的对象，下边的对象 'a'
  this.x = 10;
}
var a = new A();
console.log(a.x);
```

手动设置一个函数调用的 this 值：

Function.prototype 中定义了两个方法（因此，所有方法都可以访问它们）：apply 和 call 方法。它们之间区别甚微，第一个参数都是作为调用上下文中的 this 值（并且只有该参数是必须的）。区别在于 apply 方法第二个参数接收一个数组（或者类数组的对象，比如 arguments）；call 方法第二个参数接收任何参数。

```js
var b = 10;
function a(c) {
  console.log(this.b);
  console.log(c);
}
a(20); // this === 全局对象 this.b === 10 c === 20;
a.call({ b: 20 }, 30); // this === {b: 20} this.b === 20 c === 30
a.apply({ b: 30 }, [40]); // this === {b: 30} this.b === 30 c === 40
```

Function.prototype 还定义了一个 bind 方法： 该方法返回一个新函数。

新函数的 this 值被指定为第一个参数，其余参数作为新函数的参数。如果 bind 方法参数为空或者 thisArg 为 null、undefined，那么执行作用域的 this 将被视为新函数的 thisArg。注意 ⚠️：bind 方法返回的新函数的 this 值不再能被改变。
