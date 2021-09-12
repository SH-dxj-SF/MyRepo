# 泛型

软件工程中，在创建一致的良好定义的 API 时，同时应该考虑可复用性。组件不仅能够支持当前的数据类型，而且能够支持未来的数据类型，这在创建大型系统时提供了十分灵活的功能。

## 泛型之 HelloWorld

我们定义一个函数：identity，功能就是返回传入给它的任何值。不使用泛型时可能会像这样：

```ts
function identity(arg: number): number {
  return arg;
}
// 或者使用 any 类型来定义函数：
function identity(arg: any): any {
  return arg;
}
```

使用 any 确实可以使函数接收任何类型的 arg 参数，但是丢失了一些信息，比如传入的参数和返回的结果是**相同类型**的。

所以我们使用类型变量，它是一种特殊的变量，只用于表示类型而不是值。

```ts
function identity<T>(arg: T): T {
  return arg;
}
```

当定义了泛型函数后，有两种使用方式：

1. 传入所有参数，包括类型参数

   ```ts
   let output = identity<number>(10);
   let output = identity<string>('10');
   ```

2. 不传类型参数，使用*类型推论（编译器根据传入参数类型，自动确定类型参数）*

   ```ts
   let output = identity('10');
   ```

## 使用泛型变量

使用泛型创建的泛型函数时，编译器要求你在函数体必须正确的使用这个通用的类型，也就是你必须把这个类型**当作是任意/所有**类型。

我们可能会想打印出 arg 参数的长度：

```ts
function identity<T>(arg: T[]): T[] {
  console.log(arg.length); // Property 'length' dose not exist on type 'T'
  return arg;
}
```

如果这样做，编译起会报错：使用了 arg 的.length 属性，但是没有地方指出 arg 具有这个属性。因为泛型变量代表的是任意类型，如果传入的数字类型，那么 arg 是没有 legnth 属性的，

我们将函数修改一下：

```ts
function identity<T>(arg: T[]): T[] {
  console.log(arg.length); // arg是一个数组，数组是有length属性的，所以不再有错误
  return arg;
}
```

这时参数是 T 类型的数组，数组是有 length 属性的。

## 泛型类型

泛型函数的类型

```ts
function identity<T>(arg: T[]): T[] {
  return arg;
}

const myIdentity: <T>(arg: T[]) => T[] = identity;
// 可以使用不同的泛型名，只要对应关系一致即可
const myIdentity: <U>(arg: U[]) => U[] = identity;
// 还可以使用带有调用签名的对象字面量来定义反省函数
const myIdentity: {<T>(arg: T) => T} = identity;
```

然后我们可以写出第一个泛型接口了：

```ts
interface GenericIdentityFn {
  <T>(arg: T): T;
}
// 或者
type GenericIdentityFn = <T>(arg: T) => T;

function identity<T>(arg: T): T {
  return arg;
}
const myIdentity: GenericIdentityFn = identity;
```

我们还可以将泛型参数当作接口的一个参数：

```ts
interface GenericIdentityFn<T> {
  (arg: T): T;
}
function identity<T>(arg: T): T {
  return arg;
}
const myIdentity: GenericIdentityFn<number> = identity;

// 这里做了些改动，不再描述泛型函数，而是把非泛型函数签名作为泛型类型一部分。 当我们使用 GenericIdentityFn的时候，还得传入一个类型参数来指定泛型类型（这里是：number），锁定了之后代码里使用的类型。
```

## 泛型类

泛型类看起来和泛型接口差不多，使用<>括起泛型类型，放在类名后：

```ts
class GenericNumber<T> {
  zeroValue: T;
  add: (x: T, y: T) => T;
}
let myGN = new GenericNumber<number>();
myGN.zeroValue = 0;
myGN.add = function (x, y) {
  return x + y;
};

let strNumeric = new GenericNumber<string>();
strNumeric.zeroValue = '';
strNumeric.add = function (x, y) {
  return x + y;
};
```

注意 ⚠️：类有两部分：实例部分和静态部分。泛型类指的是实例部分的类型，所以类的静态属性不能使用这个泛型类型。

## 泛型约束

Identity 例子中，我们试图访问 arg 的 length 属性，但是编译器并不能证明所有类型都有 length 属性，所以会报错。相比于操作 any 所有类型，我们想要限制函数处理任意带有 length 属性的类型，即 arg 至少包含这个属性。为此我们提出对泛型 T 的约束要求。

首先创建一个包含 length 属性的接口，然后使用接口和 extends 关键字拉实现约束：

```ts
interface LengthWise {
  length: number;
}
function loggingIdentity<T extends LengthWise>(arg: T): T {
  console.log(arg.length); // 不再报错
  return arg;
}
```

约束以后它也不再适用于任何类型，必须传入符合约束类型的值（包含必须的属性）

```ts
loggingIdentity(3); // Argument of type 'number' is not assignable to parameterof type 'LengthWise'

loggingIdentity({ length: 10, value: 3 });
```

### 在泛型约束中使用类型参数

你可以声明一个类型参数，且它被另一个类型参数所约束。 比如，现在我们想要用属性名从对象里获取这个属性。 并且我们想要确保这个属性存在于对象 obj 上，因此我们会在在这两个类型之间使用约束。

```ts
function getProperty(obj: T, key: K) {
  return obj[key];
}

let x = { a: 1, b: 2, c: 3, d: 4 };

getProperty(x, 'a'); // okay
getProperty(x, 'm'); // error: Argument of type 'm' isn't assignable to 'a' | 'b' | 'c' | 'd'.
```

### 在泛型里使用类类型

TS 中使用泛型创建工厂函数时，需要应用构造函数的类类型：

```ts
function create<T>(c: { new (): T }): T {
  return new c();
}
```

一个更高级的例子，使用原型属性推断并约束构造函数与类实例的关系：

```ts
class BeeKeeper {
  hasMask: boolean;
}
class ZooKeeper {
  nameTag: string;
}
class Animal {
  numLegs: number;
}
class Bee extends Animal {
  keeper: BeeKeeper;
}
class Lion extends Animal {
  keeper: ZooKeeper;
}
function createInstance<A extends Animal>(c: new () => A): A {
  return new c();
}
createInstance(Lion).keeper.nameTag; // typechecks
createInstance(Bee).keeper.hasMask; // typechecks
```
