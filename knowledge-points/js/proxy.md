# Proxy

Proxy 对象用于创建一个对象的代理，从而实现基本操作的拦截和重定义（如属性查找、赋值、枚举、函数调用等）。

## 语法

```js
const p = new Proxy(target, handler);
```

### 参数

- target：使用 Proxy 包装的目标对象（可以是任何类型的对象，包括原生数组，函数，甚至另外一个代理）
- handler：一个通常以函数作为属性的对象，各属性中的函数分别定义了在执行各种操作时代理 p 的行为。

  handler 对象的方法：handler 对象是一个容纳一批特定属性的占位符对象。它包含有 Proxy 的各个捕获器（trap）。所有的捕获器都是可选的，如果没有定义某一个捕获器，那么就会保留源对象的默认行为。

  - handler.getPrototypeOf()：Object.getPrototypeOf()方法的捕获器

  - handler.setPrototypeOf()：Object.setPrototypeOf()方法的捕获器

  - handler.isExtensible()：Object.isExtensible ()方法的捕获器

  - handler.preventExtensions()：Object.preventExtensions()方法的捕获器

  - handler.getOwnPropertyDescriptor()：Object.getOwnPropertyDescriptor()方法的捕获器

  - handler.defineProperty()：Object.defineProperty()方法的捕获器

  - handler.has()：in 操作符的捕获器

  - handler.get(target, property, receiver)

    属性读取操作的捕获器。

    this 绑定在对象 handler 上

    property：目标对象上需要被操作的属性名或 Symbol，比如 get 中代表要获取的属性、set 中要设置的属性。

    receiver：最初被调用的对象，通常为 proxy 对象自身。但是由于 handler 的 set 方法有可能在原型链上，或者以其他方式被间接地调用，所以不一定是 proxy 对象本身。比如：假设执行一段代码 obj.name = "jen"， obj 不是一个 proxy，且自身不含 name 属性，但是它的原型链上有一个 proxy，那么，那个 proxy 的 set() 处理器会被调用，而此时，obj 会作为 receiver 参数传进来

    可返回任何值。

    可拦截这些操作：

    - 属性访问：proxy[foo] 和 proxy.bar
    - 继承的属性  (原型链上的属性)访问：Object.create(proxy)[foo]
    - Reflect.get()

  - handler.set(target, property, value, receiver)

    属性设置操作的捕获器

    value: 新属性值

    应当返回一个布尔值：true 表示属性设置成功；严格模式下，返回 false 将会抛出一个 TypeError 异常

    可以拦截这些操作：

    - 属性赋值：proxy[foo] = bar 和 proxy.foo = bar
    - 继承的属性赋值：Object.create(proxy)[foo] = bar
    - Reflect.set()

  - handler.deleteProperty()：delete 操作符的捕获器

  - handler.ownKeys()：Object.getOwnPropertyNames()方法和 Object.getOwnPropertySymbols()方法的捕获器

  - handler.apply(target, thisArg, argumentsList)
    函数调用操作的捕获器，用于拦截函数的调用。

    this 绑定在 对象 handler 上。

    target 必须是可以被调用的（即必须是一个函数对象）。

    thisArg：被调用时的上下文对象

    argumentsList：被调用时的参数列表

    可以返回任何值。

    可以拦截这些操作：

    - proxy(...args)
    - Function.prototype.apply()和 Function.prototype.call()
    - Reflect.apply()

  - handler.construct(target, argumentsList, newTarget)

    new 操作符的捕获器，用于拦截 new 操作符，为了使 new 操作符在生成的 Proxy 对象上生效，用于初始化代理的 target 对象必须具有[[Construct]]内部方法（即 new target 必须是有效的）。

    this 绑定在 对象 handler 上

    argumentsList：constructor 的参数列表

    newTarget：最初被调用的构造函数，比如下例中的 p

    ```js
    function Test(name) {
      this.name = name;
    }
    const p = new Proxy(Test, {
      construct: function (target, argumentsList, newTarget) {
        console.log(target, argumentsList, newTarget);
        return new target(...argumentsList);
      },
    });

    // newTarget就是下边的p
    const obj = new p('nameObj');
    ```

    必须返回一个对象

    可以拦截这些操作：

    - new proxy(...args)
    - Reflect.construct()

---

关于 handler 中捕获器通用参数的解释：

- target：目标对象（函数）

我们看个例子，熟悉下语法：

