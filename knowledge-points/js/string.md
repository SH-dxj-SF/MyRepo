## 替换字符串中某几位

这里以替换手机号中间四位为例

const tel = '13123456789' => '131\*\*\*\*6789'

1. 正则：

```js
function rep(origin, CUAR = '####') {
  // 正则
  return origin.replace(/(\d{3})(\d{4})(\d{4})/, `$1${CUAR}$3`);
}
console.log(rep(tel)); // 131####6789
console.log(rep(tel, '????')); // 131????6789
```

2. String.prototype.substring：

```js
function rep(origin, CUAR = '####') {
  // substring 方法
  return origin.substring(0, 3) + CUAR + origin.substring(7, 11);
}
console.log(rep(tel, '####')); // 131####6789
console.log(rep(tel, '****')); // 131****6789
```

3. Array.prototype.splice：

```js
function rep(origin, CUAR = '####') {
  // splice 方法
  const arr = origin.split('');
  arr.splice(3, 4, CUAR);
  return arr.join('');
}
console.log(rep(tel); // 131####6789
console.log(rep(tel, '----'); // 131----6789
```
