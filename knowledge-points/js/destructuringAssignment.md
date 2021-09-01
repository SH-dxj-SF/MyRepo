# 解构赋值（ES6）

通过解构赋值可以将对象中的属性、数组中的值取出，赋值给其他变量。就像这样：

```js
let a, b, rest;

[a, b] = [10, 20];
console.log(a); // 10
console.log(b); // 20

[a, b, ...rest] = [10, 20, 30, 40, 50];
console.log(a); // 10
console.log(b); // 20
console.log(rest); // [30, 40, 50]

({ a, b } = { a: 'valueOfA', b: 'valueOfB' }); // 括号是必要的，因为等号左侧的{a, b}会被看作代码块而不是对象字面量
console.log(a); // "valueOfA"
console.log(b); // "valueOfB"

// Stage 4（已完成）提案中的特性
({ a, b, ...rest } = { a: 10, b: 20, c: 30, d: 40 });
console.log(a); // 10
console.log(b); // 20
console.log(rest); // {c: 30, d: 40}
```

## 解构数组

变量声明同时赋值

```js
const arr = [1, 2, 3];
const [one, two, three] = arr;
console.log(three, two, one); // 3 2 1
```

变量先声明再赋值

```js
let a, b, c;
[a, b, c, d] = [1, 2, 3];
console.log(d, c, b, a); //undefined 3 2 1
```

默认值：为了防止从数组中取出一个 undefined 值

```js
let a, b, c;
const arr = [1, 2];
[a, b, c = 'default'] = arr;
console.log(c, b, a); // default 2 1
```

变量交换：没有解构赋值的情况下，交换两个变量需要一个临时变量。如果是交换两个数值，那么还可以使用 XOR 技巧（ ^ 操作符）

```js
let a = 1;
let b = 2;
[a, b] = [b, a];
console.log(a, b); // 2 1

// a ^ a === 0; 0 ^ any === any
a = 1;
b = 2;
a = a ^ b;
b = a ^ b; // 等价于 b = a ^ b ^ b 等价于 b = a
a = a ^ b; // 等价于 a = a ^ b ^ a 等价于 a = b
console.log(a, b); // 2 1

const arr = [1, 2, 3];
[arr[2], arr[1]] = [arr[1], arr[2]];
console.log(arr); // [3, 2, 1]
```

解析一个从函数返回的数组

```js
function func() {
  return [1, 2];
}
let a, b;
[a, b] = func();
console.log(a, b); // 1 2
```

忽略某些返回值：忽略你不关注的返回值

```js
function func() {
  return [1, 2, 3, 4, 5];
}
let a, b;
[a, , , b] = func();
console.log(a, b); // 1 4

// 当然也可以忽略所有返回值，不过好像没啥意义
[, , , ,] = func();
```

将剩余数组赋值给一个变量：赋值一个数组时，可以使用剩余模式，将数组剩余部分分配给一个变量

```js
function func() {
  return [1, 2, 3, 4, 5];
}
let a, b;
[a, ...b] = func();
console.log(a); // 1
console.log(b); // [2, 3, 4, 5]
```

注意：如果剩余元素右侧有逗号，将会抛出 SyntaxError，因为剩余元素必须是数组的最后的元素。

```js
let [a, ...rest, ] = [1, 2, 3]; // SyntaxError: Rest element must be last element
```

从正则表达式的匹配中提取值

用正则表达式的 exec()方法，匹配字符串会返回一个数组。这个数组的第一个值是完全匹配正则表达式的值，后续的值是表达式中捕获括号中的值。解构赋值可以轻易地提取出需要的部分，如果不需要完整匹配的话，可以将其忽略。

```js
function urlParser(url) {
  const reg = /^(\w+)\:\/\/([^\/]+)\/(.*)$/;
  const parsed = reg.exec(url);

  if (!parsed) {
    return {
      protocol: '',
      fullhost: '',
      fullpath: '',
    };
  }

  const [, protocol, fullhost, fullpath] = parsed;
  return {
    protocol,
    fullhost,
    fullpath,
  };
}

const urlTest = 'https://developer.mozilla.org/en-US/docs/Web/JavaScript';
const urlTest2 = 'http://localhost:8080/home';

console.log(urlParser(urlTest)); // {protocol: "https", fullhost: "developer.mozilla.org", fullpath: "en-US/Web/JavaScript"}
console.log(urlParser(urlTest2)); // {protocol: "http", fullhost: "localhost:8080", fullpath: "home"}

console.log(urlParser()); // {protocol: "", fullhost: "", fullpath: ""}
console.log(urlParser('test')); // {protocol: "", fullhost: "", fullpath: ""}
```