```js
const target = {
  message1: 'hello',
  message2: 'everyone',
};

const handler1 = {};

const handler2 = {
  get: function (target, prop, receiver) {
    return 'world';
  },
};

const proxy1 = new Proxy(target, handle1);
const proxy2 = new Proxy(target, handler2);

// 因为handler1是空的，所以proxy1的行为就和原始对象一样
console.log(proxy1.message1, proxy1.message2); // hello everyone

// handler2我们提供了get()处理程序的实现，它拦截了尝试对目标对象的属性访问
console.log(proxy2.message1, proxy2.message2); // world world
```

在 Reflect 类的帮助下，我们可以赋予一些访问器原始行为并重新定义其他访问器。

```js
const target = {
  message1: 'hello',
  message2: 'everyone',
  message3: '你好',
};

const handler3 = {
  get: function (target, prop, receiver) {
    if (prop === 'message2') {
      return 'world';
    }

    return Reflect.get(...arguments);
  },
};

const proxy3 = new Proxy(target, handler3);
console.log(proxy3.message1, proxy3.message2, proxy3.message3); // hello world 你好
```

## 构造函数

Proxy()：创建一个新的 Proxy 对象

## 静态方法

Proxy.revocable()：用来创建一个可撤销的代理对象。

参数和 Proxy 构造函数一样。
返回一个对象（包含代理对象和一个撤销方法），{"proxy": proxy, "revoke": revoke}。

## 示例

基础示例：当对象中不存在某个属性时，默认返回"defaultValue"，使用了 get handler

```js
const handler = {
  get: function (target, prop) {
    return prop in target ? target[prop] : 'defaultValue';
  },
};

const p = new Proxy({}, handler);
p.a = 'aaa';
p.b = undefined;

console.log(p.a, p.b); // aaa undefined
console.log('c' in p, p.c); // false "defaultValue"
```

无操作转发代理：使用一个原生 JS 对象，代理会将所有应用到它（代理）的操作转发到这个对象上。

```js
const target = {};
const p = new Proxy(target, {});

p.name = 'nameOfP';
// 操作转发到目标对象

console.log(target.name); // nameOfP
// 操作已经正确转发到目标对象

// 注意⚠️：虽然“无操作”适用于JavaScript对象，但是不适用于原生浏览器对象，比如DOM元素。
```

验证：通过 Proxy，那你可以轻松地验证向一个对象的传值。下面例子展示了 set handler 的作用

```js
const validator = {
  set: function (obj, prop, value, receiver) {
    if (prop === 'age') {
      if (!Number.isInteger(value)) {
        throw new TypeError('The age is not an integer');
      }
      if (value > 200) {
        throw new RangeError('The age seems invalid');
      }
    }
    // 设置值的默认行为
    obj[prop] = value;
    return true; // 表示设置成功
  },
};

let person = new Proxy({}, validator);
person.age = 100;
console.log(person.age); // 100
persno.age = 'young';
// 抛出异常: Uncaught TypeError: The age is not an integer
person.age = 201;
// 抛出异常: Uncaught RangeError: The age seems invalid
```

扩展构造函数：可轻松通过一个新构造函数来扩展一个已有的构造函数，这个例子使用了 construct 和 apply

```js
function extend(sup, base) {
  // sup相当于父类，使用base（子类）扩展sup

  // 获取base构造函数的描述对象
  const descriptor = Object.getOwnPropertyDescriptor(
    base.prototype,
    'constructor'
  );
  // 修改base原型，改为以sup（父类）的原型为原型创建的新对象
  base.prototype = Object.create(sup.prototype);

  const handler = {
    construct: function (target, args) {
      // 拦截构造操作new、Reflect.construct()
      const obj = Object.create(base.prototype);
      this.apply(target, obj, args); // this绑定为handler，所以相当于调用handler.apply()
      return obj;
    },
    apply: function (target, thisArg, args) {
      // 拦截函数的调用
      sup.apply(thisArg, args);
      base.apply(thisArg, args);
    },
  };

  const proxy = new Proxy(base, handler); // 代理子类
  descriptor.value = proxy;
  Object.defineProperty(base.prototype, 'constructor', descriptor); // 修改原型构造函数指向，指向子类的代理对象
  return proxy;
}

function Person(name) {
  this.name = name;
}

const Boy = extend(Person, function (name, age) {
  this.age = age;
});

Boy.prototype.sex = 'M';

let b1 = new Boy('Jack', 12);
console.log(b1.name); // Jack
console.log(b1.age); // 12
console.log(b1.sex); // M
```

