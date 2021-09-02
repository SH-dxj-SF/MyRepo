# Reflect（ES6）

Reflect 是一个内置的对象，它为一些可拦截的 JS 操作提供方法。Reflect 不是一个函数对象，所以它是不可构造的。

## 描述

Reflect 的所有属性和方法都是静态的（就像 Math 对象一样）。
Reflect 提供了一些静态方法，这些方法与 proxy handler methods 的命名相同（目前有 13 个\_2021.05.26）。其中的一些方法与 Object 中的相同，尽管它们之间有些细微差别。

## 静态方法

### Reflect.apply(target, thisArg, argumentsList)

对一个目标函数 target 进行调用，同时可以提供一个数组 argumentsList 作为调用参数。与 Function.prototype.apply 方法相似。

参数：

1. target：目标函数
2. thisArg：调用时的 this 对象
3. argumentList：target 函数调用时传入的实参列表（类数组对象）。

返回值：函数调用的结果

异常：如果 target 对象不可调用，返回 TyperError

示例：

```js
Reflect.apply(Math.floor, undefined, [1.75]); // 1

Reflect.apply(String.fromCharCode, undefined, [104, 101, 108, 108, 111]); // hello

Reflect.apply(RegExp.prototype.exec, /ab/, ['confabulation']).index; // 4

Reflect.apply(''.charAt, 'ponies', [3]); // i
```

### Reflect.construct(target, argumentList [, newTarget])

作为一个方法，它的行为就像 new 操作符，等价于 new target(…argumentList)。

参数：

1. target：被执行的目标构造函数
2. argumentList：target 构造函数调用时传入的实参数列表（类数组对象）
3. newTarget（可选）：作为新创建对象原型对象的 constructor 属性，参考 new.target 操作符。如果 newTarget 未提供，那么默认使用 target。

返回值：以 target（如果提供了 newTarget，则使用 newTarget）为构造函数，argumentList 为初始化参数的对象实例。

异常：如果 target 或者 newTarget 不是构造函数，抛出 TyperError

示例：

使用 Reflect.construct

```js
let d = Reflect.construct(Date, [1776, 6, 4]);
d instanceof Date; // true
d.getFullYear(); // 1776
```

Reflect.construct VS Object.create

在 Reflect 出现以前，是通过明确指定构造函数和原型对象（Object.create）来创建一个对象的。

```js
function One() {
  this.name = 'one';
}
function Two() {
  this.name = 'two';
}
const args = [1, 2];

// 创建一个对象
const obj1 = Reflect.construct(One, args, Two);
// 与上述方法等效
const obj2 = Object.create(Two.prototype);
One.apply(obj2, args);

console.log(obj1.name); // 'one'
console.log(obj2.name); // 'one'

console.log(obj1 instanceof One); // false
console.log(obj2 instanceof One); // false

console.log(obj1 instanceof Two); // true
console.log(obj2 instanceof Two); // true

// 尽管两种方式结果相同，但是过程会有些差异。
// 使用 Object.create 和 Function.prototype.apply 时，因为没有使用 new 运算符，构造函数内部的 new.target 指向了 undefined。
// 使用 Reflect.construct 时，new.target 会指向 target（如果 newTarget 指定了，那么指向 newTarget）
```

### Reflect.defineProperty(target, propertyKey, attributes)

基本和 Object.defineProperty 一致，不同点是会返回一个 Boolean 值。

参数：

1. target：目标对象
2. propertyKey：要定义或者修改的属性名称
3. attributes：要定义或者修改的属性的描述

返回值：Boolean，是否被成功定义

异常：target 不是 Object，抛出 TypeError

示例：

使用 Reflect.defineProperty

```js
let obj = {};
Reflect.defineProperty(obj, 'test', { value: 9527 });
obj.test; // 9527
```

Reflect.defineProperty VS Object.defineProperty

Object.defineProperty 返回传入的对象（如果没有成功定义则抛出 TyperError）

Reflect.defineProperty 返回 Boolean，表示是否成功定义

### Reflect.deleteProperty(target, propertyKey)

允许删除属性，类似于 delete 操作符（非严格模式下），只不过它是一个函数。

参数：

1. target：目标对象
2. propertyKey：要删除的属性名称

返回值：Boolean，属性是否被成功删除

异常：target 不是 Object，抛出 TypeError

示例：

使用 Reflect.deleteProperty()

```js
let obj = { x: 1, y: 2 };
Reflect.deleteProperty(obj, 'x'); // true
obj; // { y: 2 }

let arr = [1, 2, 3, 4, 5];
Reflect.deleteProperty(arr, 2); // true
arr; // [1, 2, empty, 4, 5]

// 如果属性不存在，返回 true
Reflect.deleteProperty({}, 'foo'); // true

// 如果属性不可配置，返回 false
Reflect.deleteProperty(Object.freeze({ foo: 1 }), 'foo'); // false
```

### Reflect.get(target, propertyKey [, receiver])

与 targer[propertyKey]类似，只不过是通过函数执行来操作。

参数：

