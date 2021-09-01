# 创建型

## 工厂模式

抽象了创建具体对象的过程。由于 ES5 还不能使用 class，工程师们就发明了一种函数，用函数来封装以特定接口创建对象的细节。

目的（优点）：

- 封装了相同功能的代码，以此来实现批量生产（后续想要实现该功能只需要调用这个函数）
- 低耦合，高内聚：减少页面中冗余代码，提高代码的复用率。

```js
function createPerson(name, age, job) {
  const person = new Object();
  person.name = name;
  person.age = age;
  person.job = job;
  person.sayHello = function () {
    console.log('Hello, i am', this.name);
  };
  return person;
}

const p1 = createPerson('Jack', 12, 'student');
const p2 = createPerson('Mike', 20, 'teacher');

p1.sayHello(); // Hello, i am Jack
p2.sayHello(); // Hello, i am Mike
```

## 原型模式

利用原型对象来添加公共属性和方法，可以让所有实例共享原型对象所包含的属性和方法。

```js
function Person(name) {
  this.name = name;
}
Person.prototype.canWalk = true;
Person.prototype.say = function () {
  console.log('I am', this.name);
};
const p1 = new Person('Jack');
const p2 = new Person('Mike');
console.log(p1.canWalk, p2.canWalk); // true true
p1.say(); // I am Jack
p2.say(); // I am Mike
```

## 单例模式

保证一个类只有一个实例，并提供一个访问它（实例）的全局访问点。

应用场景: 全局遮罩层、全局状态工具（Vuex）

基础版实现

```js
function Singleton(name) {
  this.name = name;
}

Singleton._instance = null;

Singleton.getInstance = function (name) {
  // 静态方法中的this指向类Singleton本身，而不是其实例

  if (!this._instance) {
    this._instance = new Singleton(name);
  }
  return this._instance;
};

const instance1 = Singleton.getInstance('instance1');
const instance2 = Singleton.getInstance('instance2');

console.log(instance1 === instance2); // true

// ------------------------------------------------------

// ES6，class 语法
class Singleton {
  static _instance = null;

  constructor(name) {
    this.name = name;
  }

  static getInstance(name) {
    // 静态方法中的this指向类Singleton本身，而不是其实例
    if (!this._instance) {
      this._instance = new Singleton(name);
    }
    return this._instance;
  }
}

const instance1 = Singleton.getInstance('instance1');
const instance2 = Singleton.getInstance('instance2');

console.log(instance1 === instance2); // true
```

但是上述方法比较局限，只能使用静态方法 getInstance 来获取实例，不能使用 new 操作符进行实例化;同时管理单例和创建实例对象的功能耦合;

下边我们优化一下，解决 new 操作符的问题：使用到了闭包相关特性

```js
const Singleton = (function () {
  let _instance = null;
  return function (name) {
    if (!_instance) {
      this.name = name;
      _instance = this;
    }
    return _instance;
  };
})();

const instance1 = new Singleton('instance1');
const instance2 = new Singleton('instance2');

console.log(instance1 === instance2); // true

// ------------------------------------------------------

// ES6，class 语法
class Singleton {
  static _instance = null;

  constructor(name) {
    if (!Singleton._instance) {
      this.name = name;
      Singleton._instance = this;
    }
    return Singleton._instance;
  }
}

const instance1 = new Singleton('instance1');
const instance2 = new Singleton('instance2');

console.log(instance1 === instance2); // true
```

再优化一下，解决管理单例和实力对象创建耦合的问题

```js
function Person(name) {
  this.name = name;
}

const Singleton = (function () {
  let _instance = null;

  return function (name) {
    if (!_instance) {
      _instance = new Person(name);
    }
    return _instance;
  };
})();

const instance1 = new Singleton('instance1');
const instance2 = new Singleton('instance2');

console.log(instance1 === instance2); // true
```

通用惰性单例：和构造函数解耦，可以灵活创建不同的实例对象；并且在需要时才去创建实例。

```js
function Singleton(func) {
  let _instance = null;

  return function () {
    if (!_instance) {
      _instance = func.apply(this, arguments);
    }
    return _instance;
  };
}

function createDiv(innerText) {
  const eleDiv = document.createElement('div');
  eleDiv.style.width = '100vw';
  eleDiv.style.height = '100vh';
  eleDiv.innerText = innerText;
  eleDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
  document.body.appendChild(eleDiv);
  return eleDiv;
}

const createSingleLayer = Singleton(createDiv);

const instance1 = createSingleLayer('Hello');
const instance2 = createSingleLayer('world!');

console.log(instance1 === instance2); // true

// -----------------------------------------------

function Singleton(con) {
  let _instance = null;

  return function (...args) {
    if (!_instance) {
      _instance = new con(...args);
    }
    return _instance;
  };
}

function Person(name, age) {
  this.name = name;
  this.age = age;
}

class Car {
  year = 'default'; // 实例属性新写法，和在构造函数中this.year = year等价

  constructor(brand, model) {
    this.brand = brand;
    this.model = model;
  }
}

const createPerson = Singleton(Person);
const createCar = Singleton(Car);

const p1 = createPerson('Jack', 18);
const p2 = createPerson('Mike', 20);
const car1 = createCar('Honda', 'Civic');
const car2 = createCar('Honda', 'Accord');

console.log(p1 === p2); // true
console.log(car1 === car2); // true
```

# 结构型

## 适配器模式

## 代理模式

# 行为型

## 策略模式

定义一系列的算法，分别封装起来，让它们可以互相替换。目的就是将算法的实现和算法的使用分离开来。
一个策略模式至少应该包含两个部分：

- 一组策略类：封装了集体的算法，并负责具体的计算过程。
- 环境类：环境类接受用户的请求，然后把请求委托给某一个策略类。

优点：

- 利用了组合、委托、多态等技术和思想，有效避免了多重选择。
- 将算法封装在独立的策略中，易于理解、切换、扩展
- ...

缺点：

- 需了解每一个策略，它们之间的不同点，才能选择一个合适的策略。

实例：经典的奖金计算

粗糙的实现

```js
var calculateBouns = function (level, salary) {
  if (level === 'A') {
    return salary * 4;
  }
  if (level === 'B') {
    return salary * 3;
  }
  if (level === 'C') {
    return salary * 2;
  }
};
console.log(calculateBouns('A', 8000)); // 32000
console.log(calculateBouns('B', 10000)); // 30000
console.log(calculateBouns('C', 12000)); // 24000
```

策略模式改进

```js
// 策略类
var strategies = {
  A: function (num) {
    return num * 4;
  },
  B: function (num) {
    return num * 3;
  },
  C: function (num) {
    return num * 2;
  },
};
// 环境类
var calculateBouns = function (level, salary) {
  return strategies[level](salary);
};
console.log(calculateBouns('A', 8000)); // 32000
console.log(calculateBouns('B', 10000)); // 30000
console.log(calculateBouns('C', 12000)); // 24000
```

## 迭代器模式

## 观察者模式（发布-订阅）

## 命令模式

## 状态模式