操作 DOM 节点：有时，我们可能需要互换两个不同元素的属性和类名。使用了 set handler：

```js
const obj = {
  selected: null,
};

const handler = {
  set: function (target, prop, newVal) {
    const oldVal = target[prop];

    if (prop === 'selected') {
      if (oldVal) {
        // 设置当前选中元素的ariaSlected属性为false，即取消选中
        oldVal.setAttribute('aria-selected', 'false');
      }
      if (newVal) {
        // 设置新选中元素的ariaSelected属性为true，即选中
        newVal.setAttribute('aria-selected', 'true');
      }
    }
    // 赋值操作默认行为
    target[prop] = newVal;

    return true; // 表示操作成功
  },
};

const view = new Proxy(obj, handler);

const item1 = (view.selected = document.getElementById('item-1')); // 选中元素item1
console.log(item1.getAttribute('aria-selected')); // true

const item2 = (view.selected = document.getElementById('item-2')); // 设置新的选中元素item2
console.log(item1.getAttribute('aria-selected')); // false 因为拦截操作将前一个选中元素（也就是这里的item1）的'aria-selected'属性设置为false
console.log(item2.getAttribute('aria-selected')); // true
```

修正值及附加属性：以下 products 代理会计算传值并根据需要转换为数组。这个代理对象同时支持一个叫做 latestBrowser 的附加属性，这个属性可以同时作为 getter 和 setter。

```js
const products = new Proxy(
  {
    browsers: ['Internet Explorer', 'Netscape'],
  },
  {
    set: function (target, prop, newVal) {
      // 附加一个属性latestBrowser
      if (prop === 'latestBrowser') {
        target.browsers.push(newVal);
        return;
      }

      // 类型不正确时进行转换
      if (typeof newVal === 'string') {
        newVal = [newVal];
      }

      // 默认行为
      target[prop] = newVal;

      return true; // 表示成功
    },
    get: function (target, prop) {
      // 附加一个属性latestBrowser
      if (prop === 'latestBrowser') {
        return target.browsers[target.browsers.length - 1];
      }
      // 默认行为
      return target[prop];
    },
  }
);

console.log(products.browsers); // ['Internet Explorer', 'Netscape']
products.browsers = 'Firefox'; // 如果不小心传入了一个字符串
console.log(products.browsers); // ['Firefox'] <- 也没问题, 得到的依旧是一个数组

products.latestBrowser = 'Chrome';
console.log(products.browsers); // ['Firefox', 'Chrome']
console.log(products.latestBrowser); // 'Chrome'
```

通过属性查找数组中的特定对象：以下代理为数组扩展了一些实用工具。如你所见，通过 Proxy，我们可以灵活地“定义”属性，而不需要使用 Object.defineProperties 方法。以下例子可以用于通过单元格来查找表格中的一行。在这种情况下，目标是 table.rows。

```js
const products = new Proxy(
  [
    { name: 'Firefox', type: 'browser' },
    { name: 'SeaMonkey', type: 'browser' },
    { name: 'Thunderbird', type: 'mailer' },
  ],
  {
    get: function (target, prop) {
      // 默认行为，返回属性值。prop通常是一个整数
      if (prop in target) {
        return target[prop];
      }

      // 获取 products 的 number; 它是 products.length 的别名
      if (prop === 'number') {
        return target.length;
      }

      let result;
      let types = {};

      for (const pro of target) {
        if (pro.name === prop) {
          result = pro;
        }
        if (types[pro.type]) {
          types[pro.type].push(pro);
        } else {
          types[pro.type] = [pro];
        }
      }

      // 通过name获取product
      if (result) {
        return result;
      }

      // 通过type获取products
      if (prop in types) {
        return types[prop];
      }

      // 获取types
      if (prop === 'types') {
        return Object.keys(types);
      }

      return undefined;
    },
  }
);

console.log(products[0]); // { name: 'Firefox', type: 'browser' }
console.log(products['Firefox']); // { name: 'Firefox', type: 'browser' }
console.log(products['Chrome']); // undefined
console.log(products.browser); // [{ name: 'Firefox', type: 'browser' }, { name: 'SeaMonkey', type: 'browser' }]
console.log(products.types); // ['browser', 'mailer']
console.log(products.number); // 3
```
