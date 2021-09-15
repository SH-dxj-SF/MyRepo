# 函数式编程

柯里化：把一个接受多个参数的函数转换成一个接受单个参数且返回结果的新函数。下边是一个简单的柯里化函数，能将一个函数柯里化。

```js
function currying(func, ...args) {
  return args.length >= func.length
    ? func(...args)
    : (...argsNext) => currying(func, ...args, ...argsNext);
}
```

或者只接收一个函数参数：

```js
function currying(func) {
  return function funcCurried(...args) {
    return args.length >= func.length
      ? func(...args)
      : (...argsNext) => funcCurried(...args, ...argsNext);
  };
}
```

看一个柯里化函数的例子（使用上述的第一种 curry 方法）：

```js
function add(x, y, z) {
  return x + y + z;
}

let addCurried = curry(add);
addCurried(1, 2, 3); // 6
addCurried(1, 2)(3); // 6
addCurried(1)(2)(3); // 6

let add10 = curry(add, 10); // function(y, z) {return 10 + y + z}
add10(20, 30); // 60
add10(100)(1000); // 1110
add10(90, 900); // 1000

let add100 = add10(90); // function(z) {return 10 + 100 + z}
let add500 = add10(490); // function(z) {return 10 + 490 + z}
add100(900); // 1000
add500(500); // 1400
```

add(1)(2)(3)(4)…

```js
// 利用了 valueOf 方法的特性
function add(num) {
  let count = num;

  function _add(n) {
    count += n;
    return _add;
  }
  _add.valueOf = function () {
    return count;
  };
  return _add;
}
```

add(1,2,3)(4)(5)(6,7)() => 28

add(1)(2)(3)() => 6

```js
function add(...args) {
  let nums = [...args];

  function _add(...argsNext) {
    if (argsNext.length === 0) {
      // 不再有参数传入作为计算结果的信号
      return nums.reduce((pre, cur) => {
        return pre + cur;
      }, 0);
    } else {
      nums.push(...argsNext);
      return _add;
    }
  }

  return _add;
}
```
