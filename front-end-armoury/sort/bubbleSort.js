/**
 * 冒泡排序，稳定，时间复杂度O(n^2)
 * @param {Array} arr
 */
function bubbleSort(arr) {
  const length = arr.length;
  let flag = false;

  for (let i = 0; i < length - 1; ++i) {
    flag = false;

    for (let j = 0; j < length - 1 - i; ++j) {
      if (arr[j] > arr[j + 1]) {
        flag = true;

        const temp = arr[j + 1];
        arr[j + 1] = arr[j];
        arr[j] = temp;
      }
    }

    if (!flag) {
      break;
    }
  }
}

const arr = [1, 4, 6, 2, 3, 0, 12, 32, 1, 0];
bubbleSort(arr);
console.log(arr);

module.exports = {
  bubbleSort,
};
