/**
 * 基数排序，稳定时间复杂度O(d*(n + n))
 * d: 关键码数量，比如说十进制数字中最大的绝对值为1234，那么d就是4
 * n: 待排序元素个数
 * r: 基数的范围，比如说十进制下就是10，考虑负数的话就为2 * 10 - 1
 * @param {*} arr
 */
function radixSort(arr) {
  const max = Math.max(...Array.from(arr, (num) => Math.abs(num)));

  // 因为用十进制处理，每一位都在[-9~0～9]之间，总共19个数值，所以19个桶
  const bukets = Array.from({ length: 2 * 10 - 1 }, () => []);

  let place = 1;

  // 外层d次迭代
  while (place <= max) {
    // 从个位开始，依次处理每个位

    // 分配n个数
    arr.forEach((num) => {
      // 取出当前位上的数值
      const digit = parseInt((num % (place * 10)) / place);
      // 使用偏移处理负数：前9个桶处理[-9 ～ -1]的，第10个桶处理0，第11到19个桶处理[1 ～ 9]
      bukets[digit + 9].push(num);
    });

    // 收集n个数
    let index = 0;
    bukets.forEach((buket) => {
      while (buket.length > 0) {
        arr[index++] = buket.shift();
      }
    });

    place *= 10;
  }
}

const arr = [
  7, -9, 8, -8, 9, 1, 10, 4, -7, 6, -6, 2, -5, 3, -4, 0, -3, -2, -12, 5, -1, 0,
  -22, -100,
];

radixSort(arr);
console.log(arr);

module.exports = {
  radixSort,
};
