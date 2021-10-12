function quickSort(array) {
  function sort(arr, left = 0, right = arr.length - 1) {
    if (left >= right) {
      return;
    }

    const baseValue = arr[right];
    let l = left;
    let r = right;

    while (l < r) {
      // 每一次迭代寻找一个比基准值大的放到基准值右侧、一个比基准值小的放到左侧

      while (l < r && arr[l] <= baseValue) {
        l++;
      }
      arr[r] = arr[l]; // 将较大的值放在右侧如果没有比基准值大的数就是将自己赋值给自己（l 等于 r）

      while (r > l && arr[r] >= baseValue) {
        r--;
      }
      arr[l] = arr[r]; // 将较小的值放在左侧如果没有比基准值小的数就是将自己赋值给自己（r 等于 l）
    }

    // 此时 l === r
    arr[r] = baseValue;
    sort(arr, left, r - 1);
    sort(arr, r + 1, right);
  }

  sort(array);
}

const arr = [1, 4, 6, 2, 3, 0, 12, 32, 1, 0];
quickSort(arr);
console.log(arr);

module.exports = {
  quickSort,
};
