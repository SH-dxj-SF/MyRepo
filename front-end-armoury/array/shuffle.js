/**
 * 打乱数组
 * 自己思路：每一位置随机选择一个位置（可能选中自身：处理过的位置可能再次选中进行交换）与之交换。
 * @returns {Array}
 */
function shuffle1() {
  const result = this.concat();
  for (let i = 0, length = result.length; i < length; ++i) {
    const randomIndex = Math.floor(Math.random() * length);
    [result[i], result[randomIndex]] = [result[randomIndex], result[i]];
  }
  return result;
}

/**
 * 打乱数组
 * 思路：每一个位置选择另一个位置（不可选中自身：处理过的位置不再会被选中）与之交换
 * @returns {Array}
 */
function shuffle2() {
  const result = this.concat();
  for (let i = result.length - 1; i > 0; --i) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [result[i], result[randomIndex]] = [result[randomIndex], result[i]];
  }
  return result;
}

// Array.prototype.shuffle = shuffle1;

module.exports = {
  shuffle1,
  shuffle2,
};
