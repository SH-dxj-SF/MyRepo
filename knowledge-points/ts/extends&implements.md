# extends

子类从基类中继承属性和方法，只能**单继承**。

```ts
class Animal {
  move() {
    console.log('Move');
  }
}

class Dog extends Animal {
  bark() {
    console.log('Woof!');
  }
}

let dog = new Dog();
dog.move(); // Move
dog.bark(); // Woof
```

# implements

实现接口，可以实现多个接口。

```ts
interface Eat {
  eat: () => void;
}

interface Drink {
  drink: () => void;
}

class Animal {
  move() {
    console.log('Move');
  }
}

class Dog extends Animal implements Eat, Drink {
  bark() {
    console.log('Woof!');
  }
  // 实现接口
  eat() {
    console.log('Eat bones');
  }
  // 实现接口
  drink() {
    console.log('Drink water');
  }
}
```

# 类和接口的关系（TS）

- 类可以实现接口，一个类可以**实现多个接口**

  示例请看 implements 部分

- 接口继承接口，接口可以多继承接口（或者类，这时类会被当作类型处理）

  ```ts
  interface Eat {
    eat: () => void;
  }

  interface Drink {
    drink: () => void;
  }

  class Animal {
    move() {
      console.log('Move');
    }
  }

  interface Person extends Animal, Eat, Drink {
    talk: () => void;
  }
  ```

- 接口继承类：常见的面向对象语言中，接口是不能继承类的。因为 TS 中创建类的时候同时会创建一个类型。所以我们既可以将其当作类使用也可以当作类型使用。

  ```ts
  class Animal {
    move() {
      console.log('Move');
    }
  }

  interface Person extends Animal {
    talk: () => void;
  }
  ```
