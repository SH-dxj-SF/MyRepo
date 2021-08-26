## JS 数组类型判断方法

1. Array.isArray(arr)：ES5 新增，部分浏览器不支持（IE9 以下）---推荐
2. InstancOf：arr instanceOf Array
3. toString：Object.prototype.toString.call(arr) === ‘[object Array]’ ---推荐
4. constructor：arr.constructor === Array

注：instanceOf 和 constructor 方法要求判定的数组在同一个页面才会返回正确结果，比如一个页面（父）中有一个 iframe（其中引用了一个子页面），子页面中声明了一个数组，该数组赋值给了父页面中的一个变量，此时判断该变量将返回 false

## JS 数组方法

**改变原数组**：

1. push(…items)：将参数添加到数组尾部，并返回更新后的数组长度
2. pop()：删除最后一个元素并返回该元素，如果数组为空返回 undefined
3. unshift(…items)：将参数添加到数组头部，并返回更新后的数组长度
4. shift()：删除第一个元素并返回该元素，如果数组为空返回 undefined
5. sort((a, b) => number)：对原数组进行排序，参数为比较函数：如果希望排序后 a 在 b 前面则返回一个小于 0 的数字； a === b 返回 0；a > b 则返回大于 0 的数字。
6. reverse()：将原数组倒序
7. splice(start, deleteCount, …items)：从 start（负数表示倒数第几位）位置（包含），删除 deleteCount（可选，被省略则从 start 至末尾全部）个元素，添加 items（从 start 位置）

**不改变原数组**：concat、join、slice、find、findIndex、filter、fill、forEach、map、includes、indexOf…

## forEach(callback(currentValue [, index[, array]]), [, thisArg])

callback: 遍历每一个元素执行的函数

currentValue: 数组中正在处理的当前元素

index（可选）: 数组中正在处理的当前元素的索引

array（可选）: 方法正在操作的数组

thisArg（可选）: 执行 callback 时，用作 this 值

## Array.prototype.map 实现

**map()** 方法创建一个新数组，其结果是该数组中的每个元素是调用一次提供的函数后的返回值（包括 undefined）。

```js
function fakeMap(func, context) {
  const origin = this;
  const result = new Array(origin.length);
  for (let i = 0; i < origin.length; ++i) {
    if (origin.hasOwnProperty(i)) {
      // 保留 empty 但是不处理
      result[i] = func.call(context, origin[i], i, origin);
    }
  }
  return result;
}
```

注意 ⚠️：使用 Array.prototype.<方法名> 将方法设置到原型上

## Array.prototype.flat 实现

**flat()** 方法会按照一个可指定的深度递归遍历数组，并将所有元素与遍历到的子数组中的元素合并为一个新数组返回。只有一个可选参数：depth：默认为 1，提取深度。

**递归方式**

```js
/**
 *铺平数组，返回一个新数组
 * @param {number} [depth=1] 提取深度，默认为1
 * @returns Array
 */
function fakeFlat(depth = 1) {
  const origin = this;
  let result = [];
  origin.forEach((item) => {
    // forEach用于忽略empty
    if (Array.isArray(item)) {
      if (depth > 1) {
        item = item.fakeFlat(depth - 1);
      }
      item.forEach((itemInner) => {
        // forEach用于忽略empty
        result.push(itemInner);
      });
    } else {
      result.push(item);
    }
  });
  return result;
}
```

**迭代方式**

```js
function flatFake(depth = 1) {
  const origin = this;
  let result = origin;
  let temp = [];
  while (depth--) {
    result.forEach((item) => {
      if (Array.isArray(item)) {
        item.forEach((itemInner) => {
          temp.push(itemInner);
        });
      } else {
        temp.push(item);
      }
    });
    result = temp;
    temp = [];
  }
  return result;
}
```

## Array.prototype.flattenDeep（目前 2021-05-06 数组原型并未实现该方法）

所有层级元素全部提取

**递归方式**

```js
/**
 * 嵌套数组元素提取，无depth参数
 * @return Array 新数组
 */
function flattenDeep() {
  const origin = this;
  const result = [];
  origin.forEach((item) => {
    if (Array.isArray(item)) {
      item = item.flattenDeep();
      item.forEach((itemInner) => {
        result.push(itemInner);
      });
    } else {
      result.push(item);
    }
  });
  return result;
}
Array.prototype.flattenDeep = flattenDeep;
```

**迭代方式**

```js
/**
 * 深度提取（完全铺平）数组
 * 迭代写法
 * @returns {array} // 提取后的数组
 */
function flattenDeepI() {
  const origin = this;
  let result = origin;
  let again = true; // 标记是否还需再深一层提取。即此次提取过程中，是否又碰到数组，无则代表无需再迭代。初始化为true，保证提取至少一次

  while (again) {
    again = false;
    const temp = [];
    result.forEach((item) => {
      if (Array.isArray(item)) {
        item.forEach((itemInner) => {
          temp.push(itemInner);
        });
        again = true;
      } else {
        temp.push(item);
      }
    });
    result = temp;
  }

  return result;
}
Array.prototype.flattenDeep = flattenDeep;
```

## 数组去重（你需要唯一性，那为什么一开始不用 Set 呢？）

1. 利用 Set：无法处理控对象{}，ES6 中常用

```js
function unique(arr) {
  return [...new Set(arr)];
  // return Array.from(new Set(arr));
}
```

2. 单层循环利用 map 的 key 唯一性：同样无法处理{}

```js
function unique(arr) {
  const result = [];
  const map = new Map();
  for (const item of arr) {
    if (!map.has(item)) {
      result.push(item);
      map.set(item, item);
    }
  }
  return result;
}
```

3. 双层循环检查是否已存在

```js
// indexOf 判断：无法处理{}、NaN
function unique(arr) {
  const result = [];
  for (const item of arr) {
    if (result.indexOf(item) < 0) {
      result.push(item);
    }
  }
  return result;
}
```

```js
// includes 判断：无法处理{}
function unique(arr) {
  const result = [];
  for (const item of arr) {
    if (!result.includes(item)) {
      result.push(item);
    }
  }
  return result;
}
```
