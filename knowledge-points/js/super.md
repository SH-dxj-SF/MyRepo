# super

super 用于调用一个对象父对象上的函数，super.prop 和 super[expr]表达式在**类**和**对象字面量**的**任何方法定义**中都是有效的。

## 语法

```js
// 调用父对象/父类的构造函数
super([arguments]);

// 调用父对象/父类上的方法
super.functionOnParent([arguments]);
```

## 描述

在构造函数中使用时，super 关键字将单独出现，并且必须在使用 this 关键字之前使用。super 关键字也可以用来调用父对象上的函数。

关于 super()必须在使用 this 前调用

由于实例属性/方法的继承机制在 es5 和 es6 不太一样：

- es5 中是先创建了子类实例对象 this，再将父类实例属性/方法添加到 this 上，即 SuperClass.apply(this)。
- es6 中是先将父类的实例属性/方法添加到 this 上，再用子类构造函数加工 this。也就是说子类实例的构建基于父类实例。

所以 es6 中的 super 方法必须先调用，否则子类拿不到实例对象 this。

## 示例

**在类中使用 super**

```js
class Rectangle {
  constructor(height, width) {
    this.name = 'Rectangle';
    this.height = height;
    this.witdh = width;
  }

  say() {
    console.log('Hi i am', this.name);
  }

  get area() {
    return this.height \* this.witdh;
  }

  set area(value) {
    this.area = value;
  }
}

class Square extends Rectangle {
  constructor(length) {
    // 派生类中，你必须在使用 this 前调用 super，否则会抛出一个引用错误（ReferenceError）。
    super(length, length);
    this.name = 'Square';
  }
}
```

**调用父类上的静态（static）方法**

注意 ⚠️：派生类静态方法中 super 只能调用父类静态方法，不能调用普通方法。同样的原型方法中 super 只能调用父类原型方法，不能调用静态方法。

```js
class Rectangle {
  constructor() {}

  static logNbSides() {
    return 'I have 4 sides';
  }
}

class Square extends Rectangle {
  constructor() {}

  static logDescription() {
    return super.logNbSides() + ' witch are all equal';
  }
}

console.log(Square.logDescription()); // I have 4 sides witch are all equal
```

**删除 super 上的属性将抛出引用错误**

```js
class Foo {
  foo() {}
}

class Bar extends Foo {
  delete() {
    delete super.foo;
  }
}

new Bar().delete(); // ReferenceError
```

**super.prop 不能复写不可写的属性，否则抛出 TypeError**

```js
class X {
  constructor() {
    Object.defineProperty(this, 'prop', {
      value: 1,
      configurable: true,
      writable: false,
    });
  }
}

class Y extends X {
  constructor() {
    super();
  }

  foo() {
    super.prop = 2;
  }
}

let y = new Y();
y.foo(); // 抛出 TypeError
```

**在对象字面量中使用 super.prop**

前提是我们需要使用 setPrototypeOf 方法将 obj2 的原型设置为 obj1

```js
let obj1 = {
  name: 'obj1',
  method1() {
    console.log('method1 of obj1');
  },
};

let obj2 = {
  name: 'obj2',
  // 注意 必须 是这种写法，而不能使用method2: function() {}
  method2() {
    // 相当于执行obj1.method1.call(this)，即context为obj2
    super.method1();
  },
};

Reflect.setPrototypeOf(obj2, obj1); // 也可以使用 Object.setPrototypeOf
obj2.method2(); // method1 of obj1
```
