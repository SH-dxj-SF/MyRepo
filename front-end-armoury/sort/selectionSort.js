/**
 * 选择排序，不稳定，时间复杂度O(n^2)
 * @param {*} arr
 */
function selectionSort(arr) {
  const length = arr.length;

  for (let i = 0; i < length; ++i) {
    let min = i;

    for (let j = i + 1; j < length; ++j) {
      if (arr[j] < arr[min]) {
        min = j;
      }
    }

    [arr[i], arr[min]] = [arr[min], arr[i]];
  }
}

const arr = [1, 4, 6, 2, 3, 0, 12, 32, 1, 0];
selectionSort(arr);
console.log(arr);

module.exports = {
  selectionSort,
};