1. target：需要取值的目标对象
2. propertyKey：需要获取值的属性名称
3. receiver（可选）：如果 target 中指定了 getter ，则作为 getter 调用时的 this 值。

返回值：属性的值

异常：target 不是 Object，抛出 TypeError

示例：

使用 Reflect.get

```js
let obj = { x: 1, y: 2 };
Reflect.get(obj, 'x'); // 1

let arr = [1, 2, 3];
Reflect.get(arr, 1); // 2

// proxy with a get handler
let p = new Proxy(obj, {
  get(target, prop, receiver) {
    return prop + 'Test';
  },
});

Reflect.get(p, 'x'); // xTest

// Proxy with get handler and receiver
let x = { name: 'x', age: 1 };
let y = { name: 'y' };
let p2 = new Proxy(x, {
  get(target, prop, receiver) {
    return receiver[prop] + '!!!';
  },
});

Reflect.get(p2, 'name', y); // y!!!
```

### Reflect.getOwnPropertyDescriptor(target, propertyKey)

与 Object.getOwnPropertyDescriptor 类似，如果在对象中存在，则返回给定的属性的属性描述符。否则返回 undefined。

差别在于，如果 target 不是对象，Reflect 会抛出错误而 Object 会将其强制转换为对象处理（undefined 和 null 除外)。

参数：

1. target：获取属性描述符的目标对象
2. propertyKey：需要获描述符的属性名称

返回值：如果属性存在则返回描述符，否则返回 undefined

异常：target 不是 Object，抛出 TypeError

示例：

使用 Reflect.getOwnPropertyDescriptor

```js
Reflect.getOwnPropertyDescriptor({ x: 'hello' }, 'x');
// {value: "hello", writable: true, enumerable: true, configurable: true}

Reflect.getOwnPropertyDescriptor({ x: 'hello' }, 'y');
// undefined

Reflect.getOwnPropertyDescriptor([], 'length');
// {value: 0, writable: true, enumerable: false, configurable: false}
```

与 Object.getOwnPropertyDescriptor() 的不同点

```js
Reflect.getOwnPropertyDescriptor('foo', 0);
// TypeError: Reflect.getOwnPropertyDescriptor called on non-object

Object.getOwnPropertyDescriptor('foo', 0);
// { value: "f", writable: false, enumerable: true, configurable: false }
```

### Reflect.getPrototypeOf(target)

与 Object.getPrototypeOf 几乎一样，返回指定对象的隐式原型（[[Prototype]]，即多数浏览器实现的\_\_proto\_\_）

参数：

1. target：获取原型的目标对象

返回值：返回给定对象的原型，如果给定对象没有继承的属性，则返回 null

异常：target 不是 Object，抛出 TypeError

示例：

使用 Reflect.getPrototypeOf()

```js
Reflect.getPrototypeOf({}); // Object.prototype
Reflect.getPrototypeOf(Object.prototype); // null
Reflect.getPrototypeOf(Object.create(null)); // null
```

与 Object.getPrototypeOf() 比较

```js
// 如果参数为 Object，返回结果相同
Object.getPrototypeOf({}); // Object.prototype
Reflect.getPrototypeOf({}); // Object.prototype

// 在 ES5 规范下，对于非 Object，两者都抛异常
Object.getPrototypeOf('foo'); // Throws TypeError
Reflect.getPrototypeOf('foo'); // Throws TypeError

// 在 ES2015 规范下，Reflect 抛异常, Object 强制转换非 Object
Object.getPrototypeOf('foo'); // String.prototype
Reflect.getPrototypeOf('foo'); // Throws TypeError

// 如果想要模拟 Object 在 ES2015 规范下的表现，需要强制类型转换
Reflect.getPrototypeOf(Object('foo')); // String.prototype
```

### Reflect.has(target, propertyKey)

与 in 操作符相同：propertyKey in target。会检查原型链。

参数：

1. target：目标对象
2. propertyKey：需要检查的属性名称

返回值：Boolean，目标对象是否存在该属性

异常：target 不是 Object，抛出 TypeError

示例：

使用 Reflect.has()

```js
Reflect.has({ x: 0 }, 'x'); // true
Reflect.has({ x: 0 }, 'y'); // false

// 如果该属性存在于原型链中，返回true
Reflect.has({ x: 0 }, 'toString');

// Proxy 对象的 .has() 句柄方法
obj = new Proxy(
  {},
  {
    has(t, k) {
      return k.startsWith('door');
    },
  }
);
Reflect.has(obj, 'doorbell'); // true
Reflect.has(obj, 'dormitory'); // false
```

### Reflect.isExtensible(target)

判断一个对象是否可扩展（即是否可新增属性），与 Object.isExtensible 相似。差别在于，如果 target 不是对象，Reflect 会抛出错误而 Object 会将其强制转换为对象处理。

参数：

1. target：目标对象

返回值：Boolean，目标对象是否可扩展。

异常：target 不是 Object，抛出 TypeError

示例

使用 Reflect.isExtensible()

