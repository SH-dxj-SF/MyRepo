function insertionSort(arr) {
  const length = arr.length;

  for (let i = 1; i < length; ++i) {
    const curValue = arr[i];
    let pre = i - 1;

    while (pre >= 0 && arr[pre] > curValue) {
      arr[pre + 1] = arr[pre];
      pre--;
    }

    arr[pre + 1] = curValue;
  }
}

const arr = [1, 4, 6, 2, 3, 0, 12, 32, 1, 0];
insertionSort(arr);
console.log(arr);

module.exports = {
  insertionSort,
};
