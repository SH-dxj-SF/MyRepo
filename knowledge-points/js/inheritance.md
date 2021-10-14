# JS 继承的几种方式

首先 JS 继承需要做到两件事情：

1. 子类需要继承父类原型（prototype）的属性
2. 子类需要继承父类的属性

我们只要牢牢记住这两点，不论什么继承方式都是为了达成这两个目的。如果达不成，那就是不完善甚至没有意义的。

我们假设父类如下：

```js
function Person(age) {
  this.age = age || 0;
  this.hands = {
    left: 10,
    right: 10,
  };
}

Person.prototype.sleep = function () {
  console.log('sleeping');
};
```

## 方式一： 原型链继承（不推荐）❌

通过将子类原型指向父类的实例实现

缺点：

- 无法向父类构造函数传递参数
- 父类构造函数中**引用类型属性**被共享，一个实例修改了，其他所有子类实例会被影响。

```js
function Programmer() {}

Programmer.prototype = new Person();
Programmer.prototype.code = function () {
  console.log('coding');
};

const john = new Programmer();
john.code(); // coding
john.sleep(); // sleeping
john instanceof Person; // true
john instanceof Programmer; // true
Object.getPrototypeOf(john); // Person {age: 18, hands: {...} code: f}
john.__proto__; // Person {age: 18, hands: {...} code: f}

const mike = new Programmer();
john.hands.left; // 10
mike.hands.left; // 10
john.hands.left = 20;
john.hands.left; // 20
mike.hands.left; // 20
```

## 方式二：借用构造函数（经典继承）不推荐 ❌

子类构造函数通过调用父类构造函数，复制父类构造函数内的属性：

优点：

- 可向父类传递参数
- 避免了共享属性

缺点：

- 只是子类实例，不是父类实例
- 方法都在构造函数中定义，每次创建实例都会创建一遍方法
- 只能继承父类构造函数中的属性和方法，不能继承父类原型（prototype）的属性和方法

```js
function Programmer(name) {
  Person.call(this);
  this.name = name;
}
const john = new Programmer('john');
john.name; // john
john.age; // 18
john.sleep(); // Uncaught TypeError: jon.sleep is not a function
john instanceof Person; // false
john instanceof Programmer; // true
```

## 方式三：组合继承（推荐） 💡

组合了原型链继承和借用构造函数继承

优点：融合了原型链继承和构造函数继承的优点

缺点：调用了两次父类构造函数，生成了两份实例

```js
function Programmer(name, age) {
  Person.call(this, age);
  this.name = name;
}

Programmer.prototype = new Person();
Programmer.prototype.constructor = Programmer; // 修复构造函数指向

const john = new Programmer('john', 18);
john.name; // john
john.age; // 18
const mike = new Programmer('mike', 22);
mike.name; // mike
mike.age; // 18
john.age; // 18
john instanceof Person; // true;
john instanceof Programmer; // true;
mike instanceof Person; // true;
mike instanceof Programmer; // true;
```

## 方式四：寄生组合式继承（最佳）💡💡

子类构造函数复制父类构造函数中的属性和方法，子类原型只接受父类原型的属性和方法

```js
function setPrototype(child, parent) {
  // Object.create：创建一个新对象，使用第一个参数作为新创建对象的原型。
  // 第二个参数可选，新对象的属性描述符对象。类型参考Object.defineProperties()的第二个参数
  const prototype = Object.create(parent.prototype);
  prototype.constructor = child;
  child.prototype = prototype;
}

function Programmer(name, age) {
  Person.call(this, age);
  this.name = name;
}

setPrototype(Programmer, Person);
const john = new Programmer('john', 18);
john.name; // john
```

## 方式五：ES6 类继承（最佳）💡💡💡

优点：

- 无需手动设置原型
- 新标准，未来趋势

缺点：

- 新语法，目前不是所有浏览器都支持（但是绝大部分已经支持），需暂时转译为 es5 代码（babel）

```js
class Programmer extends Person {
  constructor(name, age) {
    super(age);
    this.name = name;
  }

  public code() {
    // 原型方法
    console.log('coding');
  }
}

const john = new Programmer('john', 18);
john.name; // john
john.age; // 18

const mike = new Programmer('mike', 22);
mike.name; // mike
mike.age; // 22
john instanceof Programmer; // true
john instanceof Person; // true
mike instanceof Programmer; // true
mike instanceof Person; // true
```

# 关于构造函数指向修复

我们注意到在实现继承的时候会出现这样的代码

```js
Programmer.prototype = new Person();
Programmer.prototype.constructor = Programmer; // 修复构造函数指向
```

或者这样

```js
const prototype = Object.create(parent.prototype);
prototype.constructor = child; // 修复构造函数指向
child.prototype = prototype;
```

其中将子构造函数原型设置为父构造函数原型的实例基本上没有什么疑惑，它们的作用都是为了继承到父类的属性。

那么将子构造函数新的原型的 constructor 属性修改为子构造函数自身的目的又是什么呢？

其实我们在 js 实现继承的过程中主要是修改和模拟原生原型链关系，因为原生的原型链它本身就是具有构造函数自身的 prototype 的 constructor 属性指向构造函数自身的特性。这么理解也是无可厚非的，那么我们反过来想，如果没有修改这个指向，会有什么影响吗？

我们看一个简单的例子：

```js
function Parent() {
  this.tagP = 'parent';
}

function Child() {
  Parent.call(this);
  this.tagC = 'child';
}

Child.prototype = Object.create(Parent.prototype); // 子构造函数prototype设置为父构造函数的实例
// Child.prototype.constructor = Child; // 修复constructor指向

const child1 = new Child();
console.log(child1.tagC, child1.tagP); // 'child' 'parent'

const child2 = new child1.constructor();
console.log(child1.tagC, child1.tagP); // undefined 'parent'
```

这是我们看到有一些问题产生了，就是当我们确定某个实例对象的构造方法的时候，可能会使用这个实例的 constructor 属性去构造一个同类实例对象。也就是这一行:

```js
const child2 = new child1.constructor();
```

这个时候它没能正确的查找到构造函数 Child，而是使用了 Parent。

原因就是，当我们将子构造函数的 prototype 设置为父构造函数的实例（也就是 Object.create(Parent.prototype 创建出来的这个对象)）以后，其实这个时候父类实例是没有 constructor 属性的。那么它就会沿着原型链往上查找，父类实例的隐式原型\_\_proto\_\_指向的是 Parent.ptototype，然后 Parent.prototype.constructor 指向了 Parent，所以就使用了构造函数 Parent 去生成新的 Child 实例。

所以为了处理此类问题，我们需要修复子构造函数 prototype 的 constructor 属性为子类构造函数自身。