```js
// 新建的对象是可扩展的
let empty = {};
Reflect.isExtensible(empty); // === true

// 但是可扩展性是可变的
Reflect.preventExtensions(empty);
Reflect.isExtensible(empty); // === false

// Object.seal()方法封闭一个对象，阻止添加新属性并将所有现有属性标记为不可配置。当前属性的值只要原来是可写的就可以改变。被封闭的对象是不可扩展的
let sealed = Object.seal({});
Reflect.isExtensible(sealed); // === false

// 被冻结的对象也是不可扩展的
let frozen = Object.freeze({});
Reflect.isExtensible(frozen); // === false
```

与 Object.isExtensible() 的不同点

```js
// 抛出异常
Reflect.isExtensible(1);
// TypeError: Reflect.isExtensible called on non-object

// 转换为对象处理
Object.isExtensible(1);
// false
```

### Reflect.ownKeys(target)

获取目标对象自身（不包括继承的）属性名（键）的数组。类似于 Object.keys，区别在于 Object.keys 受属性 enumerable 影响而 Reflect.ownKeys 返回所有，包括不可枚举的自身属性键。

Reflect.ownKeys 方法返回一个由目标对象自身的属性键组成的数组。它的返回值等同于 Object.getOwnPropertyNames(target).concat(Object.getOwnPropertySymbols(target))。

参数：

1. target：目标对象

返回值：目标对象属性键的数组

异常：target 不是 Object，抛出 TypeError

示例：

使用 Reflect.ownKeys()

```js
Reflect.ownKeys({ z: 3, y: 2, x: 1 }); // [ "z", "y", "x" ]
Reflect.ownKeys([]); // ["length"]

let sym = Symbol.for('comet');
let sym2 = Symbol.for('meteor');
let obj = {
  [sym]: 0,
  str: 0,
  773: 0,
  0: 0,
  [sym2]: 0,
  '-1': 0,
  8: 0,
  'second str': 0,
};
Reflect.ownKeys(obj);
// [ "0", "8", "773", "str", "-1", "second str", Symbol(comet), Symbol(meteor) ]
// Indexes in numeric order,
// strings in insertion order,
// symbols in insertion order
```

### Reflect.preventExtensions(target)

阻止新属性添加到目标对象（将目标对象设置为不可扩展的），类似于 Object.preventExtensions。

参数：

1. target：阻止扩展的目标对象

返回值：Boolean，设置是否成功。

异常：target 不是 Object，抛出 TypeError

示例：
使用 Reflect.preventExtensions

```js
// 新建对象默认是可扩展的
let empty = {};
Reflect.isExtensible(empty); // === true

// 不过可扩展性可以被修改
Reflect.preventExtensions(empty);
Reflect.isExtensible(empty); // === false
```

Reflect.preventExtensions VS Object.preventExtensions

```js
// 如果 target 不是对象抛出 TyperError
Reflect.preventExtensions(1);
// TypeError: Reflect.preventExtensions called on non-object

// 如果 target 不是对象则强制转换为对象处理
Object.preventExtensions(1);
// 1
```

### Reflect.set(target, propertyKey, value[, receiver])

工作方式就像在对象上设置一个属性。

参数：

1. target：设置属性的目标对象
2. propertyKey：设置属性的名称
3. value：设置属性的值
4. receiver（可选）：target 上如果定义了 setter，那么作为 setter 调用时的 this 值

返回值：Boolean，设置是否成功。

异常：target 不是 Object，抛出 TypeError

示例：

使用 Reflect.set()

```js
// Object
let obj = {};
Reflect.set(obj, 'prop', 'value'); // true
obj.prop; // "value"

// Array
let arr = ['duck', 'duck', 'duck'];
Reflect.set(arr, 2, 'goose'); // true
arr[2]; // "goose"

// 可用于删除数组元素
Reflect.set(arr, 'length', 1); // true 就像执行arr.length = 1一样
arr; // ["duck"];

// 设置时只有target参数
let obj = {};
Reflect.set(obj); // true
obj; // { undefined: undefined }
Reflect.getOwnPropertyDescriptor(obj, 'undefined');
// { value: undefined, writable: true, enumerable: true, configurable: true }
```

### Reflect.setPrototypeOf(target, prototype)

设置目标对象的隐式原型（[[Prototype]]，即多数浏览器中实现的\_\_proto\_\_）为另一个对象或者 null，与 Object.setPrototypeOf 方法相似，差别在于 Object.setPtototype 返回 target 对象而不是 Boolean。

参数：

1. target：设置原型的目标对象
2. prototype：对象的新原型，一个对象或者 null

返回值：Boolean，设置是否成功。

异常：target 不是 Object，或者 prototype 不是对象也不是 null，则抛出 TypeError

示例：

使用 Reflect.setPrototypeOf()

```js
Reflect.setPrototypeOf({}, Object.prototype); // true

// 可以修改一个对象的[[Prototype]]为null
Reflect.setPrototypeOf({}, null); // true

// 如果不可扩展，则返回false
Reflect.setPrototypeOf(Object.freeze({}), null); // false

// 如果产生了循环链，则返回false
let target = {};
let proto = Object.create(target);
Reflect.setPrototypeOf(target, proto); // false
```