## 解构对象

基本赋值

```js
let obj = { p: 2, q: true };
let { p, q } = obj;
console.log(p, q); // 2 true
```

无声明赋值

```js
let p, q;
({ p, q } = { p: 2, q: true });
console.log(p, q); // 2 true
```

给新的变量名赋值

```js
let obj = { p: 2, q: true };
let { p: p2, q: q2 } = obj;
console.log(p2, q2); // 2 true
```

默认值：提取的对象属性为 undefined 时，变量会被赋予默认值

```js
let { a = 10, b = 5 } = { a: 3 };
console.log(a, b); // 3 5
```

给新的变量名赋值并提供默认值

```js
let { a: a2 = 10, b: b2 = 5 } = { a: 3 };
console.log(a2, b2); // 3 5
```

函数参数默认值

```js
// ES5
function drawES5Chart(options) {
  options = options === undefined ? {} : options;
  var size = options.size === undefined ? 'big' : options.size;
  var cords = options.cords === undefined ? { x: 0, y: 0 } : options.cords;
  var radius = options.radius === undefined ? 25 : options.radius;
  console.log(size, cords, radius);
  // now finally do some chart drawing

  // ES6——ES2015
  function drawES2015Chart({
    size = 'big',
    cords = { x: 0, y: 0 },
    radius = 25,
  } = {}) {
    console.log(size, cords, radius);
    // do some chart drawing
  }

  drawES2015Chart({
    cords: { x: 18, y: 30 },
    radius: 30,
  });
}

drawES5Chart({
  cords: { x: 18, y: 30 },
  radius: 30,
});
```

解构嵌套对象和数组

```js
const metadata = {
  title: 'Scratchpad',
  translations: [
    {
      locale: 'de',
      url: '/de/docs/Tools/Scratchpad',
      title: 'JavaScript-Umgebung',
    },
  ],
  url: '/en-US/docs/Tools/Scratchpad',
};

let {
  title: englishTitle, // rename
  translations: [
    {
      title: localeTitle, // rename
    },
  ],
} = metadata;

console.log(englishTitle); // Scratchpad
console.log(localeTitle); // JavaScript-Umgebung
```

for of 迭代和解构

```js
let people = [
  {
    name: 'Mike Smith',
    family: {
      father: 'Harry Smith',
    },
  },
  {
    name: 'Tom Jones',
    family: {
      father: 'Richard Jones',
    },
  },
];
for (let {
  name: n,
  family: { father: f },
} of people) {
  console.log('Name: ' + n + ', Father: ' + f);
}
// Name: Mike Smith, Father: Harry Smith
// Name: Tom Jones, Father: Richard Jones
```

从作为函数实参的对象中提取数据

```js
function userId({ id }) {
  return id;
}

function whois({ displayName: displayName, fullName: { firstName: name } }) {
  console.log(displayName + ' is ' + name);
}

var user = {
  id: 42,
  displayName: 'jdoe',
  fullName: {
    firstName: 'John',
    lastName: 'Doe',
  },
};

console.log('userId: ' + userId(user)); // userId: 42
whois(user); // jdoe is John
```

对象属性计算名和解构

```js
let key = 'z';
let { [key]: key2 } = { z: 'bar' };
console.log(key2); // bar
```

对象解构中的 Rest

```js
let { a, b, ...rest } = { a: 1, b: 2, c: 3, d: 4 };
console.log(a); // 1
console.log(b); // 2
console.log(rest); // {c: 3, d: 4}
```

无效的 JavaScript 标识符作为属性名称

通过提供有效的替代标识符，解构可以与不是有效的 JavaScript 标识符的属性名称一起使用。

> 代码中用来标识变量 (en-US)、函数、或属性 (en-US)的字符序列。
> 在 JavaScript 中，标识符只能包含字母或数字或下划线（“\_”）或美元符号（“$”），且不能以数字开头。标识符与字符串不同之处在于字符串是数据，而标识符是代码的一部分。在 JavaScript 中，无法将标识符转换为字符串，但有时可以将字符串解析为标识符。

```js
let foo = { 'fizz-buzz': true }; //
let { 'fizz-buzz': fizzBuzz } = foo;
console.log(fizzBuzz); // true
```

解构对象时会查找原型链（如果属性不在对象自身，将从原型链中查找）

```js
let obj = { name: 'nameOfObj' };
obj.__proto__.age = 18;
const { name, age } = obj; // nameOfObj 18
```
