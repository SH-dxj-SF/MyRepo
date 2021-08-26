# new 运算符

new 运算符创建一个用户自定义的对象类型的实例或者具有构造函数的内置对象的实例。

## 语法

```js
new constructor[[arguments]]();
```

参数:

- constructor：一个指定对象实例的类型的类或函数

- arguments：被用于 constructor 函数调用的参数列表

## 描述

new 关键字会进行如下操作：

1. 创建一个空的简单 JavaScript 对象——{}
2. 为这个简单对象新增\_\_proto\_\_（隐士原型）属性，值为构造函数的 prototype（显示原型）属性。_因此，从构造函数创建的所有实例（使用 new 操作符），都可以访问添加到构造函数原型（prototype）的属性/对象。_
3. 绑定新创建的的对象为上下文对象——this。（现在，构造函数中所有对 this 的引用都是第一步中新创建的对象）
4. 如果该函数（constructor）没有返回对象，则返回 this（即第一步中新创建的对象）

所以我们可以大致模拟一下 new 操作符：

```js
function optNew(con, ...args) {
  const obj = Reflect.construct(con);
  // 或者这样
  // const obj = Object.create(con.prototype);
  const result = con.apply(obj, args);

  return result instanceof Object ? result : obj;
}
```

创建一个用户自定义的对象需要两步：

1. 通过编写指定名称和属性的函数来定义对象类型
2. 使用 new 操作符创建对象实例

当执行 new Foo(…)时，会发生如下事情：

1. 一个继承自 Foo.prototype 的新对象被创建。
2. 构造函数 Foo 传入指定的参数列表并调用，并且 Foo 中的上下文对象 this 指定为新创建的对象。new Foo 等价于 new Foo()，如果没有指定参数列表，Foo 调用时就没有参数。
3. 构造函数返回的对象（不能是 null 或者其他原始类型值），将作为 new 表达式的返回值。如果构造函数没有返回对象，那么第一步中新创建的对象将被返回。（通常，构造函数不会显示返回一个值，但是可以选择返回一个值覆盖普通对象的创建过程）。

注意 ⚠️：如果没有使用 new 操作符，构造函数会像其他函数一样被调用，并不会创建一个对象。此时，this 的指向也是不一样的。

## 实例

对象类型和对象实例

```js
function Car(make, model, year) {
  this.make = make;
  this.model = model;
  this.year = year;
}
const car1 = new Car('Eagle', 'Talon Tsi', '1993');
console.log(car1.make); // Eagle
```

对象属性为其他对象

```js
function Car(make, model, year, owner) {
  this.make = make;
  this.model = model;
  this.year = year;
  this.owner = owner;
}

function Person(name, age, sex) {
  this.name = name;
  this.age = age;
  this.sex = sex;
}

const rand = new Person('Rand McNally', 33, 'M');
const ken = new Person('Ken Jones', 39, 'M');

const car1 = new Car('Eagle', 'Talon Tsi', '1993', rand);
const car2 = new Car('Nissan', '300ZX', '1992', ken);

console.log(car2.owner.name); // Ken Jones
```
